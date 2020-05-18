import {
  IMPORT_OPERATION,
  EDIT_OPERATION,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
  HIGHLIGHT_OPERATION,
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

export const HIGHLIGHT_OBJECT = 'HIGHLIGHT_OBJECT';

export const CHECK_OBJECT_STATUS = 'CHECK_OBJECT_STATUS';
export const CLEAR_CROSSTAB_HEADERS = 'CLEAR_CROSSTAB_HEADERS';
export const CLEAR_TABLE_DATA = 'CLEAR_TABLE_DATA';
export const COMPLETE_CLEAR_DATA = 'COMPLETE_CLEAR_DATA';

export const MOVE_NOTIFICATION_TO_IN_PROGRESS = 'MOVE_NOTIFICATION_TO_IN_PROGRESS';
export const DISPLAY_NOTIFICATION_COMPLETED = 'DISPLAY_NOTIFICATION_COMPLETED';

export const operationStepsMap = {
  [IMPORT_OPERATION]: [
    MOVE_NOTIFICATION_TO_IN_PROGRESS,
    GET_INSTANCE_DEFINITION,
    GET_OFFICE_TABLE_IMPORT,
    FETCH_INSERT_DATA,
    FORMAT_DATA,
    FORMAT_OFFICE_TABLE,
    FORMAT_SUBTOTALS,
    BIND_OFFICE_TABLE,
    SAVE_OBJECT_IN_EXCEL,
    DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [REFRESH_OPERATION]: [
    MOVE_NOTIFICATION_TO_IN_PROGRESS,
    BACKUP_OBJECT_DATA,
    GET_INSTANCE_DEFINITION,
    GET_OFFICE_TABLE_EDIT_REFRESH,
    FETCH_INSERT_DATA,
    FORMAT_DATA,
    FORMAT_OFFICE_TABLE,
    FORMAT_SUBTOTALS,
    BIND_OFFICE_TABLE,
    SAVE_OBJECT_IN_EXCEL,
    DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [EDIT_OPERATION]: [
    MOVE_NOTIFICATION_TO_IN_PROGRESS,
    MODIFY_OBJECT,
    GET_INSTANCE_DEFINITION,
    GET_OFFICE_TABLE_EDIT_REFRESH,
    FETCH_INSERT_DATA,
    FORMAT_DATA,
    FORMAT_OFFICE_TABLE,
    FORMAT_SUBTOTALS,
    BIND_OFFICE_TABLE,
    SAVE_OBJECT_IN_EXCEL,
    DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [DUPLICATE_OPERATION]: [
    MOVE_NOTIFICATION_TO_IN_PROGRESS,
    MODIFY_OBJECT,
    GET_DUPLICATE_NAME,
    GET_INSTANCE_DEFINITION,
    GET_OFFICE_TABLE_IMPORT,
    FETCH_INSERT_DATA,
    FORMAT_DATA,
    FORMAT_OFFICE_TABLE,
    FORMAT_SUBTOTALS,
    BIND_OFFICE_TABLE,
    SAVE_OBJECT_IN_EXCEL,
    DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [REMOVE_OPERATION]: [
    MOVE_NOTIFICATION_TO_IN_PROGRESS,
    REMOVE_OBJECT_TABLE,
    REMOVE_OBJECT_BINDING,
    DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [HIGHLIGHT_OPERATION]: [
    HIGHLIGHT_OBJECT,
  ],

  [CLEAR_DATA_OPERATION]: [
    MOVE_NOTIFICATION_TO_IN_PROGRESS,
    CHECK_OBJECT_STATUS,
    CLEAR_CROSSTAB_HEADERS,
    CLEAR_TABLE_DATA,
    DISPLAY_NOTIFICATION_COMPLETED,
    COMPLETE_CLEAR_DATA,
  ],
};
