export const DEFAULT_RANGE_POSITION = { top: 0, left: 0 };
export const DEFAULT_CELL_POSITION = 'A1';

export enum ObjectImportType {
  TABLE = 'table',
  IMAGE = 'image',
}

export enum ImportOperationStepDict {
  GET_OFFICE_TABLE_IMPORT = ObjectImportType.IMAGE,
  MANIPULATE_VISUALIZATION_IMAGE = ObjectImportType.IMAGE,
}
