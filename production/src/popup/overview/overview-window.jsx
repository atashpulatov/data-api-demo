import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { DataOverview, objectNotificationTypes } from '@mstr/connector-components';
import PropTypes from 'prop-types';
import { reduxStore } from '../../store';
import { refreshRequested, removeRequested } from '../../redux-reducer/operation-reducer/operation-actions';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { restoreAllNotifications, createGlobalNotification } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { ApplicationTypeEnum } from '../../office-constants';

import './overview-window.scss';
import overviewHelper from './overview-helper';
import useStateSyncOnDialogMessage from './use-state-sync-on-dialog-message';

export const OverviewWindowNotConnected = (props) => {
  const {
    objects, onRefresh, onDelete, onDuplicate, notifications
  } = props;

  useStateSyncOnDialogMessage();

  // TODO This will be passed to DataOverview component once the component is updated
  const shouldDisableActions = useMemo(
    () => notifications.some((notification) => notification.type === objectNotificationTypes.PROGRESS), [notifications]
  );

  const objectsToRender = overviewHelper.transformExcelObjects(objects, notifications);

  return (
    <div className="data-overview-wrapper">
      <DataOverview
        loadedObjects={objectsToRender}
        applicationType={ApplicationTypeEnum.EXCEL}
        onRefresh={onRefresh}
        onDelete={onDelete}
        onDuplicate={onDuplicate} />
    </div>
  );
};

OverviewWindowNotConnected.propTypes = {
  onRefresh: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  objects: PropTypes.arrayOf(PropTypes.shape({})),
  notifications: PropTypes.arrayOf(PropTypes.shape({}))
};

export const mapStateToProps = ({ objectReducer, notificationReducer }) => {
  const { objects } = objectReducer;
  const { notifications } = notificationReducer;

  return { objects, notifications };
};

export const mapActionsToProps = {
  refreshRequested, removeRequested, restoreAllObjects, restoreAllNotifications
};
export const OverviewWindow = connect(mapStateToProps, mapActionsToProps)(OverviewWindowNotConnected);
