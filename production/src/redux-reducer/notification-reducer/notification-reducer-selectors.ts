import { createSelector } from 'reselect';

const getNotificationsState = (state: any): any => state.notificationReducer;

export const selectGlobalNotification = createSelector(
  [getNotificationsState],
  notificationState => notificationState.globalNotification
);

export const selectNotifications = createSelector(
  [getNotificationsState],
  notificationState => notificationState.notifications
);
