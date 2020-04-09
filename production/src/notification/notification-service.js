class NotificationService {
  init = (reduxStore, actionCreator) => {
    this.reduxStore = reduxStore;
    this.actionCreator = actionCreator;
  }

  displayMessage = (type, content) => {
    const action = this.actionCreator.showMessageAction(content, type);
    this.reduxStore.dispatch(action);
  }

  displayNotification = ({
    type, content, details, title = ' ', onConfirm = null
  }) => {
    const action = this.actionCreator.showNotificationAction(title, content, type, details, onConfirm);
    this.reduxStore.dispatch(action);
  }

  displayTranslatedNotification = ({
    type, content, details, title = ' ', onConfirm = null
  }) => {
    const action = this.actionCreator.showTranslatedNotification(title, content, type, details, onConfirm);
    this.reduxStore.dispatch(action);
  }
}

export const notificationService = new NotificationService();
