export const DEFAULT_RANGE_POSITION = { top: 0, left: 0 };
export const DEFAULT_CELL_POSITION = 'A1';
export const TITLE_EXCLUDED_DEFAULT_START_CELL_POSITION = 'A3';

// Extra row used to append/remove from excel table range
export const OFFICE_TABLE_EXTA_ROW = 1;

// Rows offset used to exclude dossier/report title from the table range of exported worksheet
export const TITLE_EXCLUDED_ROW_OFFSET = 2;

export enum ObjectImportType {
  TABLE = 'table',
  PIVOT_TABLE = 'pivot-table',
  FORMATTED_DATA = 'formatted-data',
  IMAGE = 'image',
}

export const objectImportTypeDictionary = {
  [ObjectImportType.TABLE]: 'table',
  [ObjectImportType.PIVOT_TABLE]: 'pivot table',
  [ObjectImportType.FORMATTED_DATA]: 'formatted data',
  [ObjectImportType.IMAGE]: 'image'
}

export const objectTableImportType = new Set([
  ObjectImportType.TABLE,
  ObjectImportType.PIVOT_TABLE,
  ObjectImportType.FORMATTED_DATA
]);

// Excludable object import types based on corresponding excel api support
export const excludableObjectImportTypes = [
  ObjectImportType.IMAGE,
  ObjectImportType.PIVOT_TABLE,
  ObjectImportType.FORMATTED_DATA
]

export enum ImportOperationStepDict {
  GET_OFFICE_TABLE_IMPORT = ObjectImportType.TABLE,
  MANIPULATE_VISUALIZATION_IMAGE = ObjectImportType.IMAGE,
}

export enum DisplayAttrFormNames {
  AUTOMATIC = 'AUTOMATIC',
  SHOW_ATTR_NAME_ONCE = 'SHOW_ATTR_NAME_ONCE',
  FORM_NAME_ONLY = 'FORM_NAME_ONLY',
  ON = 'ON',
  OFF = 'OFF',
}

export const displayAttrFormNamesOptions = [
  {
    value: 'AUTOMATIC',
    displayName: 'Automatic',
  },
  {
    value: 'SHOW_ATTR_NAME_ONCE',
    displayName: 'Show attribute name once',
  },
  {
    value: 'FORM_NAME_ONLY',
    displayName: 'Form name only',
  },
  {
    value: 'ON',
    displayName: 'On',
  },
  {
    value: 'OFF',
    displayName: 'Off',
  },
];

export enum ChapterNamePosition {
  BEFORE_PAGE_NAME = 'beforePageName',
  TOP_OF_SHEET = 'topOfSheet',
}

export enum ContentPositioning {
  STACKED = 'vertically',
  SIDE_BY_SIDE = 'horizontally',
}
