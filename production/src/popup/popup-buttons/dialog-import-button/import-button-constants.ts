import { ObjectImportType } from '../../../mstr-object/constants';

export enum ImportActionTypes {
  IMPORT = 'Import',
  IMPORT_DATA = 'Import Data',
  IMPORT_PIVOT_TABLE = 'Import Pivot Table',
  IMPORT_IMAGE = 'Import Visualization',
  APPLY = 'Apply',
}

export enum ImportButtonIds {
  IMPORT = 'import',
  IMPORT_DATA = 'import-data',
  IMPORT_PIVOT_TABLE = 'import-pivot-table',
  IMPORT_IMAGE = 'import-image',
  RUN = 'run',
}

export const optionsDictionary = {
  [ObjectImportType.TABLE]: {
    value: 'Import Data',
    key: ObjectImportType.TABLE,
  },
  [ObjectImportType.IMAGE]: {
    value: 'Import Visualization',
    key: ObjectImportType.IMAGE,
  },
  [ObjectImportType.PIVOT_TABLE]: {
    value: 'Import Pivot Table',
    key: ObjectImportType.PIVOT_TABLE,
  },
};