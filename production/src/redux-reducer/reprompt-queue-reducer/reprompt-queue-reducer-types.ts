import { Action } from 'redux';

import { OperationData } from '../operation-reducer/operation-reducer-types';

// Define the structure for the payload that includes the operation
interface EditOperationPayload {
  operation: OperationData;
}

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
  EDIT_OPERATION = 'EDIT_OPERATION',
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

export interface EditOperationAction extends Action {
  type: RepromptQueueActionTypes.EDIT_OPERATION;
  payload: EditOperationPayload;
}

export type RepromptQueueActions =
  | AddRepromptTaskAction
  | ExecuteNextRepromptTaskAction
  | ClearRepromptTasksAction
  | EditOperationAction;
