import { ObjectData } from '../object-reducer/object-reducer-types';
import {
  CancelOperationAction,
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
  UpdateOperationPayload,
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

function createOperation(
  operationType: OperationTypes,
  objectWorkingId: number,
  objectData: ObjectData = {},
  importType = ObjectImportType.TABLE
): OperationData {
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
  };
}

export const importRequested = (
  object: any,
  preparedInstanceDefinition?: any,
  pageByIndex = 0
): ImportOperationAction => {
  // TODO find better way for unique Id
  const objectWorkingId = Date.now() + pageByIndex;
  object.objectWorkingId = objectWorkingId;
  return {
    type: OperationActionTypes.IMPORT_OPERATION,
    payload: {
      operation: createOperation(
        OperationTypes.IMPORT_OPERATION,
        objectWorkingId,
        { preparedInstanceDefinition },
        object.importType
      ),
    },
  };
};

export const refreshRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): RefreshOperationAction => ({
  type: OperationActionTypes.REFRESH_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.REFRESH_OPERATION, objectWorkingId, {}, importType),
  },
});

export const editRequested = (
  objectData: ObjectData,
  objectEditedData: ObjectData
): EditOperationAction => {
  const backupObjectData = JSON.parse(JSON.stringify(objectData));
  const { objectWorkingId } = backupObjectData;
  // Refer to objectData to get importType as objectEditedData.importType does not
  // reflect the correct importType for the object being edited or re-prompted.
  return {
    type: OperationActionTypes.EDIT_OPERATION,
    payload: {
      operation: createOperation(
        OperationTypes.EDIT_OPERATION,
        objectWorkingId,
        { backupObjectData, objectEditedData },
        objectData.importType
      ),
    },
  };
};

export const duplicateRequested = (
  object: ObjectData,
  objectEditedData?: ObjectData
): DuplicateOperationAction => {
  const { objectWorkingId, importType } = object;
  return {
    type: OperationActionTypes.DUPLICATE_OPERATION,
    payload: {
      operation: createOperation(
        OperationTypes.DUPLICATE_OPERATION,
        objectWorkingId,
        { objectEditedData },
        importType
      ),
    },
  };
};

export const removeRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): RemoveOperationAction => ({
  type: OperationActionTypes.REMOVE_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.REMOVE_OPERATION, objectWorkingId, {}, importType),
  },
});

export const highlightRequested = (objectWorkingId: number): HighlightOperationAction => ({
  type: OperationActionTypes.HIGHLIGHT_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.HIGHLIGHT_OPERATION, objectWorkingId),
  },
});

export const clearDataRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): ClearDataOperationAction => ({
  type: OperationActionTypes.CLEAR_DATA_OPERATION,
  payload: {
    operation: createOperation(
      OperationTypes.CLEAR_DATA_OPERATION,
      objectWorkingId,
      {},
      importType
    ),
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
  updatedOperationProps: UpdateOperationPayload
): UpdateOperationAction => ({
  type: OperationActionTypes.UPDATE_OPERATION,
  payload: updatedOperationProps,
});

export const cancelOperation = (objectWorkingId: number): CancelOperationAction => ({
  type: OperationActionTypes.CANCEL_OPERATION,
  payload: { objectWorkingId },
});
