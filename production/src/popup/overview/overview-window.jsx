import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { DataOverview, objectNotificationTypes } from '@mstr/connector-components';
import { Button } from '@mstr/rc';

import PropTypes from 'prop-types';
import useStateSyncOnDialogMessage from './use-state-sync-on-dialog-message';

import { popupHelper } from '../popup-helper';
import overviewHelper from './overview-helper';


import { selectorProperties } from '../../attribute-selector/selector-properties';
import i18n from '../../i18n';
import { REMOVE_OPERATION } from '../../operation/operation-type-names';
import { restoreAllNotifications } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { refreshRequested, removeRequested } from '../../redux-reducer/operation-reducer/operation-actions';
import { ApplicationTypeEnum } from '../../office-constants';

import './overview-window.scss';

export const OverviewWindowNotConnected = (props) => {
  const {
    objects,
    notifications,
    globalNotification,
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
    activeCellAddress
  } = props;

  useStateSyncOnDialogMessage();

  const [t] = useTranslation('common', { i18n });
  const [dialogPopup, setDialogPopup] = React.useState(null);

  const shouldDisableActions = useMemo(
    () => notifications.some(
      (notification) => notification.type === objectNotificationTypes.PROGRESS
    ),
    [notifications]
  );

  const objectsToRender = useMemo(
    () => overviewHelper.transformExcelObjects(objects, notifications),
    [objects, notifications]
  );

  const notificationsToDisplay = useMemo(
    () => overviewHelper.getWarningsToDisplay({ notifications, globalNotification }),
    [notifications, globalNotification]
  );

  const handleCloseDialog = () => {
    const { commandCloseDialog } = selectorProperties;
    const message = { command: commandCloseDialog };
    popupHelper.officeMessageParent(message);
  };

  const handleDuplicate = (objectWorkingId) => overviewHelper.setDuplicatePopup({
    objectWorkingId,
    activeCellAddress,
    onDuplicate,
    setDialogPopup
  });

  // TODO: Move logic for controlling popup visibility to Redux
  useEffect(() => {
    if (popupData) {
      overviewHelper.setRangeTakenPopup({ objectWorkingId: popupData.objectWorkingId, setDialogPopup });
    } else {
      setDialogPopup(null);
    }
  }, [popupData]);

  useEffect(() => {
    notifications.forEach((notification) => {
      setTimeout(() => {
        if (notification.type === objectNotificationTypes.SUCCESS && notification.operationType === REMOVE_OPERATION) {
          onDismissNotification([notification.objectWorkingId]);
        }
      }, [500]);
    });
  }, [notifications, objects, onDismissNotification]);

  return (
    <div className="data-overview-wrapper">
      <DataOverview
        loadedObjects={objectsToRender}
        popup={dialogPopup}
        applicationType={ApplicationTypeEnum.EXCEL}
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
      />
      <Button className="overview-close-button" onClick={handleCloseDialog}>{t('Close')}</Button>
    </div>
  );
};

OverviewWindowNotConnected.propTypes = {
  onImport: PropTypes.func,
  onRefresh: PropTypes.func,
  onEdit: PropTypes.func,
  onReprompt: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  onRename: PropTypes.func,
  onGoToWorksheet: PropTypes.func,
  onDismissNotification: PropTypes.func,
  objects: PropTypes.arrayOf(PropTypes.shape({})),
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
  globalNotification: PropTypes.shape({}),
  popupData: PropTypes.shape({ objectWorkingId: PropTypes.number }),
  activeCellAddress: PropTypes.string
};

export const mapStateToProps = ({ objectReducer, notificationReducer, officeReducer }) => {
  const { objects } = objectReducer;
  const { notifications, globalNotification } = notificationReducer;
  const { popupData, activeCellAddress } = officeReducer;

  return {
    objects, notifications, globalNotification, popupData, activeCellAddress
  };
};

export const mapActionsToProps = {
  refreshRequested, removeRequested, restoreAllObjects, restoreAllNotifications
};
export const OverviewWindow = connect(mapStateToProps, mapActionsToProps)(OverviewWindowNotConnected);
