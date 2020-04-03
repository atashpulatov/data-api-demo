import { createConnectionLostNotification, createSessionExpiredNotification, clearGlobalNotification } from './notification-action-creators';

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
}

export const notificationService = new NotificationService();
