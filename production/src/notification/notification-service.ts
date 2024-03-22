import officeReducerHelper from '../office/store/office-reducer-helper';

import { Notification } from '../redux-reducer/notification-reducer/notification-reducer-types';

import {
  clearGlobalNotification,
  createConnectionLostNotification,
  createSessionExpiredNotification,
  deleteObjectNotification,
  displayGlobalNotification,
  displayObjectWarning,
} from '../redux-reducer/notification-reducer/notification-action-creators';
import { removeObject } from '../redux-reducer/object-reducer/object-actions';
import { cancelOperation } from '../redux-reducer/operation-reducer/operation-actions';

class NotificationService {
  reduxStore: any;

  init = (reduxStore: any): void => {
    this.reduxStore = reduxStore;
  };

  connectionLost = (): void => {
    this.reduxStore.dispatch(createConnectionLostNotification());
  };

  sessionExpired = (): void => {
    this.reduxStore.dispatch(createSessionExpiredNotification());
  };

  connectionRestored = (): void => {
    this.reduxStore.dispatch(clearGlobalNotification());
  };

  sessionRestored = (): void => {
    this.reduxStore.dispatch(clearGlobalNotification());
  };

  globalWarningAppeared = (payload: any): void => {
    this.reduxStore.dispatch(displayGlobalNotification(payload));
  };

  globalNotificationDissapear = (): void => {
    this.reduxStore.dispatch(clearGlobalNotification());
  };

  showObjectWarning = (objectWorkingId: number, notification: Notification): void => {
    this.reduxStore.dispatch(displayObjectWarning(objectWorkingId, notification));
  };

  dismissNotification = (objectWorkingId: number): void => {
    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  };

  dismissSuccessfulRemoveNotification = (objectWorkingId: number): void => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
    this.dismissNotification(objectWorkingId);
  };

  removeObjectFromNotification = (objectWorkingId: number): void => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
  };

  cancelOperationFromNotification = (objectWorkingId: number): void => {
    this.reduxStore.dispatch(cancelOperation(objectWorkingId));
  };

  /**
   * Removes the notification on rightside panel if exist
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  removeExistingNotification = (objectWorkingId: number): void => {
    const notification: any =
      officeReducerHelper.getNotificationFromNotificationReducer(objectWorkingId);
    if (notification) {
      this.callDismissNotification(notification);
    }
  };

  /**
   * Manually calls dismissNotification and callback methods from notifications.
   * This way, it dismisses all notifications available
   * Works for notifications concerning finished operations.
   * For others it doesn't bring any effect.
   *
   * @param {} notifications
   */
  dismissNotifications = (): void => {
    const currentState = this.reduxStore.getState();
    const { notifications } = currentState.notificationReducer;
    notifications.forEach((notification: Notification) => {
      this.callDismissNotification(notification);
    });
  };

  /**
   * Manually calls dismissNotification and callback methods from single notification.
   * This way, it dismisses notification of provided object
   *
   * @param notification
   */
  callDismissNotification = (notification: Notification): void => {
    notification.dismissNotification && notification.dismissNotification();
    notification.callback && notification.callback();
  };
}

export const notificationService = new NotificationService();
