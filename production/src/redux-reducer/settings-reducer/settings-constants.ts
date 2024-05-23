import i18n from '../../i18n';

const { t } = i18n;

export const initialSidePanelObjectInfoSettings = [
  { key: 'importedBy', item: t('Imported By'), showToggle: true, toggleChecked: true },
  { key: 'owner', item: t('Owner'), showToggle: true, toggleChecked: true },
  { key: 'modifiedDate', item: t('Date Modified'), showToggle: true, toggleChecked: true },
  { key: 'createdDate', item: t('Date Created'), showToggle: true, toggleChecked: false },
  { key: 'description', item: t('Description'), showToggle: true, toggleChecked: false },
  { key: 'ancestors', item: t('Location'), showToggle: true, toggleChecked: true },
  { key: 'version', item: t('Version'), showToggle: true, toggleChecked: false },
  { key: 'id', item: t('ID'), showToggle: true, toggleChecked: true },
];

export const initialWorksheetObjectInfoSettings = [
  { key: 'name', item: t('Name'), showToggle: true, toggleChecked: false },
  { key: 'owner', item: t('Owner'), showToggle: true, toggleChecked: false },
  { key: 'description', item: t('Description'), showToggle: true, toggleChecked: false },
  { key: 'filters', item: t('Filter'), showToggle: true, toggleChecked: false },
  { key: 'importedBy', item: t('Imported By'), showToggle: true, toggleChecked: false },
  { key: 'modifiedDate', item: t('Date Modified'), showToggle: true, toggleChecked: false },
  { key: 'createdDate', item: t('Date Created'), showToggle: true, toggleChecked: false },
  { key: 'id', item: t('ID'), showToggle: true, toggleChecked: false },
  { key: 'pageBy', item: t('Page-By Information'), showToggle: true, toggleChecked: false },
];
