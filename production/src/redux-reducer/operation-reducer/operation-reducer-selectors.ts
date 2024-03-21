import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { OperationState } from './operation-reducer-types';

const getOperationsState = (state: RootState): OperationState => state.operationReducer;

export const selectOperations = createSelector(
  [getOperationsState],
  operationState => operationState.operations
);
