
import { reduxStore } from '../store';
import { createConnectionLostNotification, createSessionExpiredNotification, clearGlobalNotification } from './notification-action-creators';

class NotificationService {
  connectionLost = () => {
    reduxStore.dispatch(createConnectionLostNotification());
  };

  sessionExpired = () => {
    reduxStore.dispatch(createSessionExpiredNotification());
  }

  connectionRestored = () => {
    reduxStore.dispatch(clearGlobalNotification());
  }

  sessionRestored = () => {
    reduxStore.dispatch(clearGlobalNotification());
  }
}

export const notificationService = new NotificationService();
