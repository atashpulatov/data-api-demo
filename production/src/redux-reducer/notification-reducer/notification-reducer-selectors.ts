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

const selectSidePanelBannerNotification = createSelector(
  [getNotificationsState],
  notificationState => notificationState.sidePanelBannerNotification
);

export const notificationReducerSelectors = {
  selectGlobalNotification,
  selectNotifications,
  selectSidePanelBannerNotification,
};
