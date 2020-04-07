import {
  createConnectionLostNotification,
  createSessionExpiredNotification,
  clearGlobalNotification,
  displayGlobalNotification,
  deleteObjectNotification
} from '../redux-reducer/notification-reducer/notification-action-creators';
import { removeObject } from '../redux-reducer/object-reducer/object-actions';
import officeStoreObject from '../office/store/office-store-object';

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

  onSuccessfullNotificationHover = (objectWorkingId) => {
    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  }

  onRemoveSuccessfulNotificationHover = (objectWorkingId) => {
    console.log('onRemoveSuccessfulNotificationHover');
    officeStoreObject.removeObjectFromStore(objectWorkingId);
  }
}

export const notificationService = new NotificationService();
