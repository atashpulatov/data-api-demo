const defaultImagerangePos = { top: 0, left: 0 };
const defaultTableRangePos = 'A1';

export const objectImportType = {
  TABLE: 'table',
  IMAGE: 'image',
};

export const importOperationStepDict = {
  GET_OFFICE_TABLE_IMPORT: objectImportType.IMAGE,
  MANIPULATE_VISUALIZATION_IMAGE: objectImportType.IMAGE,
};

export const defaultRangePosition = {
    [objectImportType.IMAGE]: defaultImagerangePos,
    [objectImportType.TABLE]: defaultTableRangePos
  };
