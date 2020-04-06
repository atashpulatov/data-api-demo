import { objectNotificationTypes } from '@mstr/rc';
import {
  MARK_STEP_COMPLETED, IMPORT_OPERATION, EDIT_OPERATION, REFRESH_OPERATION, REMOVE_OPERATION
} from '../../operation/operation-type-names';
import { operationStepsMap } from '../../operation/operation-steps';

export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const CREATE_GLOBAL_NOTIFICATION = 'CREATE_GLOBAL_NOTIFICATION';
export const REMOVE_GLOBAL_NOTIFICATION = 'REMOVE_GLOBAL_NOTIFICATION';

const initialState = { notifications: [], globalNotification: { type: '' } };

export const notificationReducer = (state = initialState, action) => {
  const { payload } = action;
  console.log(action);
  switch (action.type) {
    case IMPORT_OPERATION:
    case REFRESH_OPERATION:
    case REMOVE_OPERATION:
    case EDIT_OPERATION:
      return createProgressNotification(state, payload);
    case MARK_STEP_COMPLETED:
      return updateNotification(state, payload);
    case CREATE_NOTIFICATION:
      return createNotification(state, payload);
    case UPDATE_NOTIFICATION:
      return updateNotification(state, payload);
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
  console.log(newNotification);
  return { ...state, notifications: [...state.notifications, newNotification] };
};

const updateNotification = (state, payload) => {
  // console.log({ state, payload });
  const { notifications } = state;
  const notificationToUpdateIndex = getNotificationIndex(state, payload);
  const notificationToUpdate = notifications[notificationToUpdateIndex];
  const operationSteps = operationStepsMap[notificationToUpdate.operationType];
  const operationFirstStep = operationSteps[0];
  const operationLastStep = operationSteps[operationSteps.length - 1];
  console.log({ operationFirstStep, operationLastStep });
  if (payload.completedStep !== operationFirstStep && payload.completedStep !== operationLastStep) {
    console.log('here');
    return state;
  }
  let updatedNotification;
  if (payload.completedStep === operationFirstStep) {
    updatedNotification = { ...notificationToUpdate, title: 'Import' };
  }
  if (payload.completedStep === operationLastStep) {
    updatedNotification = {
      objectWorkingId: notificationToUpdate.objectWorkingId,
      type: objectNotificationTypes.SUCCESS,
      title: 'Import'
    };
  }
  const newState = { notifications: [...state.notifications], globalNotification: state.globalNotification };
  newState.notifications.splice(notificationToUpdateIndex, 1, updatedNotification);
  console.log(newState);
  return newState;
};

const createNotification = (state, payload) => ({ notifications: [...state.notifications, payload] });

// const updateNotification = (state, payload) => {
//   const notificationToUpdateIndex = getNotificationIndex(state, payload);
//   const updatedNotification = { ...state.notifications[notificationToUpdateIndex], ...payload };
//   const newState = { notifications: [...state.notifications], globalNotification: state.globalNotification };
//   newState.notifications.splice(notificationToUpdateIndex, 1, updatedNotification);
//   return newState;
// };

const deleteNotification = (state, payload) => {
  const notificationToDelete = getNotificationIndex(state, payload);
  const newState = { notifications: [...state.notifications], globalNotification: state.globalNotification };
  newState.notifications.splice(notificationToDelete, 1);
  return newState;
};

const createGlobalNotification = (state, payload) => (
  { ...state, globalNotification: payload }
);

const removeGlobalNotification = (state, paylaod) => ({ notifications: [...state.notifications], globalNotification: { type: '' } });

function getNotificationIndex(state, payload) {
  const notificationToUpdateIndex = state.notifications
    .findIndex((notification) => notification.objectWorkingId === payload.objectWorkingId);
  if (notificationToUpdateIndex === -1) {
    throw new Error();
  }
  return notificationToUpdateIndex;
}
