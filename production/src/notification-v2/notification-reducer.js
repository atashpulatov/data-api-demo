export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';

const initialState = { notifications: [], };

export const notificationReducer = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case CREATE_NOTIFICATION:
      return createNotification(state, payload);
    case UPDATE_NOTIFICATION:
      return updateNotification(state, payload);
    case DELETE_NOTIFICATION:
      return deleteNotification(state, payload);
    default:
      return state;
  }
};

const createNotification = (state, payload) => ({ notifications: [...state.notifications, payload] });

const updateNotification = (state, payload) => {
  const notificationToUpdateIndex = getNotificationIndex(state, payload);
  const updatedNotification = { ...state.notifications[notificationToUpdateIndex], ...payload };
  const newState = { notifications: [...state.notifications] };
  newState.notifications.splice(notificationToUpdateIndex, 1, updatedNotification);
  return newState;
};

const deleteNotification = (state, payload) => {
  const notificationToDelete = getNotificationIndex(state, payload);
  const newState = { notifications: [...state.notifications] };
  newState.notifications.splice(notificationToDelete, 1);
  return newState;
};

function getNotificationIndex(state, payload) {
  const notificationToUpdateIndex = state.notifications
    .findIndex((notification) => notification.objectWorkingId === payload.objectWorkingId);
  if (notificationToUpdateIndex === -1) {
    throw new Error();
  }
  return notificationToUpdateIndex;
}
