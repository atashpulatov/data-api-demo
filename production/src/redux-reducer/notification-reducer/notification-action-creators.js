import { globalNotificationTypes } from '@mstr/rc';
import { CREATE_GLOBAL_NOTIFICATION, REMOVE_GLOBAL_NOTIFICATION, DELETE_NOTIFICATION } from './notification-reducer';

export const createConnectionLostNotification = () => ({
  type: CREATE_GLOBAL_NOTIFICATION,
  payload: { type: globalNotificationTypes.CONNECTION_ERROR, }
});

export const createSessionExpiredNotification = () => ({
  type: CREATE_GLOBAL_NOTIFICATION,
  payload: { type: globalNotificationTypes.MSTR_SESSION_EXPIRED, }
});

export const displayGlobalNotification = (payload) => ({
  type: CREATE_GLOBAL_NOTIFICATION,
  payload: {
    type: globalNotificationTypes.GLOBAL_WARNING,
    ...payload,
  }
});

export const deleteObjectNotification = (objectWorkingId) => ({
  type: DELETE_NOTIFICATION,
  payload: { objectWorkingId },
});

export const clearGlobalNotification = () => ({ type: REMOVE_GLOBAL_NOTIFICATION, });
