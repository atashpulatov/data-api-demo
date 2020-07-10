import {
  createConnectionLostNotification,
  createSessionExpiredNotification,
  clearGlobalNotification,
  displayGlobalNotification,
  deleteObjectNotification,
  displayObjectWarning,
} from '../redux-reducer/notification-reducer/notification-action-creators';
import { removeObject } from '../redux-reducer/object-reducer/object-actions';
import { cancelOperation } from '../redux-reducer/operation-reducer/operation-actions';
import officeReducerHelper from '../office/store/office-reducer-helper';

class NotificationService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  connectionLost = () => {
    this.reduxStore.dispatch(createConnectionLostNotification());
  };

  sessionExpired = () => {
    this.reduxStore.dispatch(createSessionExpiredNotification());
  }

  connectionRestored = () => {
    this.reduxStore.dispatch(clearGlobalNotification());
  }

  sessionRestored = () => {
    this.reduxStore.dispatch(clearGlobalNotification());
  }

  globalWarningAppeared = (payload) => {
    this.reduxStore.dispatch(displayGlobalNotification(payload));
  }

  globalNotificationDissapear = () => {
    this.reduxStore.dispatch(clearGlobalNotification());
  }

  showObjectWarning = (objectWorkingId, notification) => {
    this.reduxStore.dispatch(displayObjectWarning(objectWorkingId, notification));
  }

  dismissNotification = (objectWorkingId) => {
    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  }

  dismissSuccessfulRemoveNotification = (objectWorkingId) => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
    this.dismissNotification(objectWorkingId);
  }

  removeObjectFromNotification = (objectWorkingId) => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
  }

  cancelOperationFromNotification = (objectWorkingId) => {
    this.reduxStore.dispatch(cancelOperation(objectWorkingId));
  }

  /**
   * Removes the notification on rightside panel if exist
   *
   * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
   */
  removeExistingNotification = (objectWorkingId) => {
    const notification = officeReducerHelper.getNotificationFromNotificationReducer(objectWorkingId);
    if (notification) {
      this.callDismissNotification(notification);
    }
  }

  /**
   * Manually calls dismissNotification and callback methods from notifications.
   * This way, it dismisses all notifications available
   * Works for notifications concerning finished operations.
   * For others it doesn't bring any effect.
   *
   * @param {Object[]} notifications
   */
  dismissNotifications = () => {
    const currentState = this.reduxStore.getState();
    const { notifications } = currentState.notificationReducer;
    notifications.forEach((notification) => {
      this.callDismissNotification(notification);
    });
  }

  /**
   * Manually calls dismissNotification and callback methods from single notification.
   * This way, it dismisses notification of provided object
   *
   * @param {Object} notification
   */
  callDismissNotification = (notification) => {
    notification.dismissNotification && notification.dismissNotification();
    notification.callback && notification.callback();
  }
}

export const notificationService = new NotificationService();
