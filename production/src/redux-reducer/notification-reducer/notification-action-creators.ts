import { GlobalNotificationTypes } from '@mstr/connector-components';

import {
  ClearGlobalNotificationAction,
  ClearNotificationsAction,
  CreateConnectionLostNotificationAction,
  CreateGlobalNotificationAction,
  CreateSessionExpiredNotificationAction,
  DeleteObjectNotificationAction,
  DisplayGlobalNotificationAction,
  DisplayObjectWarningAction,
  Notification,
  NotificationActionTypes,
  RestoreAllNotificationsAction,
  SetSidePanelNotificationAction,
  SidePanelNotification,
  UpdateSidePanelNotificationAction,
} from './notification-reducer-types';

export const createConnectionLostNotification = (): CreateConnectionLostNotificationAction => ({
  type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION,
  payload: { type: GlobalNotificationTypes.CONNECTION_ERROR },
});

export const createSessionExpiredNotification = (): CreateSessionExpiredNotificationAction => ({
  type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION,
  payload: { type: GlobalNotificationTypes.MSTR_SESSION_EXPIRED },
});

export const displayGlobalNotification = (payload: any): DisplayGlobalNotificationAction => ({
  type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION,
  payload: {
    type: GlobalNotificationTypes.GLOBAL_WARNING,
    ...payload,
  },
});

export const deleteObjectNotification = (
  objectWorkingId: number
): DeleteObjectNotificationAction => ({
  type: NotificationActionTypes.DELETE_NOTIFICATION,
  payload: { objectWorkingId },
});

export const displayObjectWarning = (
  objectWorkingId: number,
  notification: Notification
): DisplayObjectWarningAction => ({
  type: NotificationActionTypes.DISPLAY_NOTIFICATION_WARNING,
  payload: { objectWorkingId, notification },
});

export const clearNotifications = (): ClearNotificationsAction => ({
  type: NotificationActionTypes.CLEAR_NOTIFICATIONS,
});

export const clearGlobalNotification = (): ClearGlobalNotificationAction => ({
  type: NotificationActionTypes.REMOVE_GLOBAL_NOTIFICATION,
});

export const restoreAllNotifications = (
  notifications: Notification[]
): RestoreAllNotificationsAction => ({
  type: NotificationActionTypes.RESTORE_ALL_NOTIFICATIONS,
  payload: notifications,
});

export const createGlobalNotification = (
  globalNotification: GlobalNotificationTypes
): CreateGlobalNotificationAction => ({
  type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION,
  payload: globalNotification,
});

export const setSidePanelNotification = (
  sidePanelNotification: SidePanelNotification
): SetSidePanelNotificationAction => ({
  type: NotificationActionTypes.SET_SIDE_PANEL_NOTIFICATION,
  payload: sidePanelNotification,
});

export const updateSidePanelNotification = (
  sidePanelNotification: SidePanelNotification
): UpdateSidePanelNotificationAction => ({
  type: NotificationActionTypes.UPDATE_SIDE_PANEL_NOTIFICATION,
  payload: sidePanelNotification,
});
