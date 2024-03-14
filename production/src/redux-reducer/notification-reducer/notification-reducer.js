/* eslint-disable @typescript-eslint/no-use-before-define */
import { ObjectNotificationTypes } from '@mstr/connector-components';

import { notificationService } from '../../notification/notification-service';

import i18n from '../../i18n';
import { getNotificationButtons } from '../../notification/notification-buttons';
import {
  DISPLAY_NOTIFICATION_COMPLETED,
  FETCH_INSERT_DATA,
  MOVE_NOTIFICATION_TO_IN_PROGRESS,
} from '../../operation/operation-steps';
import {
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
  EDIT_OPERATION,
  IMPORT_OPERATION,
  MARK_STEP_COMPLETED,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
} from '../../operation/operation-type-names';
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
import { errorMessages } from '../../error/constants';

const initialState = { notifications: [], globalNotification: { type: '' } };

export const notificationReducer = (state = initialState, action = {}) => {
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
  if (operationType !== CLEAR_DATA_OPERATION) {
    notificationButtons = getNotificationButtons(getCancelButton(objectWorkingId, operationType));
  }
  
  // DE288915: Avoid duplicate notifications, particularly those originating from Edit and Reprompt operations. 
  const stateNotifications = state?.notifications && Array.isArray(state.notifications) ?
    state.notifications.filter(item => item.objectWorkingId !== objectWorkingId) : [];

  const newNotification = {
    objectWorkingId,
    title: i18n.t(titleOperationInProgressMap.PENDING_OPERATION),
    type: ObjectNotificationTypes.PROGRESS,
    operationType,
    children: notificationButtons,
  };

  // DE288915: Changed order of how notifications are displayed by reversing the order of the array
  // to display the most recent notification on top of the list and ignored lingering notifications
  // associated to given objectWorkingId.
  return { ...state, notifications: [newNotification, ...stateNotifications] };
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
      notificationToUpdate.operationType === REMOVE_OPERATION
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
  if (payload.completedStep === FETCH_INSERT_DATA) {
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
      if (operationType === IMPORT_OPERATION) {
        notificationService.removeObjectFromNotification(objectWorkingId);
      }
      notificationService.cancelOperationFromNotification(objectWorkingId);
      notificationService.dismissNotification(objectWorkingId);
    },
  },
];

function getTitle(payload, notificationToUpdate) {
  return payload.notification.title === errorMessages.GENERIC_SERVER_ERR
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
    notificationToUpdate.operationType === REMOVE_OPERATION ||
    notificationToUpdate.operationType === CLEAR_DATA_OPERATION
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
