import {
  IMPORT_OPERATION, REFRESH_OPERATION, EDIT_OPERATION, DUPLICATE_OPERATION
} from './operation-type-names';
import { objectImportType } from '../mstr-object/constants';

const loadingStateEnumWeights = {
  [objectImportType.TABLE]: {
    [IMPORT_OPERATION]: {
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
    [REFRESH_OPERATION]: {
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
    [EDIT_OPERATION]: {
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
    [DUPLICATE_OPERATION]: {
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
  [objectImportType.IMAGE]: {
    [IMPORT_OPERATION]: {
      GET_INSTANCE_DEFINITION: 5,
      GET_OBJECT_DETAILS: 10,
      GET_OFFICE_TABLE_IMPORT: 15,
      REFRESH_VISUALIZATION_IMAGE: 40,
      SAVE_OBJECT_IN_EXCEL: 85,
      DISPLAY_NOTIFICATION_COMPLETED: 100,
    }
  }
};

export const calculateLoadingProgress = (objectOperation, importType = objectImportType.TABLE) => {
  const {
    operationType, stepsQueue, loadedRows, totalRows
  } = objectOperation;

  const step = stepsQueue[0];

  // return the base progress directly for image imports
  if (importType === objectImportType.IMAGE && step) {
    return loadingStateEnumWeights[importType][operationType][step];
  }

  const baseProgress = loadingStateEnumWeights[importType][operationType][step];
  const fetchProgress = Math.round((6 / 10) * (loadedRows / totalRows) * 100);
  const loadingProgress = fetchProgress + baseProgress;
  return loadingProgress > 100 ? 100 : loadingProgress;
};
