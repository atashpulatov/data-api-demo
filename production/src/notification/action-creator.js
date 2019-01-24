import { reduxNotificationProperties } from "./notification-properties";

class ActionCreator {
    showNotificationAction = (title, content, notificationType) => {
        return {
            type: reduxNotificationProperties.actions.showNotification,
            title,
            content,
            notificationType: notificationType,
            currentObject: 'notification',
        }
    }
    showMessageAction = (content, messageType) => {
        return {
            type: reduxNotificationProperties.actions.showMessage,
            content,
            messageType: messageType,
            currentObject: 'message',
        }
    }

}

export const actionCreator = new ActionCreator();