import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxStore } from '../../store';
import { refreshRequested, removeRequested } from '../../redux-reducer/operation-reducer/operation-actions';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { restoreAllNotifications } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { PopupTypeEnum } from '../../home/popup-type-enum';

// TODO this component should be replaced with CC Overview component
const OverviewWindowNotConnected = (props) => {
  const {
    onRefresh, onDelete, onDuplicate, onDismissNotification
  } = props;
  const { objects, notifications } = props;

  useEffect(() => {
    // Get Message from Right side panel
    Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, (msg) => {
      const message = JSON.parse(msg.message);
      const { popupType } = message;

      if (popupType === PopupTypeEnum.importedDataOverview) {
        const { objects: objectsToRestore, notifications: notificationsToRestore } = message;

        reduxStore.dispatch(restoreAllObjects(objectsToRestore));
        reduxStore.dispatch(restoreAllNotifications(notificationsToRestore));
      }
    });
  }, []);

  return (
    <div>
      <h1>Overview Demo Window</h1>
      <h3>Object list</h3>
      <ol>
        {objects.map((object) => (
          <li key={object.objectWorkingId}>
            <h5>{object.name}</h5>
            <button type="button" onClick={() => onRefresh([object.objectWorkingId])}>Refresh</button>
            <button type="button" onClick={() => onDelete([object.objectWorkingId])}>Delete</button>
            <button type="button" onClick={() => onDuplicate([object.objectWorkingId])}>Duplicate</button>

          </li>
        ))}
      </ol>

      <h3>Notifications</h3>
      <ol>
        {notifications.map((notification) => (
          <li key={notification.objectWorkingId}>
            <h5>{notification.title} - {notification.objectWorkingId}</h5>
            <button type="button" onClick={() => onDismissNotification([notification.objectWorkingId])}>Dismiss Notification</button>
          </li>
        ))}
      </ol>

    </div>
  );
};

OverviewWindowNotConnected.propTypes = {
  onRefresh: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  onDismissNotification: PropTypes.func,
  objects: PropTypes.arrayOf(PropTypes.shape({})),
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
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
