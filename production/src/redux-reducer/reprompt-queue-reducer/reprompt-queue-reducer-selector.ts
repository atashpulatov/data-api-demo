import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { RepromptsQueueState } from './reprompt-queue-reducer-types';

const getRepromptsQueueState = (state: RootState): RepromptsQueueState =>
  state.repromptsQueueReducer;

const selectRepromptQueue = createSelector(
  [getRepromptsQueueState],
  (repromptsQueueReducer: RepromptsQueueState) => repromptsQueueReducer.repromptsQueue
);

const doesRepromptQueueContainItems = createSelector(
  selectRepromptQueue,
  repromptsQueue => repromptsQueue.length > 0
);

export const repromptsQueueSelector = {
  selectRepromptQueue,
  doesRepromptQueueContainItems,
};
