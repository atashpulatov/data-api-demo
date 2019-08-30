import { reduxStore } from '../store';
import { actionCreator } from './action-creator';

class NotificationService {
  displayMessage = (type, content) => {
    const action = actionCreator.showMessageAction(content, type);
    reduxStore.dispatch(action);
  }

  displayNotification = ({
    type, content, details, title = ' ', onConfirm = null,
  }) => {
    const action = actionCreator.showNotificationAction(title, content, type, details, onConfirm);
    reduxStore.dispatch(action);
  }

  displayTranslatedNotification = ({
    type, content, details, title = ' ', onConfirm = null,
  }) => {
    const action = actionCreator.showTranslatedNotification(title, content, type, details, onConfirm);
    reduxStore.dispatch(action);
  }
}

export const notificationService = new NotificationService();
