import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DataOverview, objectNotificationTypes } from '@mstr/connector-components';

import { ApplicationTypeEnum } from '../../office-constants';
import overviewHelper from './overview-helper';
import useStateSyncOnDialogMessage from './use-state-sync-on-dialog-message';
import { refreshRequested, removeRequested } from '../../redux-reducer/operation-reducer/operation-actions';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { restoreAllNotifications } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { REMOVE_OPERATION } from '../../operation/operation-type-names';

import './overview-window.scss';

export const OverviewWindowNotConnected = (props) => {
  const {
    objects,
    notifications,
    onImport,
    onRefresh,
    onDelete,
    onDuplicate,
    onDismissNotification,
    popupData,
    activeCellAddress
  } = props;

  useStateSyncOnDialogMessage();

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
        onRefresh={onRefresh}
        onDelete={onDelete}
        onDuplicate={handleDuplicate}
        shouldDisableActions={shouldDisableActions} />
    </div>
  );
};

OverviewWindowNotConnected.propTypes = {
  onImport: PropTypes.func,
  onRefresh: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  onDismissNotification: PropTypes.func,
  objects: PropTypes.arrayOf(PropTypes.shape({})),
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
  popupData: PropTypes.shape({ objectWorkingId: PropTypes.number }),
  activeCellAddress: PropTypes.string
};

export const mapStateToProps = ({ objectReducer, notificationReducer, officeReducer }) => {
  const { objects } = objectReducer;
  const { notifications } = notificationReducer;
  const { popupData, activeCellAddress } = officeReducer;

  return {
    objects, notifications, popupData, activeCellAddress
  };
};

export const mapActionsToProps = {
  refreshRequested, removeRequested, restoreAllObjects, restoreAllNotifications
};
export const OverviewWindow = connect(mapStateToProps, mapActionsToProps)(OverviewWindowNotConnected);
