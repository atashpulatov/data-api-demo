import { Action } from 'redux';

import { ObjectData } from '../../types/object-types';

import { OperationSteps } from '../../operation/operation-steps';
import { OperationTypes } from '../../operation/operation-type-names';

// TODO: refactor.
// this is a temporary initial version. it should be improved

export interface InstanceDefinition {
  // TODO remove when type is finalized
  [key: string]: any;
}

export interface OperationData {
  operationType: OperationTypes;
  objectWorkingId: number;
  stepsQueue: OperationSteps[];
  backupObjectData?: ObjectData;
  objectEditedData?: ObjectData;
  instanceDefinition?: InstanceDefinition;
  startCell?: string;
  excelContext?: Excel.RequestContext;
  officeTable?: Excel.Table;
  tableChanged?: boolean;
  totalRows?: number;
  loadedRows?: number;
  shouldFormat?: boolean;
  // TODO remove when type is finalized
  [key: string]: any;
}

export interface OperationState {
  operations: OperationData[];
}

export enum OperationActionTypes {
  IMPORT_OPERATION = 'IMPORT_OPERATION',
  REFRESH_OPERATION = 'REFRESH_OPERATION',
  EDIT_OPERATION = 'EDIT_OPERATION',
  DUPLICATE_OPERATION = 'DUPLICATE_OPERATION',
  REMOVE_OPERATION = 'REMOVE_OPERATION',
  HIGHLIGHT_OPERATION = 'HIGHLIGHT_OPERATION',
  CLEAR_DATA_OPERATION = 'CLEAR_DATA_OPERATION',
  MARK_STEP_COMPLETED = 'MARK_STEP_COMPLETED',
  UPDATE_OPERATION = 'UPDATE_OPERATION',
  CANCEL_OPERATION = 'CANCEL_OPERATION',
}

export interface OperationPayload {
  operation: OperationData;
}

export interface MarkStepCompletedPayload {
  objectWorkingId: number;
  completedStep: OperationSteps;
}

export interface ImportOperationAction extends Action {
  type: OperationActionTypes.IMPORT_OPERATION;
  payload: OperationPayload;
}

export interface RefreshOperationAction extends Action {
  type: OperationActionTypes.REFRESH_OPERATION;
  payload: OperationPayload;
}

export interface EditOperationAction extends Action {
  type: OperationActionTypes.EDIT_OPERATION;
  payload: OperationPayload;
}

export interface DuplicateOperationAction extends Action {
  type: OperationActionTypes.DUPLICATE_OPERATION;
  payload: OperationPayload;
}

export interface RemoveOperationAction extends Action {
  type: OperationActionTypes.REMOVE_OPERATION;
  payload: OperationPayload;
}

export interface HighlightOperationAction extends Action {
  type: OperationActionTypes.HIGHLIGHT_OPERATION;
  payload: OperationPayload;
}

export interface ClearDataOperationAction extends Action {
  type: OperationActionTypes.CLEAR_DATA_OPERATION;
  payload: OperationPayload;
}

export interface MarkStepCompletedAction extends Action {
  type: OperationActionTypes.MARK_STEP_COMPLETED;
  payload: MarkStepCompletedPayload;
}

export interface UpdateOperationAction extends Action {
  type: OperationActionTypes.UPDATE_OPERATION;
  payload: Partial<OperationData>;
}

export interface CancelOperationAction extends Action {
  type: OperationActionTypes.CANCEL_OPERATION;
  payload: { objectWorkingId: number };
}

export type OperationActions =
  | ImportOperationAction
  | RefreshOperationAction
  | EditOperationAction
  | DuplicateOperationAction
  | RemoveOperationAction
  | HighlightOperationAction
  | ClearDataOperationAction
  | MarkStepCompletedAction
  | UpdateOperationAction
  | CancelOperationAction;
