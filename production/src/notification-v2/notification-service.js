import {
  createConnectionLostNotification,
  createSessionExpiredNotification,
  clearGlobalNotification,
  displayGlobalNotification,
  deleteObjectNotification,
  displayObjectWarning
} from '../redux-reducer/notification-reducer/notification-action-creators';
import officeStoreObject from '../office/store/office-store-object';
import { removeObject } from '../redux-reducer/object-reducer/object-actions';
import { cancelOperation } from '../redux-reducer/operation-reducer/operation-actions';

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
    officeStoreObject.removeObjectFromStore(objectWorkingId);
    this.dismissNotification(objectWorkingId);
  }

  removeObjectFromNotification = (objectWorkingId) => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
  }

  cancelOperationFromNotification = (objectWorkingId) => {
    this.reduxStore.dispatch(cancelOperation(objectWorkingId));
  }
}

export const notificationService = new NotificationService();
