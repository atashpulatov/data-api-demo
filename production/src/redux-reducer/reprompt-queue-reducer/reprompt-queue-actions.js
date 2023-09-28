export const ADD_REPROMPT_TASK = 'ADD_REPROMPT_TASK';
export const EXECUTE_REPROMPT_TASK = 'EXECUTE_REPROMPT_TASK';
export const CLEAR_REPROMPT_TASKS = 'CLEAR_REPROMPT_TASKS';
export const INIT_REPROMPT_TASKS = 'INIT_REPROMPT_TASKS';

/**
 *
 * @param {*} task
 * @returns
 */
export function addRepromptTask(task) {
  return { type: ADD_REPROMPT_TASK, payload: task };
}

/**
 *
 * @returns
 */
export function executeRepromptTask() {
  return { type: EXECUTE_REPROMPT_TASK };
}

/**
 *
 * @returns
 */
export function clearRepromptTask() {
  return { type: CLEAR_REPROMPT_TASKS };
}

/**
 *
 * @returns
 */
export function initRepromptTasks() {
  return { type: INIT_REPROMPT_TASKS };
}
