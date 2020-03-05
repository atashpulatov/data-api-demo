
export const IMPORT_REQUESTED = 'IMPORT_REQUESTED';
export const EDIT_REQUESTED = 'EDIT_REQUESTED';

export const MARK_STEP_COMPLETED = 'MARK_STEP_COMPLETED';
export const SET_TOTAL_ROWS = 'SET_TOTAL_ROWS';
export const SET_LOADED_ROWS = 'SET_LOADED_ROWS';

export const importRequested = (object) => ({
  type: IMPORT_REQUESTED,
  payload: {
    operation: createOperation(IMPORT_REQUESTED),
    object,
  },
});

export const markStepCompleted = (objectWorkingId, completedStep) => ({
  type: MARK_STEP_COMPLETED,
  payload: {
    objectWorkingId,
    completedStep,
  }
});

function createOperation(type) {
  return {
    operationType: operationTypes[type],
    objectWorkingId: Date.now(),
  };
}

const operationTypes = { IMPORT_REQUESTED: 'CREATE', };
