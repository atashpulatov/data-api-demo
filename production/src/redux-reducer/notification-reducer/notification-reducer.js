import { objectNotificationTypes } from '@mstr/rc';
import { MOVE_NOTIFICATION_TO_IN_PROGRESS, DISPLAY_NOTIFICATION_COMPLETED } from '../../operation/operation-steps';
import { notificationService } from '../../notification-v2/notification-service';
import { officeProperties } from '../office-reducer/office-properties';
import { getNotificationButtons } from '../../notification-v2/notification-buttons';
import {
  IMPORT_OPERATION,
  EDIT_OPERATION,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION
} from '../../operation/operation-type-names';
import {
  DELETE_NOTIFICATION,
  CREATE_GLOBAL_NOTIFICATION,
  REMOVE_GLOBAL_NOTIFICATION,
  DISPLAY_NOTIFICATION_WARNING
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

    case CREATE_GLOBAL_NOTIFICATION:
      return createGlobalNotification(state, payload);

    case REMOVE_GLOBAL_NOTIFICATION:
      return removeGlobalNotification(state, payload);

    case officeProperties.actions.toggleSecuredFlag:
      return deleteAllNotifications(action, state);

    default:
      return state;
  }
};

const createProgressNotification = (state, payload) => {
  const newNotification = {
    objectWorkingId: payload.operation.objectWorkingId,
    type: objectNotificationTypes.PROGRESS,
    title: titleOperationInProgressMap.PENDING_OPERATION,
    operationType: payload.operation.operationType,
  };
  return { ...state, notifications: [...state.notifications, newNotification] };
};

const moveNotificationToInProgress = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);
  const updatedNotification = {
    ...notificationToUpdate,
    title: titleOperationInProgressMap[notificationToUpdate.operationType],
    isIndeterminate: getIsIndeterminate(notificationToUpdate),
  };
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const displayNotificationCompleted = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);
  console.log('displayNotificationCompleted');
  const updatedNotification = {
    ...notificationToUpdate,
    type: objectNotificationTypes.SUCCESS,
    title: titleOperationCompletedMap[notificationToUpdate.operationType],
    onHover: (notificationToUpdate.operationType === REMOVE_OPERATION
      ? () => notificationService.dismissSuccessfulRemoveNotification(notificationToUpdate.objectWorkingId)
      : () => notificationService.dismissSuccessfullNotification(notificationToUpdate.objectWorkingId)),
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
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);

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

const createGlobalNotification = (state, payload) => (
  { ...state, globalNotification: payload }
);

const removeGlobalNotification = (state, paylaod) => (
  { notifications: [...state.notifications], globalNotification: { type: '' } }
);

const deleteAllNotifications = (action, state) => (action.isSecured
  ? { notifications: [], globalNotification: state.globalNotification }
  : state);

const getOkButton = (payload) => [{
  title: 'Ok',
  type: 'basic',
  label: 'Ok',
  onClick: payload.notification.callback,
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
    return;
  }
  return notificationToUpdateIndex;
}
