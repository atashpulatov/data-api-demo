import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { SettingsState } from './settings-reducer-types';

const getSettingsState = (state: RootState): SettingsState => state.settingsReducer;

export const selectSidePanelObjectInfoSettings = createSelector(
  [getSettingsState],
  settingsState => settingsState.sidePanelObjectInfoSettings
);

export const selectWorksheetObjectInfoSettings = createSelector(
  [getSettingsState],
  settingsState => settingsState.worksheetObjectInfoSettings
);
