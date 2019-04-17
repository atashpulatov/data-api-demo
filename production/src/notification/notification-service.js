import {reduxStore} from '../store';
import {actionCreator} from './action-creator';

class NotificationService {
  displayMessage = (type, content) => {
    const action = actionCreator.showMessageAction(content, type);
    reduxStore.dispatch(action);
  }
  displayNotification = (type, content, title = ' ') => {
    const action = actionCreator.showNotificationAction(title, content, type);
    reduxStore.dispatch(action);
  }
}

export const notificationService = new NotificationService();
