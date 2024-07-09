import { v4 as uuidv4 } from 'uuid';

import { ObjectData } from '../../types/object-types';
import {
  CancelOperationAction,
  CancelOperationByOperationIdAction,
  ClearDataOperationAction,
  DuplicateOperationAction,
  EditOperationAction,
  HighlightOperationAction,
  ImportOperationAction,
  MarkStepCompletedAction,
  OperationActionTypes,
  OperationData,
  RefreshOperationAction,
  RemoveOperationAction,
  UpdateOperationAction,
} from './operation-reducer-types';

import { operationsMap, OperationSteps } from '../../operation/operation-steps';
import { OperationTypes } from '../../operation/operation-type-names';
import { ObjectImportType } from '../../mstr-object/constants';

function getStepsQueue(
  operationType: OperationTypes,
  importType: ObjectImportType
): OperationSteps[] {
  const operationsStepsMap = JSON.parse(JSON.stringify(operationsMap[importType]));
  return operationsStepsMap[operationType];
}

function createOperation({
  operationType,
  objectWorkingId,
  objectData = {},
  importType = ObjectImportType.TABLE,
  startCell,
}: {
  operationType: OperationTypes;
  objectWorkingId: number;
  objectData?: any;
  importType?: ObjectImportType;
  startCell?: string;
}): OperationData {
  const { backupObjectData, objectEditedData, preparedInstanceDefinition } = objectData;
  return {
    operationType,
    objectWorkingId,
    stepsQueue: getStepsQueue(operationType, importType),
    loadedRows: 0,
    totalRows: 0,
    backupObjectData,
    objectEditedData,
    preparedInstanceDefinition,
    operationId: uuidv4(),
    startCell,
  };
}

export const importRequested = ({
  object,
  preparedInstanceDefinition,
  pageByIndex = 0,
  startCell,
}: {
  object: ObjectData;
  preparedInstanceDefinition?: any;
  pageByIndex?: number;
  startCell?: string;
}): ImportOperationAction => {
  // TODO find better way for unique Id
  const objectWorkingId = Date.now() + pageByIndex;
  object.objectWorkingId = objectWorkingId;

  return {
    type: OperationActionTypes.IMPORT_OPERATION,
    payload: {
      operation: createOperation({
        operationType: OperationTypes.IMPORT_OPERATION,
        objectWorkingId,
        objectData: { preparedInstanceDefinition },
        importType: object.importType,
        startCell,
      }),
      object,
    },
  };
};

export const refreshRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): RefreshOperationAction => ({
  type: OperationActionTypes.REFRESH_OPERATION,
  payload: {
    operation: createOperation({
      operationType: OperationTypes.REFRESH_OPERATION,
      objectWorkingId,
      objectData: {},
      importType,
    }),
  },
});

export const editRequested = (
  objectData: ObjectData,
  objectEditedData: any
): EditOperationAction => {
  const backupObjectData = JSON.parse(JSON.stringify(objectData));
  const { objectWorkingId } = backupObjectData;
  // Refer to objectData to get importType as objectEditedData.importType does not
  // reflect the correct importType for the object being edited or re-prompted.
  return {
    type: OperationActionTypes.EDIT_OPERATION,
    payload: {
      operation: createOperation({
        operationType: OperationTypes.EDIT_OPERATION,
        objectWorkingId,
        objectData: { backupObjectData, objectEditedData },
        importType: objectData.importType,
      }),
    },
  };
};

export const duplicateRequested = (
  object: ObjectData,
  objectEditedData?: any
): DuplicateOperationAction => {
  const { objectWorkingId, importType } = object;
  return {
    type: OperationActionTypes.DUPLICATE_OPERATION,
    payload: {
      operation: createOperation({
        operationType: OperationTypes.DUPLICATE_OPERATION,
        objectWorkingId,
        objectData: { objectEditedData },
        importType,
      }),
      object,
    },
  };
};

export const removeRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): RemoveOperationAction => ({
  type: OperationActionTypes.REMOVE_OPERATION,
  payload: {
    operation: createOperation({
      operationType: OperationTypes.REMOVE_OPERATION,
      objectWorkingId,
      objectData: {},
      importType,
    }),
  },
});

export const highlightRequested = (objectWorkingId: number): HighlightOperationAction => ({
  type: OperationActionTypes.HIGHLIGHT_OPERATION,
  payload: {
    operation: createOperation({
      operationType: OperationTypes.HIGHLIGHT_OPERATION,
      objectWorkingId,
    }),
  },
});

export const clearDataRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): ClearDataOperationAction => ({
  type: OperationActionTypes.CLEAR_DATA_OPERATION,
  payload: {
    operation: createOperation({
      operationType: OperationTypes.CLEAR_DATA_OPERATION,
      objectWorkingId,
      objectData: {},
      importType,
    }),
  },
});

export const markStepCompleted = (
  objectWorkingId: number,
  completedStep: OperationSteps
): MarkStepCompletedAction => ({
  type: OperationActionTypes.MARK_STEP_COMPLETED,
  payload: {
    objectWorkingId,
    completedStep,
  },
});

export const updateOperation = (
  updatedOperationProps: Partial<OperationData>
): UpdateOperationAction => ({
  type: OperationActionTypes.UPDATE_OPERATION,
  payload: updatedOperationProps,
});

export const cancelOperation = (objectWorkingId: number): CancelOperationAction => ({
  type: OperationActionTypes.CANCEL_OPERATION,
  payload: { objectWorkingId },
});

export const cancelOperationByOperationId = (
  operationId: string
): CancelOperationByOperationIdAction => ({
  type: OperationActionTypes.CANCEL_OPERATION_BY_OPERATION_ID,
  payload: { operationId },
});
