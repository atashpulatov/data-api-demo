import {
  ADD_REPROMPT_TASK,
  EXECUTE_NEXT_REPROMPT_TASK,
  CLEAR_REPROMPT_TASKS,
} from './reprompt-queue-actions';

const initialState = { repromptsQueue: [], index: 0, total: 0 };

export const repromptsQueueReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REPROMPT_TASK:
      return {
        ...state,
        repromptsQueue: [...state.repromptsQueue, action.payload],
        total: action.payload.isPrompted ? state.total + 1 : state.total,
      };

    case EXECUTE_NEXT_REPROMPT_TASK: {
      let idx = state.index;
      const [currentTask, ...remainingTasks] = state.repromptsQueue;
      if (currentTask) {
        currentTask.callback(); // Execute the current task
        currentTask.isPrompted && idx++;

        return { ...state, index: idx, repromptsQueue: remainingTasks };
      }
      // If there is no more task in queue, and the index is at the end of the queue,
      // then reset queue and index by returning initial state.
      return { ...initialState, };
    }

    case CLEAR_REPROMPT_TASKS:
      return { ...initialState, };

    default:
      return state;
  }
};
