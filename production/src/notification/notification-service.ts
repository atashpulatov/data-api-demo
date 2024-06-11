import {
  Notification,
  OperationTypesWithNotification,
} from '../redux-reducer/notification-reducer/notification-reducer-types';

import i18n from '../i18n';
import { OperationTypes } from '../operation/operation-type-names';
import { deleteObjectNotification } from '../redux-reducer/notification-reducer/notification-action-creators';
import { titleOperationFailedMap } from '../redux-reducer/notification-reducer/notification-title-maps';
import { removeObject } from '../redux-reducer/object-reducer/object-actions';
import { cancelOperationByOperationId } from '../redux-reducer/operation-reducer/operation-actions';
import { ErrorMessages } from '../error/constants';

class NotificationService {
  reduxStore: any;

  officeReducerHelper: any;

  init = (reduxStore: any, officeReducerHelper: any): void => {
    this.reduxStore = reduxStore;
    this.officeReducerHelper = officeReducerHelper;
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

  cancelOperationFromNotification = (operationId: string): void => {
    this.reduxStore.dispatch(cancelOperationByOperationId(operationId));
  };

  /**
   * Removes the notification on rightside panel if exist
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  removeExistingNotification = (objectWorkingId: number): void => {
    const notification: any =
      this.officeReducerHelper.getNotificationFromNotificationReducer(objectWorkingId);
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

  getOkButton(payload: any): any[] {
    return [
      {
        type: 'basic',
        label: i18n.t('OK'),
        onClick: payload.notification.callback,
      },
    ];
  }

  getCancelButton(
    objectWorkingId: number,
    operationType: OperationTypes,
    operationId: string
  ): any[] {
    return [
      {
        type: 'basic',
        label: i18n.t('Cancel'),
        onClick: () => {
          if (operationType === OperationTypes.IMPORT_OPERATION) {
            this.removeObjectFromNotification(objectWorkingId);
          }
          this.cancelOperationFromNotification(operationId);
          this.dismissNotification(objectWorkingId);
        },
      },
    ];
  }

  getTitle(
    payload: { objectWorkingId: number; notification: Notification },
    notificationToUpdate: Notification
  ): string {
    return payload.notification.title === ErrorMessages.GENERIC_SERVER_ERR
      ? titleOperationFailedMap[
          notificationToUpdate.operationType as OperationTypesWithNotification
        ]
      : payload.notification.title;
  }
}

export const notificationService = new NotificationService();
