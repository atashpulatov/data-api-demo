import {
  IMPORT_REQUESTED, EDIT_REQUESTED, MARK_STEP_COMPLETED, CANCEL_OPERATION, BACKUP_OBJECT
} from './operation-actions';

const initialState = { operations: [] };

export const operationReducer = (state = initialState, action) => {
  switch (action.type) {
  case IMPORT_REQUESTED:
    return importRequested(state, action.payload);
  case EDIT_REQUESTED:
    return editRequested(state, action.payload);
  case MARK_STEP_COMPLETED:
    return markStepCompleted(state, action.payload);
  case CANCEL_OPERATION:
    return cancelOperation(state, action.payload);
  case BACKUP_OBJECT:
    return backupObject(state, action.payload);
  default:
    return state;
  }
};

function backupObject(state, { objectWorkingId, objectToBackup }) {
  const processedOperationIndex = getProcessedOperationIndex(state.operations, objectWorkingId);
  const processedOperation = state.operations[processedOperationIndex];
  processedOperation.objectBackup = objectToBackup;
  return { ...state };
}

function cancelOperation(state, { objectWorkingId }) {
  const processedOperationIndex = getProcessedOperationIndex(state.operations, objectWorkingId);
  state.operations.splice(processedOperationIndex, 1);
  return { ...state };
}

function importRequested(state, payload) {
  return {
    operations: [
      ...state.operations,
      payload.operation,
    ]
  };
}
function editRequested(state, payload) {
  return {
    operations: [
      ...state.operations,
      payload.operation
    ]
  };
}

function markStepCompleted(state, { objectWorkingId, completedStep }) {
  const processedOperationIndex = getProcessedOperationIndex(state.operations, objectWorkingId);
  const processedOperation = state.operations[processedOperationIndex];
  const { stepsQueue } = processedOperation;
  console.log('stepsQueue:', stepsQueue);
  console.log('completedStep:', completedStep);

  if (processedOperation.stepsQueue[0] !== completedStep) {
    throw new Error();
  }
  if (stepsQueue.length === 1) {
    state.operations.splice(processedOperationIndex, 1);
  } else {
    stepsQueue.shift();
  }
  return { ...state };
}

function getProcessedOperationIndex(operations, objectWorkingId) {
  const processedOperationIndex = operations
    .findIndex((operation) => operation.objectWorkingId === objectWorkingId);
  if (processedOperationIndex === -1) { throw new Error(); }
  return processedOperationIndex;
}
