import {
  Notification,
  OperationTypesWithNotification,
} from '../redux-reducer/notification-reducer/notification-reducer-types';

import i18n from '../i18n';
import { titleOperationFailedMap } from '../redux-reducer/notification-reducer/notification-title-maps';
import { ErrorMessages } from '../error/constants';

class NotificationServiceHelper {
  getOkButton(payload: any): any[] {
    return [
      {
        type: 'basic',
        label: i18n.t('OK'),
        onClick: payload.notification.callback,
      },
    ];
  }

  getTitle(
    payload: { objectWorkingId: number; notification: Notification },
    notificationToUpdate: Notification
  ): string {
    return payload.notification.title === ErrorMessages.GENERIC_SERVER_ERR
      ? titleOperationFailedMap[
          notificationToUpdate.operationType as OperationTypesWithNotification
        ]
      : payload.notification.title;
  }
}

export const notificationServiceHelper = new NotificationServiceHelper();
