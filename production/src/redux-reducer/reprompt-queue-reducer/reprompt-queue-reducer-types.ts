import { Action } from 'redux';

export interface RepromptsQueueState {
  repromptsQueue: any[];
  total?: number;
  index?: number;
  promptKeys?: string[];
}
export enum RepromptQueueActionTypes {
  ADD_REPROMPT_TASK = 'ADD_REPROMPT_TASK',
  EXECUTE_NEXT_REPROMPT_TASK = 'EXECUTE_NEXT_REPROMPT_TASK',
  CLEAR_REPROMPT_TASKS = 'CLEAR_REPROMPT_TASKS',
  ADD_PROMPT_KEY = 'ADD_PROMPT_KEY',
  ADD_MULTIPLE_PROMPT_KEYS = 'ADD_MULTIPLE_PROMPT_KEYS',
}

export interface RepromptQueueTask {
  callback: () => void;
  isPrompted: boolean;
  promptKey: string;
}

export interface AddRepromptTaskAction extends Action {
  type: RepromptQueueActionTypes.ADD_REPROMPT_TASK;
  payload: RepromptQueueTask;
}

export interface ExecuteNextRepromptTaskAction extends Action {
  type: RepromptQueueActionTypes.EXECUTE_NEXT_REPROMPT_TASK;
}

export interface ClearRepromptTasksAction extends Action {
  type: RepromptQueueActionTypes.CLEAR_REPROMPT_TASKS;
}

export interface AddPromptKeyAction extends Action {
  type: RepromptQueueActionTypes.ADD_PROMPT_KEY;
  payload: string;
}

export interface AddMultiplePromptKeysAction extends Action {
  type: RepromptQueueActionTypes.ADD_MULTIPLE_PROMPT_KEYS;
  payload: string[];
}

export type RepromptQueueActions =
  | AddRepromptTaskAction
  | ExecuteNextRepromptTaskAction
  | ClearRepromptTasksAction
  | AddPromptKeyAction
  | AddMultiplePromptKeysAction;
