import i18n from '../../../i18n';
import { ObjectImportType } from '../../../mstr-object/constants';

export enum ImportActionTypes {
  IMPORT = 'Import',
  IMPORT_DATA = 'Import Data',
  IMPORT_FORMATTED_DATA = 'Import Formatted Data',
  IMPORT_PIVOT_TABLE = 'Import Pivot Table',
  IMPORT_IMAGE = 'Import Visualization',
  APPLY = 'Apply',
}

export enum ImportButtonIds {
  IMPORT = 'import',
  IMPORT_DATA = 'import-data',
  IMPORT_FORMATTED_DATA = 'import-formatted-data',
  IMPORT_PIVOT_TABLE = 'import-pivot-table',
  IMPORT_IMAGE = 'import-image',
  RUN = 'run',
}

export const optionsDictionary = {
  [ObjectImportType.TABLE]: {
    value: i18n.t(ImportActionTypes.IMPORT_DATA),
    key: ObjectImportType.TABLE,
  },
  [ObjectImportType.FORMATTED_DATA]: {
    value: i18n.t(ImportActionTypes.IMPORT_FORMATTED_DATA),
    key: ObjectImportType.FORMATTED_DATA,
  },
  [ObjectImportType.IMAGE]: {
    value: i18n.t(ImportActionTypes.IMPORT_IMAGE),
    key: ObjectImportType.IMAGE,
  },
  [ObjectImportType.PIVOT_TABLE]: {
    value: i18n.t(ImportActionTypes.IMPORT_PIVOT_TABLE),
    key: ObjectImportType.PIVOT_TABLE,
  },
};
