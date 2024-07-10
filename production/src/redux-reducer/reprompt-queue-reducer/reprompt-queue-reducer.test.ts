import {
  AddRepromptTaskAction,
  ClearRepromptTasksAction,
  EditOperationAction,
  ExecuteNextRepromptTaskAction,
  RepromptQueueActions,
  RepromptQueueActionTypes,
} from './reprompt-queue-reducer-types';

import { OperationTypes } from '../../operation/operation-type-names';
import * as RepromptQueueReducer from './reprompt-queue-reducer';

describe('reprompt-queue-reducer', () => {
  it('should return the initial state', () => {
    expect(
      RepromptQueueReducer.repromptsQueueReducer(undefined, {} as RepromptQueueActions)
    ).toEqual({
      index: 0,
      repromptsQueue: [],
      total: 0,
      promptKeys: [],
    });
  });

  it.each`
    isPrompted
    ${true}
    ${false}
  `('should call the add repromt task callback', isPrompted => {
    const repromptCallback = jest.fn();
    const action: AddRepromptTaskAction = {
      payload: {
        callback: repromptCallback,
        isPrompted: isPrompted.isPrompted,
      },
      type: RepromptQueueActionTypes.ADD_REPROMPT_TASK,
    };

    if (isPrompted.isPrompted) {
      expect(RepromptQueueReducer.repromptsQueueReducer(undefined, action)).toEqual({
        index: 0,
        promptKeys: [],
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
        promptKeys: [],
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
    const action: ExecuteNextRepromptTaskAction = {
      type: RepromptQueueActionTypes.EXECUTE_NEXT_REPROMPT_TASK,
    };

    expect(
      RepromptQueueReducer.repromptsQueueReducer(
        {
          repromptsQueue: [
            {
              callback: repromptCallback,
              isPrompted: true,
            },
          ],
          index: 0,
          total: 1,
        },
        action
      )
    ).toEqual({
      index: 1,
      repromptsQueue: [],
      total: 1,
    });
  });

  it('should call the clear reprompt callback', () => {
    const action: ClearRepromptTasksAction = {
      type: RepromptQueueActionTypes.CLEAR_REPROMPT_TASKS,
    };

    expect(RepromptQueueReducer.repromptsQueueReducer(undefined, action)).toEqual({
      index: 0,
      promptKeys: [],
      repromptsQueue: [],
      total: 0,
    });
  });

  it('should handle addMultiplePromptKeysTask correctly', () => {
    const actionWithPromptKeys: EditOperationAction = {
      type: RepromptQueueActionTypes.EDIT_OPERATION,
      payload: {
        operation: {
          objectEditedData: {
            promptKeys: ['key1', 'key2'],
          },
          operationType: OperationTypes.EDIT_OPERATION,
          objectWorkingId: 0,
          stepsQueue: [],
          operationId: '',
        },
      },
    };

    const actionWithoutPromptKeys: EditOperationAction = {
      type: RepromptQueueActionTypes.EDIT_OPERATION,
      payload: {
        operation: {
          objectEditedData: {},
          operationType: OperationTypes.EDIT_OPERATION,
          objectWorkingId: 0,
          stepsQueue: [],
          operationId: '',
        },
      },
    };

    // State before the action
    const initialState = {
      index: 0,
      repromptsQueue: [] as any[],
      total: 0,
      promptKeys: ['existingKey'],
    };

    // When promptKeys are present
    expect(RepromptQueueReducer.repromptsQueueReducer(initialState, actionWithPromptKeys)).toEqual({
      index: 0,
      repromptsQueue: [] as any[],
      total: 0,
      promptKeys: ['existingKey', 'key1', 'key2'],
    });

    // When promptKeys are absent
    expect(
      RepromptQueueReducer.repromptsQueueReducer(initialState, actionWithoutPromptKeys)
    ).toEqual(initialState);
  });
});
