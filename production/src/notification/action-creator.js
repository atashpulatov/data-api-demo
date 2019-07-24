import {reduxNotificationProperties} from './notification-properties';

class ActionCreator {
  showNotificationAction = (title, content, notificationType, details) => {
    return {
      type: reduxNotificationProperties.actions.showNotification,
      title,
      content,
      notificationType: notificationType,
      currentObject: 'notification',
      details,
    };
  }
  showMessageAction = (content, messageType) => {
    return {
      type: reduxNotificationProperties.actions.showMessage,
      content,
      messageType: messageType,
      currentObject: 'message',
    };
  }
}

export const actionCreator = new ActionCreator();
