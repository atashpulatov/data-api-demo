import { GlobalNotificationTypes } from '@mstr/connector-components';

import {
  ClearGlobalNotificationAction,
  ClearNotificationsAction,
  CreateConnectionLostNotificationAction,
  CreateGlobalNotificationAction,
  CreateSessionExpiredNotificationAction,
  DeleteObjectNotificationAction,
  DismissAllNotificationsAction,
  DismissSingleNotificationAction,
  DisplayGlobalNotificationAction,
  DisplayNotificationCompletedAction,
  DisplayObjectWarningAction,
  Notification,
  NotificationActionTypes,
  RestoreAllNotificationsAction,
  SetSidePanelBannerAction,
  SidePanelBanner,
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

export const dismissSingleNotification = (
  objectWorkingId: number
): DismissSingleNotificationAction => ({
  type: NotificationActionTypes.DISMISS_SINGLE_NOTIFICATION,
  payload: { objectWorkingId },
});

export const dismissAllObjectsNotifications = (): DismissAllNotificationsAction => ({
  type: NotificationActionTypes.DISMISS_ALL_NOTIFICATIONS,
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

export const displaySuccessNotification = (
  objectWorkingId: number,
  dismissNotificationCallback: () => void
): DisplayNotificationCompletedAction => ({
  type: NotificationActionTypes.DISPLAY_NOTIFICATION_COMPLETED,
  payload: { objectWorkingId, dismissNotificationCallback },
});

export const setSidePanelBanner = (sidePanelBanner: SidePanelBanner): SetSidePanelBannerAction => ({
  type: NotificationActionTypes.SET_SIDE_PANEL_BANNER,
  payload: sidePanelBanner,
});
