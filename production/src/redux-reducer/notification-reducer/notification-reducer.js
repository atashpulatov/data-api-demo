/* eslint-disable @typescript-eslint/no-use-before-define */
import { ObjectNotificationTypes } from '@mstr/connector-components';

import { notificationService } from '../../notification/notification-service';

import i18n from '../../i18n';
import { getNotificationButtons } from '../../notification/notification-buttons';
import { OperationSteps } from '../../operation/operation-steps';
import { MARK_STEP_COMPLETED, OperationTypes } from '../../operation/operation-type-names';
import { officeProperties } from '../office-reducer/office-properties';
import {
  CLEAR_NOTIFICATIONS,
  CREATE_GLOBAL_NOTIFICATION,
  DELETE_NOTIFICATION,
  DISPLAY_NOTIFICATION_WARNING,
  REMOVE_GLOBAL_NOTIFICATION,
  RESTORE_ALL_NOTIFICATIONS,
} from './notification-actions';
import {
  titleOperationCompletedMap,
  titleOperationFailedMap,
  titleOperationInProgressMap,
} from './notification-title-maps';
import { ErrorMessages } from '../../error/constants';

const initialState = { notifications: [], globalNotification: { type: '' } };

export const notificationReducer = (state = initialState, action = {}) => {
  const { payload } = action;
  switch (action.type) {
    case OperationTypes.IMPORT_OPERATION:
    case OperationTypes.REFRESH_OPERATION:
    case OperationTypes.REMOVE_OPERATION:
    case OperationTypes.DUPLICATE_OPERATION:
    case OperationTypes.CLEAR_DATA_OPERATION:
    case OperationTypes.EDIT_OPERATION:
      return createProgressNotification(state, payload);

    case OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS:
      return moveNotificationToInProgress(state, payload);

    case OperationSteps.DISPLAY_NOTIFICATION_COMPLETED:
      return displayNotificationCompleted(state, payload);

    case DISPLAY_NOTIFICATION_WARNING:
      return displayNotificationWarning(state, payload);

    case DELETE_NOTIFICATION:
      return deleteNotification(state, payload);

    case MARK_STEP_COMPLETED:
      return markFetchingComplete(state, payload);

    case CREATE_GLOBAL_NOTIFICATION:
      return createGlobalNotification(state, payload);

    case REMOVE_GLOBAL_NOTIFICATION:
      return removeGlobalNotification(state);

    case officeProperties.actions.toggleSecuredFlag:
      return deleteAllNotifications(action, state);

    case CLEAR_NOTIFICATIONS:
      return clearNotifications(state);

    case RESTORE_ALL_NOTIFICATIONS:
      return restoreAllNotifications(state, payload);

    default:
      return state;
  }
};

const createProgressNotification = (state, payload) => {
  const { objectWorkingId, operationType } = payload.operation;
  let notificationButtons;
  if (operationType !== OperationTypes.CLEAR_DATA_OPERATION) {
    notificationButtons = getNotificationButtons(getCancelButton(objectWorkingId, operationType));
  }
  const newNotification = {
    objectWorkingId,
    title: i18n.t(titleOperationInProgressMap.PENDING_OPERATION),
    type: ObjectNotificationTypes.PROGRESS,
    operationType,
    children: notificationButtons,
  };
  return { ...state, notifications: [...state.notifications, newNotification] };
};

const moveNotificationToInProgress = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(
    state,
    payload
  );
  const updatedNotification = {
    ...notificationToUpdate,
    title: i18n.t(titleOperationInProgressMap[notificationToUpdate.operationType]),
    isIndeterminate: getIsIndeterminate(notificationToUpdate),
  };
  delete updatedNotification.children;
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const displayNotificationCompleted = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(
    state,
    payload
  );
  const updatedNotification = {
    ...notificationToUpdate,
    type: ObjectNotificationTypes.SUCCESS,
    title: i18n.t(titleOperationCompletedMap[notificationToUpdate.operationType]),
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

const deleteNotification = (state, payload) => {
  const newState = {
    notifications: [...state.notifications],
    globalNotification: state.globalNotification,
  };
  newState.notifications = newState.notifications.filter(
    notification => notification.objectWorkingId !== payload.objectWorkingId
  );
  return newState;
};

const displayNotificationWarning = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationOrCreateEmpty(
    state,
    payload
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

const markFetchingComplete = (state, payload) => {
  if (payload.completedStep === OperationSteps.FETCH_INSERT_DATA) {
    const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(
      state,
      payload
    );
    const updatedNotification = {
      ...notificationToUpdate,
      isFetchingComplete: true,
    };
    return createNewState(state, notificationToUpdateIndex, updatedNotification);
  }
  return state;
};

const createGlobalNotification = (state, payload) => {
  payload.title = i18n.t(payload.title);

  if (payload.details) {
    payload.details = i18n.t(payload.details);
  }

  return { ...state, globalNotification: payload };
};

const removeGlobalNotification = state => ({
  notifications: [...state.notifications],
  globalNotification: { type: '' },
});

const deleteAllNotifications = (action, state) =>
  action.isSecured ? { notifications: [], globalNotification: state.globalNotification } : state;

const clearNotifications = state => ({
  ...state,
  notifications: initialState.notifications,
  globalNotification: initialState.globalNotification,
});

const restoreAllNotifications = (state, payload) => ({
  ...state,
  notifications: payload,
});

const getOkButton = payload => [
  {
    type: 'basic',
    label: i18n.t('OK'),
    onClick: payload.notification.callback,
  },
];

const getCancelButton = (objectWorkingId, operationType) => [
  {
    type: 'basic',
    label: i18n.t('Cancel'),
    onClick: () => {
      if (operationType === OperationTypes.IMPORT_OPERATION) {
        notificationService.removeObjectFromNotification(objectWorkingId);
      }
      notificationService.cancelOperationFromNotification(objectWorkingId);
      notificationService.dismissNotification(objectWorkingId);
    },
  },
];

function getTitle(payload, notificationToUpdate) {
  return payload.notification.title === ErrorMessages.GENERIC_SERVER_ERR
    ? titleOperationFailedMap[notificationToUpdate.operationType]
    : payload.notification.title;
}

function createNewState(state, notificationToUpdateIndex, updatedNotification) {
  const newState = {
    notifications: [...state.notifications],
    globalNotification: state.globalNotification,
  };
  newState.notifications.splice(notificationToUpdateIndex, 1, updatedNotification);
  return newState;
}

function getNotificationOrCreateEmpty(state, payload) {
  try {
    return getNotificationToUpdate(state, payload);
  } catch (error) {
    return {
      notificationToUpdate: {},
      notificationToUpdateIndex: state.notifications.length,
    };
  }
}

function getNotificationToUpdate(state, payload) {
  const { notifications } = state;
  const notificationToUpdateIndex = getNotificationIndex(state, payload);
  const notificationToUpdate = notifications[notificationToUpdateIndex];
  return { notificationToUpdate, notificationToUpdateIndex };
}

function getIsIndeterminate(notificationToUpdate) {
  return !!(
    notificationToUpdate.operationType === OperationTypes.REMOVE_OPERATION ||
    notificationToUpdate.operationType === OperationTypes.CLEAR_DATA_OPERATION
  );
}

function getNotificationIndex(state, payload) {
  const notificationToUpdateIndex = state.notifications.findIndex(
    notification => notification.objectWorkingId === payload.objectWorkingId
  );
  if (notificationToUpdateIndex === -1) {
    throw new Error();
  }
  return notificationToUpdateIndex;
}
