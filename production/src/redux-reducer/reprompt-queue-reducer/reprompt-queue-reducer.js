import {
  ADD_REPROMPT_TASK,
  EXECUTE_REPROMPT_TASK,
  CLEAR_REPROMPT_TASKS,
  INIT_REPROMPT_TASKS
} from './reprompt-queue-actions';

const initialState = { repromptsQueue: [], index: 0, total: 0 };

export const repromptsQueueReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REPROMPT_TASK:
      return { ...state, repromptsQueue: [...state.repromptsQueue, action.payload] };

    case EXECUTE_REPROMPT_TASK: {
      let idx = state.index;
      const [currentTask, ...remainingTasks] = state.repromptsQueue;
      if (currentTask) {
        currentTask(); // Execute the current task
        idx++;
      }
      return { ...state, index: idx, repromptsQueue: remainingTasks };
    }

    case INIT_REPROMPT_TASKS:
      return { ...state, index: 0, total: state.repromptsQueue.length };

    case CLEAR_REPROMPT_TASKS:
      return { ...initialState, };

    default:
      return state;
  }
};
