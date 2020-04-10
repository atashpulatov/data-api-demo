import i18n from '../../i18n';

const lang = i18n.language;
const t = (str) => (i18n.store.data[lang].common[str]
  ? i18n.store.data[lang].common[str]
  : str);

export const titleOperationInProgressMap = {
  PENDING_OPERATION: t('Pending'),
  IMPORT_OPERATION: t('Importing'),
  REFRESH_OPERATION: t('Refreshing'),
  EDIT_OPERATION: t('Importing'),
  REMOVE_OPERATION: t('Removing'),
  DUPLICATE_OPERATION: t('Duplicating'),
  CLEAR_DATA_OPERATION: t('Clearing'),
};

export const titleOperationCompletedMap = {
  IMPORT_OPERATION: t('Import successful'),
  REFRESH_OPERATION: t('Refresh complete'),
  EDIT_OPERATION: t('Import successful'),
  REMOVE_OPERATION: t('Object removed'),
  DUPLICATE_OPERATION: t('Object duplicated'),
  CLEAR_DATA_OPERATION: t('Object cleared'),
};

export const titleOperationFailedMap = {
  IMPORT_OPERATION: t('Import failed'),
  REFRESH_OPERATION: t('Refresh failed'),
  EDIT_OPERATION: t('Import failed'),
  REMOVE_OPERATION: t('Removal failed'),
  DUPLICATE_OPERATION: t('Duplication failed'),
  CLEAR_DATA_OPERATION: t('Clearing failed'),
};
