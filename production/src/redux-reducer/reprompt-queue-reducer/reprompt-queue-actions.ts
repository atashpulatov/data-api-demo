import {
  AddRepromptTaskAction,
  ClearRepromptTasksAction,
  ExecuteNextRepromptTaskAction,
  RepromptQueueActionTypes,
  RepromptQueueTask,
} from './reprompt-queue-reducer-types';

/**
 * Adds a task to the reprompt queue to be executed later.
 * @param task
 * @returns
 */
export function addRepromptTask(task: RepromptQueueTask): AddRepromptTaskAction {
  return { type: RepromptQueueActionTypes.ADD_REPROMPT_TASK, payload: task };
}

/**
 * Dequeues and executes the task first in the reprompt queue.
 * @returns
 */
export function executeNextRepromptTask(): ExecuteNextRepromptTaskAction {
  return { type: RepromptQueueActionTypes.EXECUTE_NEXT_REPROMPT_TASK };
}

/**
 * Clears the reprompt queue and resets the index and total.
 * @returns
 */
export function clearRepromptTask(): ClearRepromptTasksAction {
  return { type: RepromptQueueActionTypes.CLEAR_REPROMPT_TASKS };
}
