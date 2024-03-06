export const ADD_REPROMPT_TASK = 'ADD_REPROMPT_TASK';
export const EXECUTE_NEXT_REPROMPT_TASK = 'EXECUTE_NEXT_REPROMPT_TASK';
export const CLEAR_REPROMPT_TASKS = 'CLEAR_REPROMPT_TASKS';

/**
 * Adds a task to the reprompt queue to be executed later.
 * @param {*} task
 * @returns
 */
export function addRepromptTask(task) {
  return { type: ADD_REPROMPT_TASK, payload: task };
}

/**
 * Dequeues and executes the task first in the reprompt queue.
 * @returns
 */
export function executeNextRepromptTask() {
  return { type: EXECUTE_NEXT_REPROMPT_TASK };
}

/**
 * Clears the reprompt queue and resets the index and total.
 * @returns
 */
export function clearRepromptTask() {
  return { type: CLEAR_REPROMPT_TASKS };
}
