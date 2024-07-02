/* eslint-disable @typescript-eslint/no-use-before-define */

import {
  MarkStepCompletedPayload,
  OperationActions,
  OperationActionTypes,
  OperationData,
  OperationPayload,
  OperationState,
} from './operation-reducer-types';

const initialState: OperationState = { operations: [] };

export const operationReducer = (
  // eslint-disable-next-line default-param-last
  state = initialState,
  action: OperationActions
): OperationState => {
  switch (action.type) {
    case OperationActionTypes.IMPORT_OPERATION:
    case OperationActionTypes.REFRESH_OPERATION:
    case OperationActionTypes.EDIT_OPERATION:
    case OperationActionTypes.DUPLICATE_OPERATION:
    case OperationActionTypes.REMOVE_OPERATION:
    case OperationActionTypes.HIGHLIGHT_OPERATION:
    case OperationActionTypes.CLEAR_DATA_OPERATION:
      return operationRequested(state, action.payload);

    case OperationActionTypes.MARK_STEP_COMPLETED:
      return markStepCompleted(state, action.payload);

    case OperationActionTypes.UPDATE_OPERATION:
      return updateOperation(state, action.payload);

    case OperationActionTypes.CANCEL_OPERATION:
      return cancelOperation(state, action.payload);

    case OperationActionTypes.CANCEL_OPERATION_BY_OPERATION_ID:
      return cancelOperationByOperationId(state, action.payload);

    default:
      return state;
  }
};

function operationRequested(state: OperationState, payload: OperationPayload): OperationState {
  return {
    operations: [...state.operations, payload.operation],
  };
}

function markStepCompleted(
  state: OperationState,
  { objectWorkingId, completedStep }: MarkStepCompletedPayload
): OperationState {
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

function updateOperation(
  state: OperationState,
  updatedOperationProps: Partial<OperationData>
): OperationState {
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

function cancelOperation(
  state: OperationState,
  { objectWorkingId }: { objectWorkingId: number }
): OperationState {
  const processedOperationIndex = getProcessedOperationIndex(state.operations, objectWorkingId);
  state.operations.splice(processedOperationIndex, 1);
  return { ...state };
}

function cancelOperationByOperationId(
  state: OperationState,
  { operationId }: { operationId: string }
): OperationState {
  const processedOperationIndex = state.operations.findIndex(
    operation => operation.operationId === operationId
  );
  if (processedOperationIndex !== -1) {
    state.operations.splice(processedOperationIndex, 1);
  }
  return { ...state };
}

function getProcessedOperationIndex(operations: OperationData[], objectWorkingId: number): number {
  const processedOperationIndex = operations.findIndex(
    operation => operation.objectWorkingId === objectWorkingId
  );
  if (processedOperationIndex === -1) {
    throw new Error();
  }
  return processedOperationIndex;
}
