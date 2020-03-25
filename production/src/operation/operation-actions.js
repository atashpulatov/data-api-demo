import {
  operationStepsMap,
  IMPORT_OPERATION,
  EDIT_OPERATION,
  REFRESH_OPERATION,
} from './operation-steps';

export const IMPORT_REQUESTED = 'IMPORT_REQUESTED';
export const EDIT_REQUESTED = 'EDIT_REQUESTED';
export const REFRESH_REQUESTED = 'REFRESH_REQUESTED';

export const MARK_STEP_COMPLETED = 'MARK_STEP_COMPLETED';
export const UPDATE_OPERATION = 'UPDATE_OPERATION';
export const CANCEL_OPERATION = 'CANCEL_OPERATION';
export const BACKUP_OBJECT = 'BACKUP_OBJECT';
export const SET_TOTAL_ROWS = 'SET_TOTAL_ROWS';
export const SET_LOADED_ROWS = 'SET_LOADED_ROWS';

// TODO check if needed to map
const operationTypes = {
  IMPORT_REQUESTED: IMPORT_OPERATION,
  EDIT_REQUESTED: EDIT_OPERATION,
  REFRESH_REQUESTED: REFRESH_OPERATION,
};

export const importRequested = (object) => {
  const objectWorkingId = Date.now();
  object.objectWorkingId = objectWorkingId;
  return {
    type: IMPORT_REQUESTED,
    payload: {
      operation: createOperation(IMPORT_REQUESTED, objectWorkingId),
      object,
    },
  };
};

export const refreshRequested = (objectData) => {
  const backupObjectData = JSON.parse(JSON.stringify(objectData));
  const { objectWorkingId } = backupObjectData;
  return {
    type: REFRESH_REQUESTED,
    payload: {
      operation: createOperation(REFRESH_REQUESTED, objectWorkingId),
      objectWorkingId,
      backupObjectData: objectData
    },
  };
};

export const editRequested = (objectData, objectEditedData) => {
  const backupObjectData = JSON.parse(JSON.stringify(objectData));
  const { objectWorkingId } = backupObjectData;
  return {
    type: EDIT_REQUESTED,
    payload: {
      operation: createOperation(EDIT_REQUESTED, objectWorkingId, { backupObjectData, objectEditedData }),
      objectWorkingId,
    },
  };
};

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

function createOperation(operationRequest, objectWorkingId, objectData = {}) {
  const { backupObjectData, objectEditedData } = objectData;
  const operationType = operationTypes[operationRequest];
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
