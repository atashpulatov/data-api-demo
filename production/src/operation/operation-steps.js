import {
  IMPORT_OPERATION,
  EDIT_OPERATION,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
} from './operation-type-names';

export const MODIFY_OBJECT = 'MODIFY_OBJECT';
export const BACKUP_OBJECT_DATA = 'BACKUP_OBJECT_DATA';
export const REFRESH_STORED_OBJECT = 'REFRESH_STORED_OBJECT';
export const GET_INSTANCE_DEFINITION = 'GET_INSTANCE_DEFINITION';
export const GET_OFFICE_TABLE_IMPORT = 'GET_OFFICE_TABLE_IMPORT';
export const GET_OFFICE_TABLE_EDIT_REFRESH = 'GET_OFFICE_TABLE_EDIT_REFRESH';
export const FORMAT_DATA = 'FORMAT_DATA';
export const FETCH_INSERT_DATA = 'FETCH_INSERT_DATA';
export const FORMAT_OFFICE_TABLE = 'FORMAT_OFFICE_TABLE';
export const FORMAT_SUBTOTALS = 'FORMAT_SUBTOTALS';
export const BIND_OFFICE_TABLE = 'BIND_OFFICE_TABLE';
export const SAVE_OBJECT_IN_EXCEL = 'SAVE_OBJECT_IN_EXCEL';
export const GET_DUPLICATE_NAME = 'GET_DUPLICATE_NAME';

export const REMOVE_OBJECT_BINDING = 'REMOVE_OBJECT_BINDING';
export const REMOVE_OBJECT_TABLE = 'REMOVE_OBJECT_TABLE';
export const REMOVE_OBJECT_STORE = 'REMOVE_OBJECT_STORE';

export const CHECK_OBJECT_STATUS = 'CHECK_OBJECT_STATUS';
export const CLEAR_CROSSTAB_HEADERS = 'CLEAR_CROSSTAB_HEADERS';
export const CLEAR_TABLE_DATA = 'CLEAR_TABLE_DATA';

export const operationStepsMap = {
  [IMPORT_OPERATION]: [
    GET_INSTANCE_DEFINITION,
    GET_OFFICE_TABLE_IMPORT,
    FORMAT_DATA,
    FETCH_INSERT_DATA,
    FORMAT_OFFICE_TABLE,
    FORMAT_SUBTOTALS,
    BIND_OFFICE_TABLE,
    SAVE_OBJECT_IN_EXCEL,
  ],

  [REFRESH_OPERATION]: [
    BACKUP_OBJECT_DATA,
    GET_INSTANCE_DEFINITION,
    GET_OFFICE_TABLE_EDIT_REFRESH,
    FORMAT_DATA,
    FETCH_INSERT_DATA,
    FORMAT_OFFICE_TABLE,
    FORMAT_SUBTOTALS,
    BIND_OFFICE_TABLE,
    SAVE_OBJECT_IN_EXCEL,
  ],

  [EDIT_OPERATION]: [
    MODIFY_OBJECT,
    GET_INSTANCE_DEFINITION,
    GET_OFFICE_TABLE_EDIT_REFRESH,
    FORMAT_DATA,
    FETCH_INSERT_DATA,
    FORMAT_OFFICE_TABLE,
    FORMAT_SUBTOTALS,
    BIND_OFFICE_TABLE,
    SAVE_OBJECT_IN_EXCEL,
  ],

  [DUPLICATE_OPERATION]: [
    GET_DUPLICATE_NAME,
    GET_INSTANCE_DEFINITION,
    GET_OFFICE_TABLE_IMPORT,
    FORMAT_DATA,
    FETCH_INSERT_DATA,
    FORMAT_OFFICE_TABLE,
    FORMAT_SUBTOTALS,
    BIND_OFFICE_TABLE,
    SAVE_OBJECT_IN_EXCEL,
  ],

  [REMOVE_OPERATION]: [
    REMOVE_OBJECT_TABLE,
    REMOVE_OBJECT_BINDING,
    REMOVE_OBJECT_STORE,
  ],

  [CLEAR_DATA_OPERATION]: [
    CHECK_OBJECT_STATUS,
    CLEAR_CROSSTAB_HEADERS,
    CLEAR_TABLE_DATA,
  ],
};

// TODO: might need to move it somewhere else
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
  [REFRESH_OPERATION]: { // TODO
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
    GET_INSTANCE_DEFINITION: 5,
    GET_OFFICE_TABLE_IMPORT: 10,
    FORMAT_DATA: 15,
    FETCH_INSERT_DATA: 20,
    FORMAT_OFFICE_TABLE: 25,
    FORMAT_SUBTOTALS: 30,
    BIND_OFFICE_TABLE: 35,
    SAVE_OBJECT_IN_EXCEL: 40,
  }
};

export const calculateLoadingProgress = (operationType, step, loadedRows, totalRows) => {
  const baseProgress = loadingStateEnumWeights[step][operationType];
  const fetchProgress = Math.round((6 / 10) * (loadedRows / totalRows) * 100);
  const loadingProgress = fetchProgress + baseProgress;
  return loadingProgress > 100 ? 100 : loadingProgress;
};
