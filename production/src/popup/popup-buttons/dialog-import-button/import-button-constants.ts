import { ObjectImportType } from '../../../mstr-object/constants';

export enum ImportActionTypes {
  IMPORT = 'Import',
  IMPORT_DATA = 'Import Data',
  IMPORT_DATA_WITH_FORMATTING = 'Import Data With Formatting',
  IMPORT_PIVOT_TABLE = 'Import Pivot Table',
  IMPORT_IMAGE = 'Import Visualization',
  APPLY = 'Apply',
}

export enum ImportButtonIds {
  IMPORT = 'import',
  IMPORT_DATA = 'import-data',
  IMPORT_DATA_WITH_FORMATTING = 'import-data-with-formatting',
  IMPORT_PIVOT_TABLE = 'import-pivot-table',
  IMPORT_IMAGE = 'import-image',
  RUN = 'run',
}

export const optionsDictionary = {
  [ObjectImportType.TABLE]: {
    value: 'Import Data',
    key: ObjectImportType.TABLE,
  },
  [ObjectImportType.FORMATTED_TABLE]: {
    value: 'Import as Data with formatting',
    key: ObjectImportType.FORMATTED_TABLE,
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
