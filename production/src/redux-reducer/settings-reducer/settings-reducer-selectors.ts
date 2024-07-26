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

const selectTableImportPositionSetting = createSelector(
  [getSettingsState],
  settingsState => settingsState.tableImportPosition
);

const selectImportAttributesAsText = createSelector(
  [getSettingsState],
  settingsState => settingsState.importAttributesAsText
);

const selectMergeCrosstabColumns = createSelector(
  [getSettingsState],
  settingsState => settingsState.mergeCrosstabColumns
);

const selectPivotTableAddAttributesToColumns = createSelector(
  [getSettingsState],
  settingsState => settingsState.pivotTableAddAttributesToColumns
);

const selectPivotTableAddMetricsToValues = createSelector(
  [getSettingsState],
  settingsState => settingsState.pivotTableAddMetricsToValues
);

const selectEnableDataAutoRefresh = createSelector(
  [getSettingsState],
  settingsState => settingsState.enableDataAutoRefresh
);

const selectChapterNameVisibility = createSelector(
  [getSettingsState],
  settingState => settingState.displayChapterName
);

const selectChapterNamePosition = createSelector(
  [getSettingsState],
  settingState => settingState.chapterNamePosition
);

const selectContentPositioning = createSelector(
  [getSettingsState],
  settingState => settingState.contentPositioning
);

export const settingsReducerSelectors = {
  selectSidePanelObjectInfoSettings,
  selectSidePanelMainSwitchValue,
  selectWorksheetObjectInfoSettings,
  selectWorksheetMainSwitchValue,
  selectImportType,
  selectObjectAndWorksheetNamingSetting,
  selectPageByDisplaySetting,
  selectTableImportPositionSetting,
  selectImportAttributesAsText,
  selectMergeCrosstabColumns,
  selectPivotTableAddAttributesToColumns,
  selectPivotTableAddMetricsToValues,
  selectEnableDataAutoRefresh,
  selectChapterNameVisibility,
  selectChapterNamePosition,
  selectContentPositioning,
};
