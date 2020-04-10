import {
  IMPORT_OPERATION, REFRESH_OPERATION, EDIT_OPERATION, DUPLICATE_OPERATION
} from './operation-type-names';

const loadingStateEnumWeights = {
  [IMPORT_OPERATION]: {
    GET_INSTANCE_DEFINITION: 0,
    GET_OFFICE_TABLE_IMPORT: 5,
    FORMAT_DATA: 15,
    FETCH_INSERT_DATA: 20,
    FORMAT_OFFICE_TABLE: 25,
    FORMAT_SUBTOTALS: 30,
    BIND_OFFICE_TABLE: 35,
    SAVE_OBJECT_IN_EXCEL: 40,
  },
  [REFRESH_OPERATION]: {
    GET_INSTANCE_DEFINITION: 0,
    GET_OFFICE_TABLE_EDIT_REFRESH: 5,
    FORMAT_DATA: 15,
    FETCH_INSERT_DATA: 20,
    FORMAT_OFFICE_TABLE: 25,
    FORMAT_SUBTOTALS: 30,
    BIND_OFFICE_TABLE: 35,
    SAVE_OBJECT_IN_EXCEL: 40,
  },
  [EDIT_OPERATION]: {
    MODIFY_OBJECT: 0,
    GET_INSTANCE_DEFINITION: 5,
    GET_OFFICE_TABLE_EDIT_REFRESH: 10,
    FORMAT_DATA: 15,
    FETCH_INSERT_DATA: 20,
    FORMAT_OFFICE_TABLE: 25,
    FORMAT_SUBTOTALS: 30,
    BIND_OFFICE_TABLE: 35,
    SAVE_OBJECT_IN_EXCEL: 40,
  },
  [DUPLICATE_OPERATION]: {
    GET_DUPLICATE_NAME: 0,
    GET_INSTANCE_DEFINITION: 1,
    GET_OFFICE_TABLE_IMPORT: 5,
    FORMAT_DATA: 15,
    FETCH_INSERT_DATA: 20,
    FORMAT_OFFICE_TABLE: 25,
    FORMAT_SUBTOTALS: 30,
    BIND_OFFICE_TABLE: 35,
    SAVE_OBJECT_IN_EXCEL: 40,
  },
};

export const calculateLoadingProgress = (objectOperation) => {
  const {
    operationType, stepsQueue, loadedRows, totalRows
  } = objectOperation;
  const step = stepsQueue[0];
  const baseProgress = loadingStateEnumWeights[operationType][step];
  const fetchProgress = Math.round((6 / 10) * (loadedRows / totalRows) * 100);
  const loadingProgress = fetchProgress + baseProgress;
  return loadingProgress > 100 ? 100 : loadingProgress;
};
