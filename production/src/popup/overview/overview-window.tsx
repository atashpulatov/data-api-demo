import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import {
  DataOverview,
  ObjectNotificationTypes,
  OfficeApplicationType,
} from '@mstr/connector-components';
import { Button } from '@mstr/rc';

import useStateSyncOnDialogMessage from './use-state-sync-on-dialog-message';

import { popupHelper } from '../popup-helper';
import overviewHelper from './overview-helper';

import { Notification } from '../../redux-reducer/notification-reducer/notification-reducer-types';

import { selectorProperties } from '../../attribute-selector/selector-properties';
import i18n from '../../i18n';
import { OperationTypes } from '../../operation/operation-type-names';
import { restoreAllNotifications } from '../../redux-reducer/notification-reducer/notification-action-creators';
import {
  selectGlobalNotification,
  selectNotifications,
} from '../../redux-reducer/notification-reducer/notification-reducer-selectors';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import {
  refreshRequested,
  removeRequested,
} from '../../redux-reducer/operation-reducer/operation-actions';

import './overview-window.scss';

interface OverviewWindowProps {
  onImport?: () => void;
  onRefresh?: (objectWorkingIds: number[]) => Promise<void>;
  onEdit?: (objectWorkingId: number) => Promise<void>;
  onReprompt?: (objectWorkingIds: number[]) => Promise<void>;
  onDelete?: (objectWorkingIds: number[]) => Promise<void>;
  onDuplicate?: (
    objectWorkingIds: number[],
    insertNewWorksheet: boolean,
    withEdit: boolean
  ) => void;
  onRename?: (objectWorkingId: number, newName: string) => Promise<void>;
  onGoToWorksheet?: (objectWorkingId: number) => Promise<void>;
  onDismissNotification?: (objectWorkingIds: number[]) => Promise<void>;
  objects?: Array<Record<string, unknown>>;
  popupData?: { objectWorkingId: number };
  activeCellAddress?: string;
  filteredPageByLinkId?: string;
}

export const OverviewWindowNotConnected: React.FC<OverviewWindowProps> = props => {
  const {
    objects,
    onImport,
    onRefresh,
    onDelete,
    onDuplicate,
    onEdit,
    onReprompt,
    onRename,
    onGoToWorksheet,
    onDismissNotification,
    popupData,
    activeCellAddress,
    filteredPageByLinkId,
  } = props;

  useStateSyncOnDialogMessage();

  const [t] = useTranslation('common', { i18n });
  const [dialogPopup, setDialogPopup] = React.useState(null);

  const globalNotification = useSelector(selectGlobalNotification);
  const notifications: Notification[] = useSelector(selectNotifications);

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
          onDuplicate,
          setDialogPopup,
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  // TODO: Move logic for controlling popup visibility to Redux
  useEffect(() => {
    if (popupData) {
      overviewHelper.setRangeTakenPopup({
        objectWorkingIds: [popupData.objectWorkingId],
        setDialogPopup,
      });
    } else {
      setDialogPopup(null);
    }
  }, [popupData]);

  useEffect(() => {
    notifications.forEach(notification => {
      setTimeout(() => {
        if (
          notification.type === ObjectNotificationTypes.SUCCESS &&
          notification.operationType === OperationTypes.REMOVE_OPERATION
        ) {
          onDismissNotification([notification.objectWorkingId]);
        }
      }, 500);
    });
  }, [notifications, objects, onDismissNotification]);

  return (
    <div className='data-overview-wrapper'>
      <DataOverview
        loadedObjects={objectsToRender}
        popup={dialogPopup}
        applicationType={OfficeApplicationType.EXCEL}
        onAddData={onImport}
        onEdit={onEdit}
        onReprompt={onReprompt}
        onRefresh={onRefresh}
        onDuplicate={handleDuplicate}
        onDelete={onDelete}
        onRename={onRename}
        onGoTo={onGoToWorksheet}
        shouldDisableActions={shouldDisableActions}
        globalNotifications={notificationsToDisplay}
        filteredPageByLinkId={filteredPageByLinkId}
      />
      <Button className='overview-close-button' onClick={handleCloseDialog}>
        {t('Close')}
      </Button>
    </div>
  );
};

export const mapStateToProps = ({ objectReducer, officeReducer, popupStateReducer }: any): any => {
  const { objects } = objectReducer;
  const { popupData, activeCellAddress } = officeReducer;
  const { filteredPageByLinkId } = popupStateReducer;

  return {
    objects,
    popupData,
    activeCellAddress,
    filteredPageByLinkId,
  };
};

export const mapActionsToProps = {
  refreshRequested,
  removeRequested,
  restoreAllObjects,
  restoreAllNotifications,
};
export const OverviewWindow = connect(
  mapStateToProps,
  mapActionsToProps
)(OverviewWindowNotConnected);
