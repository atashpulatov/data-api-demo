import { Action } from 'redux';

import { ObjectData } from '../object-reducer/object-reducer-types';

import { OperationSteps } from '../../operation/operation-steps';
import { OperationTypes } from '../../operation/operation-type-names';

// TODO: refactor.
// this is a temporary initial version. it should be improved
export interface OperationData {
  operationType: OperationTypes;
  objectWorkingId: number;
  stepsQueue: OperationSteps[];
  backupObjectData?: ObjectData;
  objectEditedData?: ObjectData;
  instanceDefinition?: any;
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

export interface OperationAction extends Action {
  payload: any; // Replace 'any' with the appropriate payload interface
}

export interface OperationPayload {
  operation: OperationData;
  objectWorkingId: number;
  completedStep: string;
  updatedOperationProps: Partial<OperationData>;
}
