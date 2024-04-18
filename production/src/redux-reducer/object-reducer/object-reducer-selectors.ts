import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { ObjectState } from './object-reducer-types';

const getObjectState = (state: RootState): ObjectState => state.objectReducer;

export const selectObjectState = createSelector([getObjectState], objectState => objectState);

export const selectObjects = createSelector([getObjectState], objectState => objectState.objects);
