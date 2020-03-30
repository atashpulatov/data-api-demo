import {
  IMPORT_REQUESTED,
  EDIT_REQUESTED,
  REFRESH_REQUESTED,
  REMOVE_REQUESTED,
  MARK_STEP_COMPLETED,
  CANCEL_OPERATION,
  BACKUP_OBJECT,
  UPDATE_OPERATION,
} from './operation-actions';

const initialState = { operations: [] };

export const operationReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_REQUESTED:
    case REFRESH_REQUESTED:
    case EDIT_REQUESTED:
    case REMOVE_REQUESTED:
      return operationRequested(state, action.payload);

    case MARK_STEP_COMPLETED:
      return markStepCompleted(state, action.payload);

    case UPDATE_OPERATION:
      return updateOperation(state, action.payload);

    case BACKUP_OBJECT:
      return backupObject(state, action.payload);

    case CANCEL_OPERATION:
      return cancelOperation(state, action.payload);


    default:
      return state;
  }
};

function operationRequested(state, payload) {
  return {
    operations: [
      ...state.operations,
      payload.operation,
    ]
  };
}


function markStepCompleted(state, { objectWorkingId, completedStep }) {
  const processedOperationIndex = getProcessedOperationIndex(state.operations, objectWorkingId);
  const processedOperation = state.operations[processedOperationIndex];
  const { stepsQueue } = processedOperation;

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

function updateOperation(state, updatedOperationProps) {
  const processedOperationIndex = getProcessedOperationIndex(state.operations, updatedOperationProps.objectWorkingId);
  const newOperations = [...state.operations];
  const updatedOperation = { ...state.operations[processedOperationIndex], ...updatedOperationProps };
  newOperations.splice(processedOperationIndex, 1, updatedOperation);
  return { operations: newOperations };
}

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


function getProcessedOperationIndex(operations, objectWorkingId) {
  const processedOperationIndex = operations
    .findIndex((operation) => operation.objectWorkingId === objectWorkingId);
  if (processedOperationIndex === -1) { throw new Error(); }
  return processedOperationIndex;
}
