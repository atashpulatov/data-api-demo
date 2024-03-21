import { operationsMap } from '../../operation/operation-steps';
import {
  CANCEL_OPERATION,
  MARK_STEP_COMPLETED,
  OperationTypes,
  UPDATE_OPERATION,
} from '../../operation/operation-type-names';
import { ObjectImportType } from '../../mstr-object/constants';

function getStepsQueue(operationType, importType) {
  const operationsStepsMap = JSON.parse(JSON.stringify(operationsMap[importType]));
  return operationsStepsMap[operationType];
}

function createOperation(
  operationType,
  objectWorkingId,
  objectData = {},
  importType = ObjectImportType.TABLE
) {
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

export const importRequested = (object, preparedInstanceDefinition, pageByIndex = 0) => {
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

export const refreshRequested = (objectWorkingId, importType) => ({
  type: OperationTypes.REFRESH_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.REFRESH_OPERATION, objectWorkingId, {}, importType),
    objectWorkingId,
  },
});

export const editRequested = (objectData, objectEditedData) => {
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

export const duplicateRequested = (object, objectEditedData) => {
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

export const removeRequested = (objectWorkingId, importType) => ({
  type: OperationTypes.REMOVE_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.REMOVE_OPERATION, objectWorkingId, {}, importType),
    objectWorkingId,
  },
});

export const highlightRequested = objectWorkingId => ({
  type: OperationTypes.HIGHLIGHT_OPERATION,
  payload: {
    operation: createOperation(OperationTypes.HIGHLIGHT_OPERATION, objectWorkingId),
    objectWorkingId,
  },
});

export const clearDataRequested = (objectWorkingId, importType) => ({
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
