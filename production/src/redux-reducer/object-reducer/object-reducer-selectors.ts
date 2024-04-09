import { createSelector } from 'reselect';

const getObjectState = (state: any): any => state.objectReducer;

export const selectObjectState = createSelector([getObjectState], objectState => objectState);
