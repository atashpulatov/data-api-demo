import { IMPORT_REQUESTED, MARK_STEP_COMPLETED } from './operation-actions';

const initialState = { operations: [] };

export const operationReducer = (state = initialState, action) => {
  switch (action.type) {
  case IMPORT_REQUESTED:
    return importRequested(state, action.payload);
  case MARK_STEP_COMPLETED:
    return markStepCompleted(state, action.payload);
  default:
    return state;
  }
};

function importRequested(state, payload) {
  return {
    operations: [
      ...state.operations,
      payload.operation,
    ]
  };
}

function markStepCompleted(state, { objectWorkingId, completedStep }) {
  const processedOperation = state.operations.find((operation) => operation.objectWorkingId === objectWorkingId);
  const { stepsQueue } = processedOperation;

  if (processedOperation.stepsQueue[0] !== completedStep) {
    // FIXME: Add class/message for this error
    throw new Error();
  }
  if (stepsQueue.length === 1) {
    removeOperation(state, objectWorkingId);
  } else {
    stepsQueue.shift();
  }
  return { ...state };
}

function removeOperation(state, objectWorkingId) {
  // TODO: throw some meaningful error
  state.operations.splice(state.operations.findIndex((operation) => operation.objectWorkingId === objectWorkingId), 1);
}
