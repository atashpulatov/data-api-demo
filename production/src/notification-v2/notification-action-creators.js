import { globalNotificationTypes } from '@mstr/rc';
import { CREATE_GLOBAL_NOTIFICATION, REMOVE_GLOBAL_NOTIFICATION } from './notification-reducer';

export const createConnectionLostNotification = () => ({
  type: CREATE_GLOBAL_NOTIFICATION,
  payload: globalNotificationTypes.CONNECTION_ERROR,
});

export const createSessionExpiredNotification = () => ({
  type: CREATE_GLOBAL_NOTIFICATION,
  payload: globalNotificationTypes.MSTR_SESSION_EXPIRED,
});

export const displayGlobalNotification = (payload) => {
  console.log(payload);
  return {
    type: CREATE_GLOBAL_NOTIFICATION,
    payload: {
      type: globalNotificationTypes.GLOBAL_WARNING,
      ...payload,
    }
  };
};

export const clearGlobalNotification = () => ({ type: REMOVE_GLOBAL_NOTIFICATION, });
