import {
  createConnectionLostNotification, createSessionExpiredNotification, clearGlobalNotification, displayGlobalNotification
} from '../redux-reducer/notification-reducer/notification-action-creators';

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
}

export const notificationService = new NotificationService();
