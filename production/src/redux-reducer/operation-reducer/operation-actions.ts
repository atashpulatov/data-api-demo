import { OperationAction, OperationData } from './operation-reducer-types';

import { operationsMap, OperationSteps } from '../../operation/operation-steps';
import {
  CANCEL_OPERATION,
  MARK_STEP_COMPLETED,
  OperationTypes,
  UPDATE_OPERATION,
} from '../../operation/operation-type-names';
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
  objectData: any = {},
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
): OperationAction => {
  // TODO find better way for unique Id
  const objectWorkingId = Date.now() + pageByIndex;
  object.objectWorkingId = objectWorkingId;
  return {
    type: OperationTypes.IMPORT_OPERATION,
    payload: {
      operation: createOperation(
        OperationTypes.IMPORT_OPERATION,
        objectWorkingId,
        { preparedInstanceDefinition },
        object.importType
      ),
      object,
    },
  };
};

export const refreshRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): OperationAction => ({
  type: OperationTypes.REFRESH_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.REFRESH_OPERATION, objectWorkingId, {}, importType),
    objectWorkingId,
  },
});

export const editRequested = (objectData: any, objectEditedData: any): OperationAction => {
  const backupObjectData = JSON.parse(JSON.stringify(objectData));
  const { objectWorkingId } = backupObjectData;
  // Refer to objectData to get importType as objectEditedData.importType does not
  // reflect the correct importType for the object being edited or re-prompted.
  return {
    type: OperationTypes.EDIT_OPERATION,
    payload: {
      operation: createOperation(
        OperationTypes.EDIT_OPERATION,
        objectWorkingId,
        { backupObjectData, objectEditedData },
        objectData.importType
      ),
      objectWorkingId,
    },
  };
};

export const duplicateRequested = (object: any, objectEditedData?: any): OperationAction => {
  const { objectWorkingId, importType } = object;
  return {
    type: OperationTypes.DUPLICATE_OPERATION,
    payload: {
      operation: createOperation(
        OperationTypes.DUPLICATE_OPERATION,
        objectWorkingId,
        { objectEditedData },
        importType
      ),
      object,
    },
  };
};

export const removeRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): OperationAction => ({
  type: OperationTypes.REMOVE_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.REMOVE_OPERATION, objectWorkingId, {}, importType),
    objectWorkingId,
  },
});

export const highlightRequested = (objectWorkingId: number): OperationAction => ({
  type: OperationTypes.HIGHLIGHT_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.HIGHLIGHT_OPERATION, objectWorkingId),
    objectWorkingId,
  },
});

export const clearDataRequested = (
  objectWorkingId: number,
  importType: ObjectImportType
): OperationAction => ({
  type: OperationTypes.CLEAR_DATA_OPERATION,
  payload: {
    operation: createOperation(
      OperationTypes.CLEAR_DATA_OPERATION,
      objectWorkingId,
      {},
      importType
    ),
    objectWorkingId,
  },
});

export const markStepCompleted = (
  objectWorkingId: number,
  completedStep: OperationSteps
): OperationAction => ({
  type: MARK_STEP_COMPLETED,
  payload: {
    objectWorkingId,
    completedStep,
  },
});

export const updateOperation = (
  updatedOperationProps: Partial<OperationData>
): OperationAction => ({
  type: UPDATE_OPERATION,
  payload: updatedOperationProps,
});

export const cancelOperation = (objectWorkingId: number): OperationAction => ({
  type: CANCEL_OPERATION,
  payload: { objectWorkingId },
});
