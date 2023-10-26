import React from 'react';
import * as RepromptQueueReducer from '../../../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer';

describe('reprompt-queue-reducer', () => {
  it('should return the initial state', () => {
    expect(RepromptQueueReducer.repromptsQueueReducer(undefined, {})).toEqual({
      index: 0,
      repromptsQueue: [],
      total: 0,
    });
  });

  it.each`
    isPrompted
    ${true}
    ${false}
  `('should call the add reprom[t task callback', (isPrompted) => {
    const repromptCallback = jest.fn();
    const action = {
      payload: {
        callback: repromptCallback,
        isPrompted: isPrompted.isPrompted,
      },
      type: 'ADD_REPROMPT_TASK',
    };

    if (isPrompted.isPrompted) {
      expect(RepromptQueueReducer.repromptsQueueReducer(undefined, action)).toEqual({
        index: 0,
        repromptsQueue: [
          {
            callback: repromptCallback,
            isPrompted: isPrompted.isPrompted,
          },
        ],
        total: 1,
      });
    } else {
      expect(RepromptQueueReducer.repromptsQueueReducer(undefined, action)).toEqual({
        index: 0,
        repromptsQueue: [
          {
            callback: repromptCallback,
            isPrompted: isPrompted.isPrompted,
          },
        ],
        total: 0,
      });
    }
  });

  it('should call the execute next reprompt callback', () => {
    const repromptCallback = jest.fn();
    const action = {
      type: 'EXECUTE_NEXT_REPROMPT_TASK',
    };

    expect(RepromptQueueReducer.repromptsQueueReducer({ repromptsQueue: [
      {
        callback: repromptCallback,
        isPrompted: true,
      }
    ], index: 0, total: 1 }, action)).toEqual({
      index: 1,
      repromptsQueue: [],
      total: 1,
    });
  });

  it('should call the clear reprompt callback', () => {
    const action = {
      type: 'CLEAR_REPROMPT_TASKS',
    };

    expect(RepromptQueueReducer.repromptsQueueReducer(undefined, action)).toEqual({
      index: 0,
      repromptsQueue: [],
      total: 0,
    });
  });
});
