import { Action } from 'redux';

export interface RepromptsQueueState {
  repromptsQueue: any[];
  total?: number;
  index?: number;
}
export enum RepromptQueueActionTypes {
  ADD_REPROMPT_TASK = 'ADD_REPROMPT_TASK',
  EXECUTE_NEXT_REPROMPT_TASK = 'EXECUTE_NEXT_REPROMPT_TASK',
  CLEAR_REPROMPT_TASKS = 'CLEAR_REPROMPT_TASKS',
}

export interface RepromptQueueTask {
  callback: () => void;
  isPrompted: boolean;
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

export type RepromptQueueActions =
  | AddRepromptTaskAction
  | ExecuteNextRepromptTaskAction
  | ClearRepromptTasksAction;
