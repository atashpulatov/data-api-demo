import { IMPORT_REQUESTED, MARK_STEP_COMPLETED } from './operation-actions';

const initialState = {};

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

}

function markStepCompleted(state, { objectWorkingId, completedStep }) {
  const processedOperation = state.operations.find((operation) => operation.objectWorkingId === objectWorkingId);
  const { stepsQueue } = processedOperation;
  if (processedOperation.stepsQueue[0] !== completedStep) {
    // FIXME: Add class/message for this error
    throw new Error();
  }
  if (stepsQueue.lenght === 1) {
    state.operations.splice(
      state.operations.findIndex(
        (operation) => operation.objectWorkingId === objectWorkingId
      ), 1
    );
  } else {
    stepsQueue.shift();
  }
  return { ...state };
}
