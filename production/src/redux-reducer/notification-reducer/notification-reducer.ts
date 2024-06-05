/* eslint-disable @typescript-eslint/no-use-before-define */
import { ObjectNotificationTypes } from '@mstr/connector-components';

import { notificationService } from '../../notification/notification-service';

import type { OperationData } from '../operation-reducer/operation-reducer-types';
import {
  GlobalNotification,
  Notification,
  NotificationActions,
  NotificationActionTypes,
  NotificationState,
  OperationTypesWithNotification,
  OperationTypesWithProgressNotification,
} from './notification-reducer-types';

import i18n from '../../i18n';
import { getNotificationButtons } from '../../notification/notification-buttons';
import { OperationSteps } from '../../operation/operation-steps';
import { OperationTypes } from '../../operation/operation-type-names';
import {
  titleOperationCompletedMap,
  titleOperationFailedMap,
  titleOperationInProgressMap,
} from './notification-title-maps';
import { ErrorMessages } from '../../error/constants';

const initialState: NotificationState = { notifications: [], globalNotification: { type: '' } };

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
    notificationButtons = getNotificationButtons(
      getCancelButton(objectWorkingId, operationType, operationId)
    );
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
  payload: { objectWorkingId: number }
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
  };

  delete updatedNotification.children;
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const displayNotificationCompleted = (
  state: NotificationState,
  payload: { objectWorkingId: number }
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
    dismissNotification:
      notificationToUpdate.operationType === OperationTypes.REMOVE_OPERATION
        ? () =>
            notificationService.dismissSuccessfulRemoveNotification(
              notificationToUpdate.objectWorkingId
            )
        : () => notificationService.dismissNotification(notificationToUpdate.objectWorkingId),
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
  };
  newState.notifications = newState.notifications.filter(
    notification => notification.objectWorkingId !== payload.objectWorkingId
  );
  return newState;
};

const displayNotificationWarning = (
  state: NotificationState,
  payload: { objectWorkingId: number; notification: Notification }
): NotificationState => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationOrCreateEmpty(
    state,
    payload.objectWorkingId
  );

  const buttons = getOkButton(payload);
  const title = getTitle(payload, notificationToUpdate);

  const updatedNotification = {
    objectWorkingId: payload.objectWorkingId,
    type: ObjectNotificationTypes.WARNING,
    title: i18n.t(title),
    details: i18n.t(payload.notification.message),
    children: getNotificationButtons(buttons),
    callback: payload.notification.callback,
    operationType: notificationToUpdate.operationType,
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
});

const deleteAllNotifications = (
  state: NotificationState,
  action: { isSecured: boolean }
): NotificationState =>
  action.isSecured ? { notifications: [], globalNotification: state.globalNotification } : state;

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

const getOkButton = (payload: any): any[] => [
  {
    type: 'basic',
    label: i18n.t('OK'),
    onClick: payload.notification.callback,
  },
];

const getCancelButton = (
  objectWorkingId: number,
  operationType: OperationTypes,
  operationId: string
): any[] => [
  {
    type: 'basic',
    label: i18n.t('Cancel'),
    onClick: () => {
      if (operationType === OperationTypes.IMPORT_OPERATION) {
        notificationService.removeObjectFromNotification(objectWorkingId);
      }
      notificationService.cancelOperationFromNotification(operationId);
      notificationService.dismissNotification(objectWorkingId);
    },
  },
];

function getTitle(
  payload: { objectWorkingId: number; notification: Notification },
  notificationToUpdate: Notification
): string {
  return payload.notification.title === ErrorMessages.GENERIC_SERVER_ERR
    ? titleOperationFailedMap[notificationToUpdate.operationType as OperationTypesWithNotification]
    : payload.notification.title;
}

function createNewState(
  state: NotificationState,
  notificationToUpdateIndex: number,
  updatedNotification: Notification
): NotificationState {
  const newState = {
    notifications: [...state.notifications],
    globalNotification: state.globalNotification,
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
