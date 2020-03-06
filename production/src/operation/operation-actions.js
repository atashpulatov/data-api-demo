
export const IMPORT_REQUESTED = 'IMPORT_REQUESTED';
export const EDIT_REQUESTED = 'EDIT_REQUESTED';

export const MARK_STEP_COMPLETED = 'MARK_STEP_COMPLETED';
export const SET_TOTAL_ROWS = 'SET_TOTAL_ROWS';
export const SET_LOADED_ROWS = 'SET_LOADED_ROWS';

export const importRequested = (object) => {
  const objectWorkingId = Date.now();
  object.objectWorkingId = objectWorkingId;
  return {
    type: IMPORT_REQUESTED,
    payload: {
      operation: createOperation(IMPORT_REQUESTED, objectWorkingId),
      object,
    },
  };
};

export const markStepCompleted = (objectWorkingId, completedStep) => ({
  type: MARK_STEP_COMPLETED,
  payload: {
    objectWorkingId,
    completedStep,
  }
});

function createOperation(type, objectWorkingId) {
  return {
    operationType: operationTypes[type],
    objectWorkingId,
  };
}

const operationTypes = { IMPORT_REQUESTED: 'CREATE', };
