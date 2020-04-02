import { operationStepsMap } from './operation-steps';
import {
  IMPORT_OPERATION,
  EDIT_OPERATION,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
  MARK_STEP_COMPLETED,
  BACKUP_OBJECT,
  UPDATE_OPERATION,
  CANCEL_OPERATION,
} from './operation-type-names';

export const importRequested = (object) => {
  const objectWorkingId = Date.now();
  object.objectWorkingId = objectWorkingId;
  return {
    type: IMPORT_OPERATION,
    payload: {
      operation: createOperation(IMPORT_OPERATION, objectWorkingId),
      object,
    },
  };
};

export const refreshRequested = (objectData) => {
  const backupObjectData = JSON.parse(JSON.stringify(objectData));
  const { objectWorkingId } = backupObjectData;
  return {
    type: REFRESH_OPERATION,
    payload: {
      operation: createOperation(REFRESH_OPERATION, objectWorkingId),
      objectWorkingId,
      backupObjectData: objectData
    },
  };
};

export const editRequested = (objectData, objectEditedData) => {
  const backupObjectData = JSON.parse(JSON.stringify(objectData));
  const { objectWorkingId } = backupObjectData;
  return {
    type: EDIT_OPERATION,
    payload: {
      operation: createOperation(EDIT_OPERATION, objectWorkingId, { backupObjectData, objectEditedData }),
      objectWorkingId,
    },
  };
};

export const duplicateRequested = (objectData) => {
  const newObjectData = JSON.parse(JSON.stringify(objectData));
  const objectWorkingId = Date.now();
  newObjectData.objectWorkingId = objectWorkingId;
  return {
    type: DUPLICATE_OPERATION,
    payload: {
      operation: createOperation(DUPLICATE_OPERATION, objectWorkingId),
      object: newObjectData,
    },
  };
};

export const removeRequested = (objectWorkingId) => ({
  type: REMOVE_OPERATION,
  payload: {
    operation: createOperation(REMOVE_OPERATION, objectWorkingId),
    objectWorkingId,
  },
});

export const clearDataRequested = (objectWorkingId) => ({
  type: CLEAR_DATA_OPERATION,
  payload: {
    operation: createOperation(CLEAR_DATA_OPERATION, objectWorkingId),
    objectWorkingId,
  },
});

export const markStepCompleted = (objectWorkingId, completedStep) => ({
  type: MARK_STEP_COMPLETED,
  payload: {
    objectWorkingId,
    completedStep,
  }
});

export const updateOperation = (updatedObject) => ({
  type: UPDATE_OPERATION,
  payload: updatedObject
});

export const cancelOperation = (objectWorkingId) => ({
  type: CANCEL_OPERATION,
  payload: { objectWorkingId }
});

export const backupObject = (objectWorkingId, objectToBackup) => ({
  type: BACKUP_OBJECT,
  payload: { objectWorkingId, objectToBackup }
});

function createOperation(operationType, objectWorkingId, objectData = {}) {
  const { backupObjectData, objectEditedData } = objectData;
  return {
    operationType,
    objectWorkingId,
    stepsQueue: JSON.parse(JSON.stringify(operationStepsMap[operationType])),
    loadedRows: 0,
    totalRows: 0,
    backupObjectData,
    objectEditedData,
  };
}
