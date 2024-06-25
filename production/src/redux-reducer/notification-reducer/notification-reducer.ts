/* eslint-disable @typescript-eslint/no-use-before-define */
import { ObjectNotificationTypes, SidePanelBannerStatus } from '@mstr/connector-components';

import { notificationServiceHelper } from '../../notification/notification-service-helper';

import type { OperationData } from '../operation-reducer/operation-reducer-types';
import {
  GlobalNotification,
  Notification,
  NotificationActions,
  NotificationActionTypes,
  NotificationState,
  OperationTypesWithNotification,
  OperationTypesWithProgressNotification,
  SidePanelBanner,
} from './notification-reducer-types';

import i18n from '../../i18n';
import { getNotificationButtons } from '../../notification/notification-buttons';
import { getNotificationCancelButton } from '../../notification/notification-cancel-button';
import { OperationSteps } from '../../operation/operation-steps';
import { OperationTypes } from '../../operation/operation-type-names';
import { titleOperationCompletedMap, titleOperationInProgressMap } from './notification-title-maps';

const initialState: NotificationState = {
  notifications: [],
  globalNotification: { type: '' },
  sidePanelBannerNotification: { type: SidePanelBannerStatus.NONE },
};

export const notificationReducer = (
  // eslint-disable-next-line default-param-last
  state = initialState,
  action: NotificationActions
): NotificationState => {
  switch (action.type) {
    case NotificationActionTypes.IMPORT_OPERATION:
    case NotificationActionTypes.REFRESH_OPERATION:
    case NotificationActionTypes.REMOVE_OPERATION:
    case NotificationActionTypes.DUPLICATE_OPERATION:
    case NotificationActionTypes.CLEAR_DATA_OPERATION:
    case NotificationActionTypes.EDIT_OPERATION:
      return createProgressNotification(state, action.payload);

    case NotificationActionTypes.MOVE_NOTIFICATION_TO_IN_PROGRESS:
      return moveNotificationToInProgress(state, action.payload);

    case NotificationActionTypes.DISPLAY_NOTIFICATION_COMPLETED:
      return displayNotificationCompleted(state, action.payload);

    case NotificationActionTypes.DISPLAY_NOTIFICATION_WARNING:
      return displayNotificationWarning(state, action.payload);

    case NotificationActionTypes.DELETE_NOTIFICATION:
      return deleteNotification(state, action.payload);

    case NotificationActionTypes.MARK_STEP_COMPLETED:
      return markFetchingComplete(state, action.payload);

    case NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION:
      return createGlobalNotification(state, action.payload);

    case NotificationActionTypes.REMOVE_GLOBAL_NOTIFICATION:
      return removeGlobalNotification(state);

    case NotificationActionTypes.TOGGLE_SECURED_FLAG:
      return deleteAllNotifications(state, action);

    case NotificationActionTypes.CLEAR_NOTIFICATIONS:
      return clearNotifications(state);

    case NotificationActionTypes.RESTORE_ALL_NOTIFICATIONS:
      return restoreAllNotifications(state, action.payload);

    case NotificationActionTypes.DISMISS_SINGLE_NOTIFICATION:
      return dismissSingleNotification(state, action.payload);

    case NotificationActionTypes.DISMISS_ALL_NOTIFICATIONS:
      return dismissAllNotifications(state);

    case NotificationActionTypes.SET_SIDE_PANEL_BANNER:
      return setSidePanelBannerNotification(state, action.payload);
    default:
      return state;
  }
};

const createProgressNotification = (
  state: NotificationState,
  { operation }: { operation: OperationData }
): NotificationState => {
  const { objectWorkingId, operationType, operationId } = operation;
  let notificationButtons;

  if (operationType !== OperationTypes.CLEAR_DATA_OPERATION) {
    notificationButtons = getNotificationCancelButton(objectWorkingId, operationType, operationId);
  }

  // DE288915: Avoid duplicate notifications, particularly those originating from Edit and Reprompt operations.
  const stateNotifications =
    state?.notifications && Array.isArray(state.notifications)
      ? state.notifications.filter(item => item.objectWorkingId !== objectWorkingId)
      : [];

  const newNotification: Notification = {
    objectWorkingId,
    title: i18n.t(titleOperationInProgressMap.PENDING_OPERATION),
    type: ObjectNotificationTypes.PROGRESS,
    operationType,
    children: notificationButtons,
  };
  return { ...state, notifications: [...stateNotifications, newNotification] };
};

const moveNotificationToInProgress = (
  state: NotificationState,
  payload: { objectWorkingId: number; operationId: string }
): NotificationState => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(
    state,
    payload.objectWorkingId
  );

  const updatedNotification = {
    ...notificationToUpdate,
    title: i18n.t(
      titleOperationInProgressMap[
        notificationToUpdate.operationType as OperationTypesWithProgressNotification
      ]
    ),
    isIndeterminate: getIsIndeterminate(notificationToUpdate),
    operationId: payload.operationId,
  };

  delete updatedNotification.children;
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const displayNotificationCompleted = (
  state: NotificationState,
  payload: { objectWorkingId: number; dismissNotificationCallback: any }
): NotificationState => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(
    state,
    payload.objectWorkingId
  );

  const updatedNotification = {
    ...notificationToUpdate,
    type: ObjectNotificationTypes.SUCCESS,
    title: i18n.t(
      titleOperationCompletedMap[
        notificationToUpdate.operationType as OperationTypesWithNotification
      ]
    ),
    dismissNotification: payload.dismissNotificationCallback,
  };
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const deleteNotification = (
  state: NotificationState,
  payload: { objectWorkingId: number }
): NotificationState => {
  const newState = {
    notifications: [...state.notifications],
    globalNotification: state.globalNotification,
    sidePanelBannerNotification: state.sidePanelBannerNotification,
  };
  newState.notifications = newState.notifications.filter(
    notification => notification.objectWorkingId !== payload.objectWorkingId
  );
  return newState;
};

const dismissSingleNotification = (
  state: NotificationState,
  payload: { objectWorkingId: number }
): NotificationState => {
  const { notifications } = state;

  const newNotifications = notifications.filter(
    ({ objectWorkingId }) => objectWorkingId !== payload.objectWorkingId
  );

  return {
    notifications: newNotifications,
    globalNotification: state.globalNotification,
    sidePanelBannerNotification: state.sidePanelBannerNotification,
  };
};

const dismissAllNotifications = (state: NotificationState): NotificationState => {
  const { notifications } = state;

  const newNotifications = notifications.filter(
    ({ type }) => type !== ObjectNotificationTypes.SUCCESS
  );

  return {
    notifications: newNotifications,
    globalNotification: state.globalNotification,
    sidePanelBannerNotification: state.sidePanelBannerNotification,
  };
};

const displayNotificationWarning = (
  state: NotificationState,
  payload: { objectWorkingId: number; notification: Notification }
): NotificationState => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationOrCreateEmpty(
    state,
    payload.objectWorkingId
  );

  const buttons = notificationServiceHelper.getOkButton(payload);
  const title = notificationServiceHelper.getTitle(payload, notificationToUpdate);

  const updatedNotification = {
    objectWorkingId: payload.objectWorkingId,
    type: ObjectNotificationTypes.WARNING,
    title: i18n.t(title),
    details: i18n.t(payload.notification.message),
    children: getNotificationButtons(buttons),
    callback: payload.notification.callback,
    operationType: notificationToUpdate.operationType,
    operationId: notificationToUpdate.operationId,
  };

  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const markFetchingComplete = (
  state: NotificationState,
  payload: { completedStep: OperationSteps; objectWorkingId: number }
): NotificationState => {
  if (payload.completedStep === OperationSteps.FETCH_INSERT_DATA) {
    const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(
      state,
      payload.objectWorkingId
    );
    const updatedNotification = {
      ...notificationToUpdate,
      isFetchingComplete: true,
    };
    return createNewState(state, notificationToUpdateIndex, updatedNotification);
  }
  return state;
};

const createGlobalNotification = (
  state: NotificationState,
  payload: GlobalNotification
): NotificationState => {
  payload.title = i18n.t(payload.title);

  if (payload.details) {
    payload.details = i18n.t(payload.details);
  }

  return { ...state, globalNotification: payload };
};

const removeGlobalNotification = (state: NotificationState): NotificationState => ({
  notifications: [...state.notifications],
  globalNotification: { type: '' },
  sidePanelBannerNotification: { type: SidePanelBannerStatus.NONE },
});

const deleteAllNotifications = (
  state: NotificationState,
  action: { isSecured: boolean }
): NotificationState =>
  action.isSecured
    ? {
        notifications: [],
        globalNotification: state.globalNotification,
        sidePanelBannerNotification: { type: SidePanelBannerStatus.NONE },
      }
    : state;

const clearNotifications = (state: NotificationState): NotificationState => ({
  ...state,
  notifications: initialState.notifications,
  globalNotification: initialState.globalNotification,
});

const restoreAllNotifications = (
  state: NotificationState,
  payload: Notification[]
): NotificationState => ({
  ...state,
  notifications: payload,
});

const setSidePanelBannerNotification = (
  state: NotificationState,
  payload: SidePanelBanner
): NotificationState => ({
  ...state,
  sidePanelBannerNotification: payload,
});

function createNewState(
  state: NotificationState,
  notificationToUpdateIndex: number,
  updatedNotification: Notification
): NotificationState {
  const newState = {
    notifications: [...state.notifications],
    globalNotification: state.globalNotification,
    sidePanelBannerNotification: state.sidePanelBannerNotification,
  };
  newState.notifications.splice(notificationToUpdateIndex, 1, updatedNotification);
  return newState;
}

function getNotificationOrCreateEmpty(
  state: NotificationState,
  objectWorkingId: number
): { notificationToUpdate: Notification; notificationToUpdateIndex: number } {
  try {
    return getNotificationToUpdate(state, objectWorkingId);
  } catch (error) {
    return {
      notificationToUpdate: {} as Notification,
      notificationToUpdateIndex: state.notifications.length,
    };
  }
}

function getNotificationToUpdate(
  state: NotificationState,
  objectWorkingId: number
): { notificationToUpdate: Notification; notificationToUpdateIndex: number } {
  const { notifications } = state;
  const notificationToUpdateIndex = getNotificationIndex(state, objectWorkingId);
  const notificationToUpdate = notifications[notificationToUpdateIndex];
  return { notificationToUpdate, notificationToUpdateIndex };
}

function getIsIndeterminate(notificationToUpdate: Notification): boolean {
  return !!(
    notificationToUpdate.operationType === OperationTypes.REMOVE_OPERATION ||
    notificationToUpdate.operationType === OperationTypes.CLEAR_DATA_OPERATION
  );
}

function getNotificationIndex(state: NotificationState, objectWorkingId: number): number {
  const notificationToUpdateIndex = state.notifications.findIndex(
    notification => notification.objectWorkingId === objectWorkingId
  );
  if (notificationToUpdateIndex === -1) {
    throw new Error();
  }
  return notificationToUpdateIndex;
}
