import i18n from '../../i18n';

const lang = i18n.language;
export const customT = (str) => (i18n.store.data[lang].common[str] ? i18n.store.data[lang].common[str] : str);

export const titleOperationInProgressMap = {
  PENDING_OPERATION: 'Pending',
  IMPORT_OPERATION: 'Importing',
  REFRESH_OPERATION: 'Refreshing',
  EDIT_OPERATION: 'Importing',
  REMOVE_OPERATION: 'Removing',
  DUPLICATE_OPERATION: 'Duplicating',
  CLEAR_DATA_OPERATION: 'Clearing',
};

export const titleOperationCompletedMap = {
  IMPORT_OPERATION: 'Import successful',
  REFRESH_OPERATION: 'Refresh complete',
  EDIT_OPERATION: 'Import successful',
  REMOVE_OPERATION: 'Object removed',
  DUPLICATE_OPERATION: 'Object duplicated',
  CLEAR_DATA_OPERATION: 'Object cleared',
};

export const titleOperationFailedMap = {
  IMPORT_OPERATION: 'Import failed',
  REFRESH_OPERATION: 'Refresh failed',
  EDIT_OPERATION: 'Import failed',
  REMOVE_OPERATION: 'Removal failed',
  DUPLICATE_OPERATION: 'Duplication failed',
  CLEAR_DATA_OPERATION: 'Clearing failed',
};
