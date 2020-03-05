
export const IMPORT_REQUESTED = 'IMPORT_REQUESTED';
export const EDIT_REQUESTED = 'EDIT_REQUESTED';

export const MARK_ACTION_COMPLETED = 'MARK_ACTION_COMPLETED';
export const SET_TOTAL_ROWS = 'SET_TOTAL_ROWS';
export const SET_LOADED_ROWS = 'SET_LOADED_ROWS';

export const importRequested = (payload) => ({
  type: IMPORT_REQUESTED,
  payload,
});

export const markActionCompleted = (objectWorkingId, completedAction) => ({
  type: MARK_ACTION_COMPLETED,
  payload: {
    objectWorkingId,
    completedAction
  }
});
