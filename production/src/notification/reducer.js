import { reduxNotificationProperties } from './notification-properties';
import { NotificationError } from './notification-error';

export const notificationReducer = (state = {}, action) => {
  if (!action.type) {
    throw new NotificationError('Missing type');
  }
  switch (action.type) {
    case reduxNotificationProperties.actions.showMessage:
      return onShowMessage(action);
    case reduxNotificationProperties.actions.showNotification:
      return onShowNotification(action);
    case reduxNotificationProperties.actions.showTranslatedNotification:
      return onShowNotification(action, true);
    default:
      break;
  }
  return state;
};

function onShowMessage(action) {
  if (!action.currentObject) {
    throw new NotificationError('Missing currentObject');
  }
  if (!action.content) {
    throw new NotificationError('Missing content');
  }
  if (!action.messageType) {
    throw new NotificationError('Missing messageType');
  }
  return {
    timeStamp: Date.now(),
    currentObject: action.currentObject,
    content: action.content,
    messageType: action.messageType,
  };
}

function onShowNotification(action, translated) {
  if (!action.title) {
    throw new NotificationError('Missing title');
  }
  if (!action.currentObject) {
    throw new NotificationError('Missing currentObject');
  }
  if (!action.content) {
    throw new NotificationError('Missing content');
  }
  if (!action.notificationType) {
    throw new NotificationError('Missing notificationType');
  }
  return {
    timeStamp: Date.now(),
    currentObject: action.currentObject,
    title: action.title,
    content: action.content,
    notificationType: action.notificationType,
    details: action.details,
    translated,
    onConfirm: action.onConfirm,
  };
}
