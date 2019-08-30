import { reduxNotificationProperties } from './notification-properties';

class ActionCreator {
  showNotificationAction = (title, content, notificationType, details, onConfirm) => ({
    type: reduxNotificationProperties.actions.showNotification,
    title,
    content,
    notificationType,
    currentObject: 'notification',
    details,
    onConfirm,
  });

  showTranslatedNotification = (title, content, notificationType, details, onConfirm) => ({
    type: reduxNotificationProperties.actions.showTranslatedNotification,
    title,
    content,
    notificationType,
    currentObject: 'notification',
    details,
    onConfirm,
  });

  showMessageAction = (content, messageType) => ({
    type: reduxNotificationProperties.actions.showMessage,
    content,
    messageType,
    currentObject: 'message',
  })
}

export const actionCreator = new ActionCreator();
