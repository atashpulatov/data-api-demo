export const DEFAULT_RANGE_POSITION = { top: 0, left: 0 };
export const DEFAULT_CELL_POSITION = 'A1';
export const VISUALIZATION_TITLE_EXCLUDED_DEFAULT_CELL_POSITION = 'A3';

export enum ObjectImportType {
  TABLE = 'table',
  PIVOT_TABLE = 'pivot-table',
  FORMATTED_TABLE = 'formattedTable',
  IMAGE = 'image',
}

export const objectTableImportType = new Set([
  ObjectImportType.TABLE,
  ObjectImportType.PIVOT_TABLE,
  ObjectImportType.FORMATTED_TABLE
]);

export const excelApiSupportedObjectImportTypes = [
  ObjectImportType.IMAGE,
  ObjectImportType.FORMATTED_TABLE
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
