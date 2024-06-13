import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  DataOverview,
  ObjectNotificationTypes,
  OfficeApplicationType,
} from '@mstr/connector-components';
import { Button } from '@mstr/rc';

import useGetOverviewWindowErrorPopup from './use-get-overview-window-error-popup';
import useStateSyncOnDialogMessage from './use-state-sync-on-dialog-message';

import { popupHelper } from '../popup-helper';
import overviewHelper from './overview-helper';

import { selectorProperties } from '../../attribute-selector/selector-properties';
import i18n from '../../i18n';
import { OperationTypes } from '../../operation/operation-type-names';
import { notificationReducerSelectors } from '../../redux-reducer/notification-reducer/notification-reducer-selectors';
import { selectObjects } from '../../redux-reducer/object-reducer/object-reducer-selectors';
import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';
import { popupStateSelectors } from '../../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';

import './overview-window.scss';

export const OverviewWindow: React.FC = () => {
  const activeCellAddress = useSelector(officeSelectors.selectActiveCellAddress);
  const objects = useSelector(selectObjects);
  const globalNotification = useSelector(notificationReducerSelectors.selectGlobalNotification);
  const notifications = useSelector(notificationReducerSelectors.selectNotifications);
  const prefilteredSourceObjectName = useSelector(
    popupStateSelectors.selectPrefilteredSourceObjectName
  );
  useStateSyncOnDialogMessage();

  const [t] = useTranslation('common', { i18n });
  const [dialogPopup, setDialogPopup] = React.useState(null);

  const shouldDisableActions = useMemo(
    () =>
      notifications.some(notification => notification.type === ObjectNotificationTypes.PROGRESS),
    [notifications]
  );

  const objectsToRender = useMemo(
    () => overviewHelper.transformExcelObjects(objects, notifications),
    [objects, notifications]
  );

  const notificationsToDisplay = useMemo(
    () =>
      overviewHelper.getWarningsToDisplay({
        notifications,
        globalNotification,
      }),
    [notifications, globalNotification]
  );

  const handleCloseDialog = (): void => {
    const { commandCloseDialog } = selectorProperties;
    const message = { command: commandCloseDialog };
    popupHelper.officeMessageParent(message);
  };

  const handleDuplicate = async (objectWorkingIds: number[]): Promise<void> =>
    new Promise((resolve, reject) => {
      try {
        overviewHelper.setDuplicatePopup({
          objectWorkingIds,
          activeCellAddress,
          onDuplicate: overviewHelper.sendDuplicateRequest,
          setDialogPopup,
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  useGetOverviewWindowErrorPopup({ setDialogPopup });

  useEffect(() => {
    notifications.forEach(notification => {
      setTimeout(() => {
        if (
          notification.type === ObjectNotificationTypes.SUCCESS &&
          notification.operationType === OperationTypes.REMOVE_OPERATION
        ) {
          overviewHelper.sendDismissNotificationRequest(
            [notification.objectWorkingId],
            notification.operationId
          );
        }
      }, 500);
    });
  }, [notifications, objects]);

  return (
    <div className='data-overview-wrapper'>
      <DataOverview
        loadedObjects={objectsToRender}
        popup={dialogPopup}
        applicationType={OfficeApplicationType.EXCEL}
        onAddData={overviewHelper.sendImportRequest}
        onEdit={overviewHelper.sendEditRequest}
        onReprompt={overviewHelper.sendRepromptRequest}
        onRefresh={overviewHelper.sendRefreshRequest}
        onDuplicate={handleDuplicate}
        onDelete={overviewHelper.sendDeleteRequest}
        onRename={overviewHelper.sendRenameRequest}
        onGoTo={overviewHelper.sendGoToWorksheetRequest}
        shouldDisableActions={shouldDisableActions}
        globalNotifications={notificationsToDisplay}
        prefilteredSourceObjectName={prefilteredSourceObjectName}
      />
      <Button className='overview-close-button' onClick={handleCloseDialog}>
        {t('Close')}
      </Button>
    </div>
  );
};
