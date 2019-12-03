import { actionCreator } from './action-creator';

export class NotificationService {
  constructor() {
    if (NotificationService.instance) {
      return NotificationService.instance;
    }
    NotificationService.instance = this;
    return this;
  }

  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  displayMessage = (type, content) => {
    const action = actionCreator.showMessageAction(content, type);
    this.reduxStore.dispatch(action);
  }

  displayNotification = ({ type, content, details, title = ' ', onConfirm = null }) => {
    const action = actionCreator.showNotificationAction(title, content, type, details, onConfirm);
    this.reduxStore.dispatch(action);
  }

  displayTranslatedNotification = ({ type, content, details, title = ' ', onConfirm = null }) => {
    const action = actionCreator.showTranslatedNotification(title, content, type, details, onConfirm);
    this.reduxStore.dispatch(action);
  }
}

export const notificationService = new NotificationService();
