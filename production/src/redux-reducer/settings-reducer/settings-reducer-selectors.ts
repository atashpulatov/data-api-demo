import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { SettingsState } from './settings-reducer-types';

const getSettingsState = (state: RootState): SettingsState => state.settingsReducer;

const selectSidePanelObjectInfoSettings = createSelector(
  [getSettingsState],
  settingsState => settingsState.sidePanelObjectInfoSettings
);

const selectSidePanelMainSwitchValue = createSelector([getSettingsState], settingsState =>
  settingsState.sidePanelObjectInfoSettings.some(setting => setting.toggleChecked)
);

const selectWorksheetObjectInfoSettings = createSelector(
  [getSettingsState],
  settingsState => settingsState.worksheetObjectInfoSettings
);

const selectWorksheetMainSwitchValue = createSelector([getSettingsState], settingsState =>
  settingsState.worksheetObjectInfoSettings.some(setting => setting.toggleChecked)
);

const selectImportType = createSelector(
  [getSettingsState],
  settingsState => settingsState.importType
);

const selectObjectAndWorksheetNamingSetting = createSelector(
  [getSettingsState],
  settingsState => settingsState.objectAndWorksheetNamingSetting
);

const selectPageByDisplaySetting = createSelector(
  [getSettingsState],
  settingsState => settingsState.pageByDisplaySetting
);

const selectImportAttributesAsText = createSelector(
  [getSettingsState],
  settingsState => settingsState.importAttributesAsText
);

const selectMergeCrosstabColumns = createSelector(
  [getSettingsState],
  settingsState => settingsState.mergeCrosstabColumns
);

export const settingsReducerSelectors = {
  selectSidePanelObjectInfoSettings,
  selectSidePanelMainSwitchValue,
  selectWorksheetObjectInfoSettings,
  selectWorksheetMainSwitchValue,
  selectImportType,
  selectObjectAndWorksheetNamingSetting,
  selectPageByDisplaySetting,
  selectImportAttributesAsText,
  selectMergeCrosstabColumns,
};
