import i18n from '../../i18n';

const lang = i18n.language;
export const customT = (str) => (i18n.store.data[lang].common[str]
  ? i18n.store.data[lang].common[str]
  : str);

export const titleOperationInProgressMap = {
  PENDING_OPERATION: customT('Pending'),
  IMPORT_OPERATION: customT('Importing'),
  REFRESH_OPERATION: customT('Refreshing'),
  EDIT_OPERATION: customT('Importing'),
  REMOVE_OPERATION: customT('Removing'),
  DUPLICATE_OPERATION: customT('Duplicating'),
  CLEAR_DATA_OPERATION: customT('Clearing'),
};

export const titleOperationCompletedMap = {
  IMPORT_OPERATION: customT('Import successful'),
  REFRESH_OPERATION: customT('Refresh complete'),
  EDIT_OPERATION: customT('Import successful'),
  REMOVE_OPERATION: customT('Object removed'),
  DUPLICATE_OPERATION: customT('Object duplicated'),
  CLEAR_DATA_OPERATION: customT('Object cleared'),
};

export const titleOperationFailedMap = {
  IMPORT_OPERATION: customT('Import failed'),
  REFRESH_OPERATION: customT('Refresh failed'),
  EDIT_OPERATION: customT('Import failed'),
  REMOVE_OPERATION: customT('Removal failed'),
  DUPLICATE_OPERATION: customT('Duplication failed'),
  CLEAR_DATA_OPERATION: customT('Clearing failed'),
};
