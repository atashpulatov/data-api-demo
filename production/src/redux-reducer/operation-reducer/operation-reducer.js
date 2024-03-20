/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  CANCEL_OPERATION,
  MARK_STEP_COMPLETED,
  OperationTypes,
  UPDATE_OPERATION,
} from '../../operation/operation-type-names';

const initialState = { operations: [] };

export const operationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case OperationTypes.IMPORT_OPERATION:
    case OperationTypes.REFRESH_OPERATION:
    case OperationTypes.EDIT_OPERATION:
    case OperationTypes.DUPLICATE_OPERATION:
    case OperationTypes.REMOVE_OPERATION:
    case OperationTypes.HIGHLIGHT_OPERATION:
    case OperationTypes.CLEAR_DATA_OPERATION:
      return operationRequested(state, action.payload);

    case MARK_STEP_COMPLETED:
      return markStepCompleted(state, action.payload);

    case UPDATE_OPERATION:
      return updateOperation(state, action.payload);

    case CANCEL_OPERATION:
      return cancelOperation(state, action.payload);

    default:
      return state;
  }
};

function operationRequested(state, payload) {
  return {
    operations: [...state.operations, payload.operation],
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
  return { ...state, operations: [...state.operations] };
}

function updateOperation(state, updatedOperationProps) {
  const processedOperationIndex = getProcessedOperationIndex(
    state.operations,
    updatedOperationProps.objectWorkingId
  );
  const newOperations = [...state.operations];
  const updatedOperation = {
    ...state.operations[processedOperationIndex],
    ...updatedOperationProps,
  };
  newOperations.splice(processedOperationIndex, 1, updatedOperation);
  return { operations: newOperations };
}

function cancelOperation(state, { objectWorkingId }) {
  const processedOperationIndex = getProcessedOperationIndex(state.operations, objectWorkingId);
  state.operations.splice(processedOperationIndex, 1);
  return { ...state };
}

function getProcessedOperationIndex(operations, objectWorkingId) {
  const processedOperationIndex = operations.findIndex(
    operation => operation.objectWorkingId === objectWorkingId
  );
  if (processedOperationIndex === -1) {
    throw new Error();
  }
  return processedOperationIndex;
}
