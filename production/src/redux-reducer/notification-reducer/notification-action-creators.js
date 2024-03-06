import { globalNotificationTypes } from '@mstr/connector-components';

import {
CLEAR_NOTIFICATIONS,   CREATE_GLOBAL_NOTIFICATION,   DELETE_NOTIFICATION, DISPLAY_NOTIFICATION_WARNING, REMOVE_GLOBAL_NOTIFICATION,
RESTORE_ALL_NOTIFICATIONS
} from './notification-actions';

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

export const displayObjectWarning = (objectWorkingId, notification) => ({
  type: DISPLAY_NOTIFICATION_WARNING,
  payload: { objectWorkingId, notification }
});

export const clearNotifications = () => ({ type: CLEAR_NOTIFICATIONS });

export const clearGlobalNotification = () => ({ type: REMOVE_GLOBAL_NOTIFICATION, });

export const restoreAllNotifications = (notifications) => ({
  type: RESTORE_ALL_NOTIFICATIONS,
  payload: notifications
});

export const createGlobalNotification = (globalNotification) => ({
  type: CREATE_GLOBAL_NOTIFICATION,
  payload: globalNotification,
});
