import { reduxStore } from '../store';

import {
  deleteObjectNotification,
  dismissAllObjectsNotifications,
  dismissSingleNotification,
} from '../redux-reducer/notification-reducer/notification-action-creators';
import { removeObject } from '../redux-reducer/object-reducer/object-actions';
import { cancelOperationByOperationId } from '../redux-reducer/operation-reducer/operation-actions';

class NotificationService {
  dismissNotification = (objectWorkingId: number): void => {
    reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  };

  dismissAllNotifications = (): void => {
    reduxStore.dispatch(dismissAllObjectsNotifications());
  };

  dismissSuccessfulRemoveNotification = (objectWorkingId: number): void => {
    reduxStore.dispatch(removeObject(objectWorkingId));
    this.dismissNotification(objectWorkingId);
  };

  removeObjectFromNotification = (objectWorkingId: number): void => {
    reduxStore.dispatch(removeObject(objectWorkingId));
  };

  cancelOperationFromNotification = (operationId: string): void => {
    reduxStore.dispatch(cancelOperationByOperationId(operationId));
  };

  /**
   * Removes the notification on rightside panel if exist
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  removeExistingNotification = (objectWorkingId: number): void => {
    reduxStore.dispatch(dismissSingleNotification(objectWorkingId));
  };
}

export const notificationService = new NotificationService();
