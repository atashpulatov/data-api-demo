import { objectNotificationTypes } from '@mstr/rc';
import {
  IMPORT_OPERATION,
  EDIT_OPERATION,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
} from '../../operation/operation-type-names';
import { MOVE_NOTIFICATION_TO_IN_PROGRESS, DISPLAY_NOTIFICATION_COMPLETED } from '../../operation/operation-steps';
import { notificationService } from '../../notification-v2/notification-service';
import {
  CREATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  CREATE_GLOBAL_NOTIFICATION,
  REMOVE_GLOBAL_NOTIFICATION,
  CREATE_OBJECT_WARNING,
} from './notification-actions';
import { getNotificationButtons } from '../../notification-v2/notification-buttons';

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

    case CREATE_NOTIFICATION:
      return createNotification(state, payload);

    case CREATE_OBJECT_WARNING:
      return createObjectWarning(state, payload);

    case DELETE_NOTIFICATION:
      return deleteNotification(state, payload);

    case CREATE_GLOBAL_NOTIFICATION:
      return createGlobalNotification(state, payload);

    case REMOVE_GLOBAL_NOTIFICATION:
      return removeGlobalNotification(state, payload);

    default:
      return state;
  }
};

const createProgressNotification = (state, payload) => {
  const newNotification = {
    objectWorkingId: payload.operation.objectWorkingId,
    type: objectNotificationTypes.PROGRESS,
    title: 'Pending',
    operationType: payload.operation.operationType,
  };
  return { ...state, notifications: [...state.notifications, newNotification] };
};

const moveNotificationToInProgress = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);
  const updatedNotification = {
    ...notificationToUpdate,
    title: titleOperationMap[notificationToUpdate.operationType],
    isIndeterminate: getIsIndeterminate(notificationToUpdate),
  };
  console.log(updatedNotification);
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const displayNotificationCompleted = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);
  const updatedNotification = {
    ...notificationToUpdate,
    type: objectNotificationTypes.SUCCESS,
    title: titleOperationCompletedMap[notificationToUpdate.operationType],
    onHover: (notificationToUpdate.operationType === REMOVE_OPERATION
      ? () => notificationService.onRemoveSuccessfulNotificationHover(notificationToUpdate.objectWorkingId)
      : () => notificationService.onSuccessfullNotificationHover(notificationToUpdate.objectWorkingId)),
  };
  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const createNotification = (state, payload) => ({ notifications: [...state.notifications, payload] });

const deleteNotification = (state, payload) => {
  const notificationToDelete = getNotificationIndex(state, payload);
  const newState = { notifications: [...state.notifications], globalNotification: state.globalNotification };
  newState.notifications.splice(notificationToDelete, 1);
  return newState;
};

const createObjectWarning = (state, payload) => {
  const { notificationToUpdate, notificationToUpdateIndex } = getNotificationToUpdate(state, payload);

  const buttons = getOkButton(payload);

  const updatedNotification = {
    objectWorkingId: payload.objectWorkingId,
    type: objectNotificationTypes.WARNING,
    title: titleOperationFailedMap[notificationToUpdate.operationType],
    details: payload.notification.message,
    onHover: payload.notification.callback,
    children: getNotificationButtons(buttons),
  };

  return createNewState(state, notificationToUpdateIndex, updatedNotification);
};

const createGlobalNotification = (state, payload) => (
  { ...state, globalNotification: payload }
);

const removeGlobalNotification = (state, paylaod) => (
  { notifications: [...state.notifications], globalNotification: { type: '' } }
);

const getOkButton = (payload) => [
  {
    title: 'Ok',
    type: 'basic',
    label: 'Ok',
    onClick: payload.notification.callback,
  },
];

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
    console.log({ state, payload });
    throw new Error();
  }
  return notificationToUpdateIndex;
}

const titleOperationMap = {
  IMPORT_OPERATION: 'Importing',
  REFRESH_OPERATION: 'Refreshing',
  EDIT_OPERATION: 'Importing',
  REMOVE_OPERATION: 'Removing',
  DUPLICATE_OPERATION: 'Duplicating',
  CLEAR_DATA_OPERATION: 'Clearing',
};

const titleOperationCompletedMap = {
  IMPORT_OPERATION: 'Import successful',
  REFRESH_OPERATION: 'Refresh complete',
  EDIT_OPERATION: 'Import successful',
  REMOVE_OPERATION: 'Object removed',
  DUPLICATE_OPERATION: 'Duplicate created',
  CLEAR_DATA_OPERATION: 'Object cleared',
};

const titleOperationFailedMap = {
  IMPORT_OPERATION: 'Import failed',
  REFRESH_OPERATION: 'Refresh failed',
  EDIT_OPERATION: 'Import failed',
  REMOVE_OPERATION: 'Remove object failed',
  DUPLICATE_OPERATION: 'Duplicating object failed',
  CLEAR_DATA_OPERATION: 'Clear object failed',
};
