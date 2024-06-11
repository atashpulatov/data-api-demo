/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  AddRepromptTaskAction,
  RepromptQueueActions,
  RepromptQueueActionTypes,
  RepromptsQueueState,
} from './reprompt-queue-reducer-types';

const initialState: RepromptsQueueState = {
  repromptsQueue: [],
  index: 0,
  total: 0,
  promptKeys: [],
};

export const repromptsQueueReducer = (
  // eslint-disable-next-line default-param-last
  state = initialState,
  action: RepromptQueueActions
): RepromptsQueueState => {
  switch (action.type) {
    case RepromptQueueActionTypes.ADD_REPROMPT_TASK:
      return addRepromptTask(state, action);

    case RepromptQueueActionTypes.EXECUTE_NEXT_REPROMPT_TASK:
      return executeNextRepromptTask(state);

    case RepromptQueueActionTypes.CLEAR_REPROMPT_TASKS:
      return clearRepromptTasks();
    case RepromptQueueActionTypes.ADD_PROMPT_KEY: {
      // Check if the key already exists in the array
      const newPromptKeys = state.promptKeys.includes(action.payload)
        ? state.promptKeys
        : [...state.promptKeys, action.payload];
      return {
        ...state,
        promptKeys: newPromptKeys,
      };
    }
    default:
      return state;
  }
};

const addRepromptTask = (
  state: RepromptsQueueState,
  action: AddRepromptTaskAction
): RepromptsQueueState => {
  // Check if the prompt key already exists in the array
  const newPromptKeys: string[] = state.promptKeys.includes(action.payload.promptKey)
    ? state.promptKeys
    : [...state.promptKeys, action.payload.promptKey];
  return {
    ...state,
    repromptsQueue: [...state.repromptsQueue, action.payload],
    total: action.payload.isPrompted ? state.total + 1 : state.total,
    promptKeys: newPromptKeys,
  };
};

const executeNextRepromptTask = (state: RepromptsQueueState): RepromptsQueueState => {
  let { index } = state;
  const [currentTask, ...remainingTasks] = state.repromptsQueue;
  if (currentTask) {
    currentTask.callback(); // Execute the current task
    currentTask.isPrompted && index++;
    return { ...state, index, repromptsQueue: remainingTasks };
  }
  // If there is no more task in queue, and the index is at the end of the queue,
  // then reset queue and index by returning initial state.
  return { ...initialState };
};

const clearRepromptTasks = (): RepromptsQueueState => ({ ...initialState });
