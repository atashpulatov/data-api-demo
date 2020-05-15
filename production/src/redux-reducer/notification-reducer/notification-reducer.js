import { objectNotificationTypes } from '@mstr/rc';
import { MOVE_NOTIFICATION_TO_IN_PROGRESS, DISPLAY_NOTIFICATION_COMPLETED, FETCH_INSERT_DATA } from '../../operation/operation-steps';
import { notificationService } from '../../notification-v2/notification-service';
import { officeProperties } from '../office-reducer/office-properties';
import { getNotificationButtons } from '../../notification-v2/notification-buttons';
import {
  IMPORT_OPERATION,
  EDIT_OPERATION,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
  MARK_STEP_COMPLETED,
} from '../../operation/operation-type-names';
import {
  DELETE_NOTIFICATION,
  CREATE_GLOBAL_NOTIFICATION,
  REMOVE_GLOBAL_NOTIFICATION,
  DISPLAY_NOTIFICATION_WARNING,
  CLEAR_NOTIFICATIONS
} from './notification-actions';
import {
  titleOperationCompletedMap, titleOperationFailedMap, titleOperationInProgressMap, customT
} from './notification-title-maps';
import { GENERIC_SERVER_ERR } from '../../error/constants';

const initialState = { notifications: [], globalNotification: { type: '' } };

export const notificationReducer = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case IMPORT_OPERATION:
    case REFRESH_OPERATION:
    case REMOVE_OPERATION:
    case DUPLICATE_OPERATION:
    case CLEAR_DATA_OPERATION:
    case EDIT_OPERATION:
      return createProgressNotification(state, payload);

    case MOVE_NOTIFICATION_TO_IN_PROGRESS:
      return moveNotificationToInProgress(state, payload);

    case DISPLAY_NOTIFICATION_COMPLETED:
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
      return removeGlobalNotification(state, payload);

    case officeProperties.actions.toggleSecuredFlag:
      return deleteAllNotifications(action, state);

    case CLEAR_NOTIFICATIONS:
      return clearNotifications(state);

    default:
      return state;
  }
};

const createProgressNotification = (state, payload) => {
  const { objectWorkingId, operationType } = payload.operation;
  let notificationButtons;
  if (operationType !== CLEAR_DATA_OPERATION) {
    notificationButtons = getNotificationButtons(getCancelButton(objectWorkingId, operationType));
  }
  const newNotification = {
    objectWorkingId,
    title: customT(titleOperationInProgressMap.PENDING_OPERATION),
    type: objectNotificationTypes.PROGRESS,
    operationType,
    children: notificationButtons,
  };
  return { ...state, notifications: [...state.notifications, newNotification] };
};

const moveNotificationToInProgress = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);
  const updatedNotification = {
    ...notificationToUpdate,
    title: customT(titleOperationInProgressMap[notificationToUpdate.operationType]),
    isIndeterminate: getIsIndeterminate(notificationToUpdate),
  };
  delete updatedNotification.children;
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const displayNotificationCompleted = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);
  const updatedNotification = {
    ...notificationToUpdate,
    type: objectNotificationTypes.SUCCESS,
    title: customT(titleOperationCompletedMap[notificationToUpdate.operationType]),
    dismissNotification: (notificationToUpdate.operationType === REMOVE_OPERATION
      ? () => notificationService.dismissSuccessfulRemoveNotification(notificationToUpdate.objectWorkingId)
      : () => notificationService.dismissNotification(notificationToUpdate.objectWorkingId)),
  };
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const deleteNotification = (state, payload) => {
  const newState = { notifications: [...state.notifications], globalNotification: state.globalNotification };
  newState.notifications = newState.notifications
    .filter((notification) => notification.objectWorkingId !== payload.objectWorkingId);
  return newState;
};

const displayNotificationWarning = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationOrCreateEmpty(state, payload);

  const buttons = getOkButton(payload);
  const title = getTitle(payload, notificationToUpdate);

  const updatedNotification = {
    objectWorkingId: payload.objectWorkingId,
    type: objectNotificationTypes.WARNING,
    title: customT(title),
    details: customT(payload.notification.message),
    children: getNotificationButtons(buttons),
    callback: payload.notification.callback,
  };

  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const markFetchingComplete = (state, payload) => {
  if (payload.completedStep === FETCH_INSERT_DATA) {
    const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);
    const updatedNotification = {
      ...notificationToUpdate,
      isFetchingComplete: true,
    };
    return createNewState(state, notificationToUpdateIndex, updatedNotification);
  }
  return state;
};

const createGlobalNotification = (state, payload) => (
  { ...state, globalNotification: payload }
);

const removeGlobalNotification = (state, paylaod) => (
  { notifications: [...state.notifications], globalNotification: { type: '' } }
);

const deleteAllNotifications = (action, state) => (action.isSecured
  ? { notifications: [], globalNotification: state.globalNotification }
  : state);

const clearNotifications = (state) => ({
  ...state,
  notifications: initialState.notifications,
  globalNotification: initialState.globalNotification,
});

const getOkButton = (payload) => [{
  type: 'basic',
  label: customT('OK'),
  onClick: payload.notification.callback,
}];

const getCancelButton = (objectWorkingId, operationType) => [{
  type: 'basic',
  label: customT('Cancel'),
  onClick: () => {
    if (operationType === IMPORT_OPERATION) {
      notificationService.removeObjectFromNotification(objectWorkingId);
    }
    notificationService.cancelOperationFromNotification(objectWorkingId);
    notificationService.dismissNotification(objectWorkingId);
  },
}];

function getTitle(payload, notificationToUpdate) {
  return payload.notification.title === GENERIC_SERVER_ERR
    ? titleOperationFailedMap[notificationToUpdate.operationType]
    : payload.notification.title;
}

function createNewState(state, notificationToUpdateIndex, updatedNotification) {
  const newState = { notifications: [...state.notifications], globalNotification: state.globalNotification };
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
  return !!(notificationToUpdate.operationType === REMOVE_OPERATION
    || notificationToUpdate.operationType === CLEAR_DATA_OPERATION);
}

function getNotificationIndex(state, payload) {
  const notificationToUpdateIndex = state.notifications
    .findIndex((notification) => notification.objectWorkingId === payload.objectWorkingId);
  if (notificationToUpdateIndex === -1) {
    throw new Error();
  }
  return notificationToUpdateIndex;
}
