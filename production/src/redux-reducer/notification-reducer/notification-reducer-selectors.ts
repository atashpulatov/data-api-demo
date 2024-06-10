import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { NotificationState } from './notification-reducer-types';

const getNotificationsState = (state: RootState): NotificationState => state.notificationReducer;

const selectGlobalNotification = createSelector(
  [getNotificationsState],
  notificationState => notificationState.globalNotification
);

const selectNotifications = createSelector(
  [getNotificationsState],
  notificationState => notificationState.notifications
);

const selectSidePanelNotification = createSelector(
  [getNotificationsState],
  notificationState => notificationState.sidePanelNotification
);

export const notificationReducerSelectors = {
  selectGlobalNotification,
  selectNotifications,
  selectSidePanelNotification,
};
