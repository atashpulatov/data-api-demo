import { Action } from 'redux';

export interface PromptsAnswer {
  key: string;
  useDefault: boolean;
  values: string[];
}

export interface AnswersState {
  answers: PromptsAnswer[];
}

export enum AnswerActionTypes {
  IMPORT_OPERATION = 'IMPORT_OPERATION',
  EDIT_OPERATION = 'EDIT_OPERATION',
  RESTORE_ALL_ANSWERS = 'RESTORE_ALL_ANSWERS',
  CLEAR_ANSWERS = 'CLEAR_ANSWERS',
  UPDATE_ANSWERS = 'UPDATE_ANSWERS',
}

export interface ImportOperationAction extends Action {
  type: AnswerActionTypes.IMPORT_OPERATION;
  payload: any; // Replace 'any' with the appropriate type
}

export interface RestoreAllAnswersAction extends Action {
  type: AnswerActionTypes.RESTORE_ALL_ANSWERS;
  payload: PromptsAnswer[];
}

export interface EditOperationAction extends Action {
  type: AnswerActionTypes.EDIT_OPERATION;
  payload: any; // Replace 'any' with the appropriate type
}

export interface ClearAnswersAction extends Action {
  type: AnswerActionTypes.CLEAR_ANSWERS;
}

export type AnswerActions =
  | ImportOperationAction
  | RestoreAllAnswersAction
  | EditOperationAction
  | ClearAnswersAction;
