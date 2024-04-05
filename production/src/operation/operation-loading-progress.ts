import { OperationTypes } from './operation-type-names';
import { ObjectImportType } from '../mstr-object/constants';

const loadingStateEnumWeights = {
  [ObjectImportType.TABLE]: {
    [OperationTypes.IMPORT_OPERATION]: {
      GET_INSTANCE_DEFINITION: 5,
      GET_OBJECT_DETAILS: 10,
      GET_OFFICE_TABLE_IMPORT: 15,
      FETCH_INSERT_DATA: 20,
      FORMAT_DATA: 20,
      FORMAT_OFFICE_TABLE: 25,
      FORMAT_SUBTOTALS: 35,
      RENAME_EXCEL_WORKSHEET: 40,
      BIND_OFFICE_TABLE: 40,
      SAVE_OBJECT_IN_EXCEL: 40,
      DISPLAY_NOTIFICATION_COMPLETED: 40,
    },
    [OperationTypes.REFRESH_OPERATION]: {
      GET_INSTANCE_DEFINITION: 5,
      GET_OBJECT_DETAILS: 10,
      GET_OFFICE_TABLE_EDIT_REFRESH: 15,
      FETCH_INSERT_DATA: 20,
      FORMAT_DATA: 20,
      FORMAT_OFFICE_TABLE: 25,
      FORMAT_SUBTOTALS: 35,
      BIND_OFFICE_TABLE: 40,
      SAVE_OBJECT_IN_EXCEL: 40,
      DISPLAY_NOTIFICATION_COMPLETED: 40,
    },
    [OperationTypes.EDIT_OPERATION]: {
      MODIFY_OBJECT: 0,
      GET_INSTANCE_DEFINITION: 5,
      GET_OBJECT_DETAILS: 10,
      GET_OFFICE_TABLE_EDIT_REFRESH: 15,
      FETCH_INSERT_DATA: 20,
      FORMAT_DATA: 20,
      FORMAT_OFFICE_TABLE: 25,
      FORMAT_SUBTOTALS: 35,
      BIND_OFFICE_TABLE: 40,
      SAVE_OBJECT_IN_EXCEL: 40,
      DISPLAY_NOTIFICATION_COMPLETED: 40,
    },
    [OperationTypes.DUPLICATE_OPERATION]: {
      MODIFY_OBJECT: 0,
      GET_DUPLICATE_NAME: 3,
      GET_INSTANCE_DEFINITION: 5,
      GET_OBJECT_DETAILS: 10,
      GET_OFFICE_TABLE_IMPORT: 15,
      FETCH_INSERT_DATA: 20,
      FORMAT_DATA: 20,
      FORMAT_OFFICE_TABLE: 25,
      FORMAT_SUBTOTALS: 35,
      BIND_OFFICE_TABLE: 40,
      SAVE_OBJECT_IN_EXCEL: 40,
      DISPLAY_NOTIFICATION_COMPLETED: 40,
    },
  },
  [ObjectImportType.IMAGE]: {
    [OperationTypes.IMPORT_OPERATION]: {
      GET_INSTANCE_DEFINITION: 5,
      GET_OBJECT_DETAILS: 10,
      GET_OFFICE_TABLE_IMPORT: 15,
      MANIPULATE_VISUALIZATION_IMAGE: 40,
      SAVE_OBJECT_IN_EXCEL: 85,
      DISPLAY_NOTIFICATION_COMPLETED: 100,
    },
    [OperationTypes.REFRESH_OPERATION]: {
      BACKUP_OBJECT_DATA: 5,
      GET_INSTANCE_DEFINITION: 15,
      GET_OBJECT_DETAILS: 30,
      MANIPULATE_VISUALIZATION_IMAGE: 40,
      SAVE_OBJECT_IN_EXCEL: 90,
      DISPLAY_NOTIFICATION_COMPLETED: 100,
    },
    [OperationTypes.EDIT_OPERATION]: {
      MODIFY_OBJECT: 10,
      GET_INSTANCE_DEFINITION: 25,
      GET_OBJECT_DETAILS: 35,
      MANIPULATE_VISUALIZATION_IMAGE: 40,
      SAVE_OBJECT_IN_EXCEL: 90,
      DISPLAY_NOTIFICATION_COMPLETED: 100,
    },
    [OperationTypes.DUPLICATE_OPERATION]: {
      MODIFY_OBJECT: 10,
      GET_DUPLICATE_NAME: 20,
      GET_INSTANCE_DEFINITION: 25,
      GET_OBJECT_DETAILS: 40,
      MANIPULATE_VISUALIZATION_IMAGE: 50,
      SAVE_OBJECT_IN_EXCEL: 90,
      DISPLAY_NOTIFICATION_COMPLETED: 100,
    },
  },
};

export const calculateLoadingProgress = (
  objectOperation: any,
  importType = ObjectImportType.TABLE
): number => {
  const { operationType, stepsQueue, loadedRows, totalRows } = objectOperation;

  const step = stepsQueue[0];

  // return the base progress directly for image imports
  if (importType === ObjectImportType.IMAGE && step) {
    // @ts-expect-error
    return loadingStateEnumWeights[importType][operationType as OperationTypes][step];
  }

  // @ts-expect-error
  const baseProgress = loadingStateEnumWeights[importType][operationType][step];
  const fetchProgress = Math.round((6 / 10) * (loadedRows / totalRows) * 100);
  const loadingProgress = fetchProgress + baseProgress;
  return loadingProgress > 100 ? 100 : loadingProgress;
};