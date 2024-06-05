import { Action } from 'redux';

import { VisualizationTypes } from '../../mstr-object/mstr-object-types';
import {
  CrosstabHeaderDimensions,
  ManipulationsXML,
  ObjectData,
  SubtotalsInfo,
  VisualizationInfo,
} from '../../types/object-types';

import { OperationSteps } from '../../operation/operation-steps';
import { OperationTypes } from '../../operation/operation-type-names';

export interface MstrTable {
  tableSize: { rows: number; columns: number };
  columnInformation: any[]; // Replace with actual type
  headers: {
    rows?: any[]; // Replace with actual type
    columns?: any[]; // Replace with actual type
    subtotalAddress?: any[]; // Replace with actual type
  };
  id: string;
  isCrosstab: boolean;
  isCrosstabular: boolean;
  name: string;
  rows: { row: any[] }; // Replace with actual type
  visualizationType: VisualizationTypes;
  attributesNames: { rowsAttributes: any[] }; // Replace with actual type
  attributes: any[]; // Replace with actual type
  metrics: any[]; // Replace with actual type
  prevCrosstabDimensions?: false | CrosstabHeaderDimensions;
  crosstabHeaderDimensions?: CrosstabHeaderDimensions;
  metricsInRows?: boolean;
  subtotalsInfo?: SubtotalsInfo;
  toCrosstabChange?: boolean;
  fromCrosstabChange?: boolean;
}

export interface InstanceDefinition {
  instanceId?: string;
  body?: any;
  visualizationInfo?: VisualizationInfo;
  mstrTable?: MstrTable;
  rows?: number;
  columns?: number;
  data?: any[];
  definition?: any;
  manipulationsXML?: ManipulationsXML;
  status?: number;
}

export interface OperationData {
  operationType: OperationTypes;
  objectWorkingId: number;
  stepsQueue: OperationSteps[];
  backupObjectData?: ObjectData;
  objectEditedData?: any;
  instanceDefinition?: InstanceDefinition;
  startCell?: string;
  excelContext?: Excel.RequestContext;
  officeTable?: Excel.Table;
  tableChanged?: boolean;
  totalRows?: number;
  loadedRows?: number;
  shouldFormat?: boolean;
  oldBindId?: string;
  repeatStep?: boolean;
  insertNewWorksheet?: boolean;
  shouldRenameExcelWorksheet?: boolean;
  preparedInstanceDefinition?: any;
  isTotalsRowVisible?: boolean;
  objectExist?: boolean;
  formattedData?: {
    dimensions: { rows: number; columns: number };
    sourceWorksheetId: string;
  };
  operationId: string;
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
  CANCEL_OPERATION_BY_OPERATION_ID = 'CANCEL_OPERATION_BY_OPERATION_ID',
}

export interface OperationPayload {
  operation: OperationData;
  object?: ObjectData;
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

export interface CancelOperationByOperationIdAction extends Action {
  type: OperationActionTypes.CANCEL_OPERATION_BY_OPERATION_ID;
  payload: { operationId: string };
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
  | CancelOperationAction
  | CancelOperationByOperationIdAction;
