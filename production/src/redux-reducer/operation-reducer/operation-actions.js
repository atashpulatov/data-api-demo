import { operationsMap } from '../../operation/operation-steps';
import {
  CANCEL_OPERATION,
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
  EDIT_OPERATION,
  HIGHLIGHT_OPERATION,
  IMPORT_OPERATION,
  MARK_STEP_COMPLETED,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
  UPDATE_OPERATION,
} from '../../operation/operation-type-names';
import { objectImportType } from '../../mstr-object/constants';

function getStepsQueue(operationType, importType) {
  const operationsStepsMap = JSON.parse(JSON.stringify(operationsMap[importType]));
  return operationsStepsMap[operationType];
}

function createOperation(
  operationType,
  objectWorkingId,
  objectData = {},
  importType = objectImportType.TABLE
) {
  const { backupObjectData, objectEditedData } = objectData;
  return {
    operationType,
    objectWorkingId,
    stepsQueue: getStepsQueue(operationType, importType),
    loadedRows: 0,
    totalRows: 0,
    backupObjectData,
    objectEditedData,
  };
}

export const importRequested = (object, pageByObjectWorkingId) => {
  const objectWorkingId = pageByObjectWorkingId ?? Date.now();
  object.objectWorkingId = objectWorkingId;
  return {
    type: IMPORT_OPERATION,
    payload: {
      operation: createOperation(IMPORT_OPERATION, objectWorkingId, {}, object.importType),
      object,
    },
  };
};

export const refreshRequested = (objectWorkingId, importType) => ({
  type: REFRESH_OPERATION,
  payload: {
    operation: createOperation(REFRESH_OPERATION, objectWorkingId, {}, importType),
    objectWorkingId,
  },
});

export const editRequested = (objectData, objectEditedData) => {
  const backupObjectData = JSON.parse(JSON.stringify(objectData));
  const { objectWorkingId } = backupObjectData;
  // Refer to objectData to get importType as objectEditedData.importType does not
  // reflect the correct importType for the object being edited or re-prompted.
  return {
    type: EDIT_OPERATION,
    payload: {
      operation: createOperation(
        EDIT_OPERATION,
        objectWorkingId,
        { backupObjectData, objectEditedData },
        objectData.importType
      ),
      objectWorkingId,
    },
  };
};

export const duplicateRequested = (object, objectEditedData) => {
  const { objectWorkingId, importType } = object;
  return {
    type: DUPLICATE_OPERATION,
    payload: {
      operation: createOperation(
        DUPLICATE_OPERATION,
        objectWorkingId,
        { objectEditedData },
        importType
      ),
      object,
    },
  };
};

export const removeRequested = (objectWorkingId, importType) => ({
  type: REMOVE_OPERATION,
  payload: {
    operation: createOperation(REMOVE_OPERATION, objectWorkingId, {}, importType),
    objectWorkingId,
  },
});

export const highlightRequested = objectWorkingId => ({
  type: HIGHLIGHT_OPERATION,
  payload: {
    operation: createOperation(HIGHLIGHT_OPERATION, objectWorkingId),
    objectWorkingId,
  },
});

export const clearDataRequested = (objectWorkingId, importType) => ({
  type: CLEAR_DATA_OPERATION,
  payload: {
    operation: createOperation(CLEAR_DATA_OPERATION, objectWorkingId, {}, importType),
    objectWorkingId,
  },
});

export const markStepCompleted = (objectWorkingId, completedStep) => ({
  type: MARK_STEP_COMPLETED,
  payload: {
    objectWorkingId,
    completedStep,
  },
});

export const updateOperation = updatedOperationProps => ({
  type: UPDATE_OPERATION,
  payload: updatedOperationProps,
});

export const cancelOperation = objectWorkingId => ({
  type: CANCEL_OPERATION,
  payload: { objectWorkingId },
});
