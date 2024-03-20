import { createSelector } from 'reselect';

const getOperationsState = (state: any): any => state.operationReducer;

export const selectOperations = createSelector(
  [getOperationsState],
  operationState => operationState.operations
);
