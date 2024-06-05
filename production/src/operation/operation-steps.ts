import { OperationTypes } from './operation-type-names';
import { ObjectImportType } from '../mstr-object/constants';

export enum OperationSteps {
  MODIFY_OBJECT = 'MODIFY_OBJECT',
  BACKUP_OBJECT_DATA = 'BACKUP_OBJECT_DATA',
  REFRESH_STORED_OBJECT = 'REFRESH_STORED_OBJECT',
  GET_INSTANCE_DEFINITION = 'GET_INSTANCE_DEFINITION',
  GET_OBJECT_DETAILS = 'GET_OBJECT_DETAILS',
  GET_OFFICE_TABLE_IMPORT = 'GET_OFFICE_TABLE_IMPORT',
  GET_FORMATTED_DATA_TABLE_IMPORT = 'GET_FORMATTED_DATA_TABLE_IMPORT',

  GET_FORMATTED_DATA_TABLE_EDIT_REFRESH = 'GET_FORMATTED_DATA_TABLE_EDIT_REFRESH',
  GET_OFFICE_TABLE_EDIT_REFRESH = 'GET_OFFICE_TABLE_EDIT_REFRESH',
  FORMAT_DATA = 'FORMAT_DATA',
  FETCH_INSERT_DATA = 'FETCH_INSERT_DATA',
  FORMAT_OFFICE_TABLE = 'FORMAT_OFFICE_TABLE',
  FORMAT_SUBTOTALS = 'FORMAT_SUBTOTALS',
  BIND_OFFICE_TABLE = 'BIND_OFFICE_TABLE',
  SAVE_OBJECT_IN_EXCEL = 'SAVE_OBJECT_IN_EXCEL',
  GET_DUPLICATE_NAME = 'GET_DUPLICATE_NAME',
  RENAME_EXCEL_WORKSHEET = 'RENAME_EXCEL_WORKSHEET',
  GET_OBJECT_SETTINGS = 'GET_OBJECT_SETTINGS',
  FORMAT_HYPERLINKS = 'FORMAT_HYPERLINKS',

  REMOVE_OBJECT_BINDING = 'REMOVE_OBJECT_BINDING',
  REMOVE_OBJECT_TABLE = 'REMOVE_OBJECT_TABLE',
  REMOVE_OBJECT_DETAILS = 'REMOVE_OBJECT_DETAILS',
  HIGHLIGHT_OBJECT = 'HIGHLIGHT_OBJECT',
  CHECK_OBJECT_STATUS = 'CHECK_OBJECT_STATUS',
  CLEAR_CROSSTAB_HEADERS = 'CLEAR_CROSSTAB_HEADERS',
  CLEAR_TABLE_DATA = 'CLEAR_TABLE_DATA',
  COMPLETE_CLEAR_DATA = 'COMPLETE_CLEAR_DATA',
  MOVE_NOTIFICATION_TO_IN_PROGRESS = 'MOVE_NOTIFICATION_TO_IN_PROGRESS',
  DISPLAY_NOTIFICATION_COMPLETED = 'DISPLAY_NOTIFICATION_COMPLETED',
  // shape steps
  MANIPULATE_VISUALIZATION_IMAGE = 'MANIPULATE_VISUALIZATION_IMAGE',
  REMOVE_VISUALIZATION_IMAGE = 'REMOVE_VISUALIZATION_IMAGE',
  ADD_VISUALIZATION_PLACEHOLDER = 'ADD_VISUALIZATION_PLACEHOLDER',
  SAVE_IMAGE_DETAILS = 'SAVE_IMAGE_DETAILS',
  // pivot-table steps
  CREATE_PIVOT_TABLE = 'CREATE_PIVOT_TABLE',
  REMOVE_PIVOT_TABLE = 'REMOVE_PIVOT_TABLE',
  REFRESH_PIVOT_TABLE = 'REFRESH_PIVOT_TABLE',
  // formatted data(table) steps
  EXPORT_EXCEL_TO_CURRENT_WORKBOOK = 'EXPORT_EXCEL_TO_CURRENT_WORKBOOK',
  MOVE_FORMATTED_DATA_FROM_EXPORTED_TO_TARGET_WORKSHEET = 'MOVE_FORMATTED_DATA_FROM_EXPORTED_TO_TARGET_WORKSHEET',
}

const operationStepsMapTable = {
  [OperationTypes.IMPORT_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.GET_OBJECT_SETTINGS,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.GET_OFFICE_TABLE_IMPORT,
    OperationSteps.FORMAT_DATA,
    OperationSteps.FETCH_INSERT_DATA,
    OperationSteps.FORMAT_HYPERLINKS,
    OperationSteps.FORMAT_OFFICE_TABLE,
    OperationSteps.FORMAT_SUBTOTALS,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.RENAME_EXCEL_WORKSHEET,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.REFRESH_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.BACKUP_OBJECT_DATA,
    OperationSteps.GET_OBJECT_SETTINGS,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.REMOVE_OBJECT_DETAILS,
    OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH,
    OperationSteps.FORMAT_DATA,
    OperationSteps.FETCH_INSERT_DATA,
    OperationSteps.FORMAT_HYPERLINKS,
    OperationSteps.FORMAT_OFFICE_TABLE,
    OperationSteps.FORMAT_SUBTOTALS,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.EDIT_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.GET_OBJECT_SETTINGS,
    OperationSteps.MODIFY_OBJECT,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.REMOVE_OBJECT_DETAILS,
    OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH,
    OperationSteps.FORMAT_DATA,
    OperationSteps.FETCH_INSERT_DATA,
    OperationSteps.FORMAT_HYPERLINKS,
    OperationSteps.FORMAT_OFFICE_TABLE,
    OperationSteps.FORMAT_SUBTOTALS,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.DUPLICATE_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.GET_OBJECT_SETTINGS,
    OperationSteps.MODIFY_OBJECT,
    OperationSteps.GET_DUPLICATE_NAME,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.GET_OFFICE_TABLE_IMPORT,
    OperationSteps.FORMAT_DATA,
    OperationSteps.FETCH_INSERT_DATA,
    OperationSteps.FORMAT_HYPERLINKS,
    OperationSteps.FORMAT_OFFICE_TABLE,
    OperationSteps.FORMAT_SUBTOTALS,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.REMOVE_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.REMOVE_OBJECT_DETAILS,
    OperationSteps.REMOVE_OBJECT_TABLE,
    OperationSteps.REMOVE_OBJECT_BINDING,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.HIGHLIGHT_OPERATION]: [OperationSteps.HIGHLIGHT_OBJECT],

  [OperationTypes.CLEAR_DATA_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.CHECK_OBJECT_STATUS,
    OperationSteps.REMOVE_OBJECT_DETAILS,
    OperationSteps.CLEAR_CROSSTAB_HEADERS,
    OperationSteps.CLEAR_TABLE_DATA,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
    OperationSteps.COMPLETE_CLEAR_DATA,
  ],
};

const operationStepsMapFormattedTable = {
  [OperationTypes.IMPORT_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.EXPORT_EXCEL_TO_CURRENT_WORKBOOK,
    OperationSteps.GET_FORMATTED_DATA_TABLE_IMPORT,
    OperationSteps.MOVE_FORMATTED_DATA_FROM_EXPORTED_TO_TARGET_WORKSHEET,
    OperationSteps.FORMAT_OFFICE_TABLE,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.RENAME_EXCEL_WORKSHEET,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.REFRESH_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.BACKUP_OBJECT_DATA,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.EXPORT_EXCEL_TO_CURRENT_WORKBOOK,
    OperationSteps.GET_FORMATTED_DATA_TABLE_EDIT_REFRESH,
    OperationSteps.MOVE_FORMATTED_DATA_FROM_EXPORTED_TO_TARGET_WORKSHEET,
    OperationSteps.FORMAT_OFFICE_TABLE,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.EDIT_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.MODIFY_OBJECT,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.EXPORT_EXCEL_TO_CURRENT_WORKBOOK,
    OperationSteps.GET_FORMATTED_DATA_TABLE_EDIT_REFRESH,
    OperationSteps.MOVE_FORMATTED_DATA_FROM_EXPORTED_TO_TARGET_WORKSHEET,
    OperationSteps.FORMAT_OFFICE_TABLE,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.DUPLICATE_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.MODIFY_OBJECT,
    OperationSteps.GET_DUPLICATE_NAME,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.EXPORT_EXCEL_TO_CURRENT_WORKBOOK,
    OperationSteps.GET_FORMATTED_DATA_TABLE_IMPORT,
    OperationSteps.MOVE_FORMATTED_DATA_FROM_EXPORTED_TO_TARGET_WORKSHEET,
    OperationSteps.FORMAT_OFFICE_TABLE,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.REMOVE_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.REMOVE_OBJECT_TABLE,
    OperationSteps.REMOVE_OBJECT_BINDING,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.HIGHLIGHT_OPERATION]: [OperationSteps.HIGHLIGHT_OBJECT],

  [OperationTypes.CLEAR_DATA_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.CHECK_OBJECT_STATUS,
    OperationSteps.CLEAR_TABLE_DATA,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
    OperationSteps.COMPLETE_CLEAR_DATA,
  ],
};

const operationStepsMapImage = {
  [OperationTypes.IMPORT_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.MANIPULATE_VISUALIZATION_IMAGE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.REFRESH_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.BACKUP_OBJECT_DATA,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.MANIPULATE_VISUALIZATION_IMAGE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.EDIT_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.MODIFY_OBJECT,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.MANIPULATE_VISUALIZATION_IMAGE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.DUPLICATE_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.MODIFY_OBJECT,
    OperationSteps.GET_DUPLICATE_NAME,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.MANIPULATE_VISUALIZATION_IMAGE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.REMOVE_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.REMOVE_VISUALIZATION_IMAGE,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.CLEAR_DATA_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.SAVE_IMAGE_DETAILS,
    OperationSteps.REMOVE_VISUALIZATION_IMAGE,
    OperationSteps.ADD_VISUALIZATION_PLACEHOLDER,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
    OperationSteps.COMPLETE_CLEAR_DATA,
  ],

  [OperationTypes.HIGHLIGHT_OPERATION]: [OperationSteps.HIGHLIGHT_OBJECT],
};

const operationStepsMapPivotTable = {
  [OperationTypes.IMPORT_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.GET_OBJECT_SETTINGS,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.GET_OFFICE_TABLE_IMPORT,
    OperationSteps.FETCH_INSERT_DATA,
    OperationSteps.CREATE_PIVOT_TABLE,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.REFRESH_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.BACKUP_OBJECT_DATA,
    OperationSteps.GET_OBJECT_SETTINGS,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH,
    OperationSteps.FETCH_INSERT_DATA,
    OperationSteps.REFRESH_PIVOT_TABLE,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.EDIT_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.MODIFY_OBJECT,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH,
    OperationSteps.FETCH_INSERT_DATA,
    OperationSteps.REFRESH_PIVOT_TABLE,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.DUPLICATE_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.GET_OBJECT_SETTINGS,
    OperationSteps.MODIFY_OBJECT,
    OperationSteps.GET_DUPLICATE_NAME,
    OperationSteps.GET_INSTANCE_DEFINITION,
    OperationSteps.GET_OBJECT_DETAILS,
    OperationSteps.GET_OFFICE_TABLE_IMPORT,
    OperationSteps.FETCH_INSERT_DATA,
    OperationSteps.CREATE_PIVOT_TABLE,
    OperationSteps.BIND_OFFICE_TABLE,
    OperationSteps.SAVE_OBJECT_IN_EXCEL,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.REMOVE_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.REMOVE_OBJECT_TABLE,
    OperationSteps.REMOVE_OBJECT_BINDING,
    OperationSteps.REMOVE_PIVOT_TABLE,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
  ],

  [OperationTypes.HIGHLIGHT_OPERATION]: [OperationSteps.HIGHLIGHT_OBJECT],

  [OperationTypes.CLEAR_DATA_OPERATION]: [
    OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
    OperationSteps.CHECK_OBJECT_STATUS,
    OperationSteps.CLEAR_CROSSTAB_HEADERS,
    OperationSteps.CLEAR_TABLE_DATA,
    OperationSteps.REFRESH_PIVOT_TABLE,
    OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
    OperationSteps.COMPLETE_CLEAR_DATA,
  ],
};

export const operationsMap = {
  [ObjectImportType.TABLE]: operationStepsMapTable,
  [ObjectImportType.PIVOT_TABLE]: operationStepsMapPivotTable,
  [ObjectImportType.FORMATTED_DATA]: operationStepsMapFormattedTable,
  [ObjectImportType.IMAGE]: operationStepsMapImage,
};
