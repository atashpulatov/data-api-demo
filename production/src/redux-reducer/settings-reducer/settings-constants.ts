import i18n from '../../i18n';

const { t } = i18n;

// TODO Add translations
export const initialSidePanelObjectInfoSettings = [
  { key: 'importedBy', item: t('Imported By'), showToggle: true, toggleChecked: true },
  { key: 'owner', item: t('Owner'), showToggle: true, toggleChecked: true },
  { key: 'dateModified', item: t('Date Modified'), showToggle: true, toggleChecked: true },
  { key: 'dateCreated', item: t('Date Created'), showToggle: true, toggleChecked: false },
  { key: 'description', item: t('Description'), showToggle: true, toggleChecked: false },
  { key: 'location', item: t('Location'), showToggle: true, toggleChecked: true },
  { key: 'version', item: t('Version'), showToggle: true, toggleChecked: false },
  { key: 'id', item: t('ID'), showToggle: true, toggleChecked: true },
];

export const initialWorksheetObjectInfoSettings = [
  { key: 'name', item: t('Name'), showToggle: true, toggleChecked: false },
  { key: 'owner', item: t('Owner'), showToggle: true, toggleChecked: false },
  { key: 'description', item: t('Description'), showToggle: true, toggleChecked: false },
  { key: 'filter', item: t('Filter'), showToggle: true, toggleChecked: false },
  { key: 'importedBy', item: t('Imported By'), showToggle: true, toggleChecked: false },
  { key: 'dateModified', item: t('Date Modified'), showToggle: true, toggleChecked: false },
  { key: 'dateCreated', item: t('Date Created'), showToggle: true, toggleChecked: false },
  { key: 'id', item: t('ID'), showToggle: true, toggleChecked: false },
  { key: 'pageBy', item: t('Page-By Information'), showToggle: true, toggleChecked: false },
];
