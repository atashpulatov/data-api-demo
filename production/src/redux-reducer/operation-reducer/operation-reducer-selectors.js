import { createSelector } from 'reselect';

const getOperationsState = state => state.operationReducer;

const getNotificationsState = state => state.notificationReducer;

// Selectors
export const selectOperations = createSelector(
  [getOperationsState],
  operationState => operationState.operations
);

export const selectGlobalNotification = createSelector(
  [getNotificationsState],
  notificationState => notificationState.globalNotification
);

export const selectNotifications = createSelector(
  [getNotificationsState],
  notificationState => notificationState.notifications
);
