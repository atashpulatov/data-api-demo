import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { SettingsState } from './settings-reducer-types';

const getSettingsState = (state: RootState): SettingsState => state.settingsReducer;

const selectSidePanelObjectInfoSettings = createSelector(
  [getSettingsState],
  settingsState => settingsState.sidePanelObjectInfoSettings
);

const selectWorksheetObjectInfoSettings = createSelector(
  [getSettingsState],
  settingsState => settingsState.worksheetObjectInfoSettings
);

const selectImportType = createSelector(
  [getSettingsState],
  settingsState => settingsState.importType
);

export const settingsReducerSelectors = {
  selectSidePanelObjectInfoSettings,
  selectWorksheetObjectInfoSettings,
  selectImportType,
};
