import {
  ObjectAndWorksheetNamingOption,
  PageByDisplayOption,
} from '../../right-side-panel/settings-side-panel/settings-side-panel-types';
import {
  KeyValue,
  LoadSidePanelObjectInfoSettingAction,
  LoadWorksheetObjectInfoSettingAction,
  ObjectInfoSetting,
  SetDefaultImportTypeAction,
  SetPageByDisplaySettingAction,
  SettingsActionTypes,
  SetWorksheetNamingSettingAction,
  ToggleImportAttributesAsTextFlagAction,
  ToggleMainSidePanelObjectInfoSettingAction,
  ToggleMainWorksheetObjectInfoSettingAction,
  ToggleMergeCrosstabColumnsFlagAction,
  ToggleSidePanelObjectInfoSettingAction,
  ToggleWorksheetObjectInfoSettingAction,
} from './settings-reducer-types';

import { ObjectImportType } from '../../mstr-object/constants';

const toggleImportAttributesAsTextFlag = (
  importAttributesAsText: boolean
): ToggleImportAttributesAsTextFlagAction => ({
  type: SettingsActionTypes.TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG,
  importAttributesAsText,
});

const toggleMergeCrosstabColumnsFlag = (
  mergeCrosstabColumns: boolean
): ToggleMergeCrosstabColumnsFlagAction => ({
  type: SettingsActionTypes.TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG,
  mergeCrosstabColumns,
});

const loadSidePanelObjectInfoSettings = (
  sidePanelObjectInfoSettings: ObjectInfoSetting[]
): LoadSidePanelObjectInfoSettingAction => ({
  type: SettingsActionTypes.LOAD_SIDE_PANEL_OBJECT_INFO_SETTINGS,
  sidePanelObjectInfoSettings,
});

const toggleSidePanelObjectInfoSetting = (
  payload: KeyValue
): ToggleSidePanelObjectInfoSettingAction => ({
  type: SettingsActionTypes.TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING,
  payload,
});

const toggleMainSidePanelObjectInfoSetting = (
  payload: boolean
): ToggleMainSidePanelObjectInfoSettingAction => ({
  type: SettingsActionTypes.TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING,
  payload,
});

const loadWorksheetObjectInfoSettings = (
  worksheetObjectInfoSettings: ObjectInfoSetting[]
): LoadWorksheetObjectInfoSettingAction => ({
  type: SettingsActionTypes.LOAD_WORKSHEET_OBJECT_INFO_SETTINGS,
  worksheetObjectInfoSettings,
});

const toggleWorksheetObjectInfoSetting = (
  payload: KeyValue
): ToggleWorksheetObjectInfoSettingAction => ({
  type: SettingsActionTypes.TOGGLE_WORKSHEET_OBJECT_INFO_SETTING,
  payload,
});

const toggleMainWorksheetObjectInfoSetting = (
  payload: boolean
): ToggleMainWorksheetObjectInfoSettingAction => ({
  type: SettingsActionTypes.TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING,
  payload,
});

const setWorksheetNamingSetting = (
  objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption
): SetWorksheetNamingSettingAction => ({
  type: SettingsActionTypes.SET_OBJECT_AND_WORKSHEET_NAMING_SETTING,
  objectAndWorksheetNamingSetting,
});

const setPageByDisplaySetting = (
  pageByDisplaySetting: PageByDisplayOption
): SetPageByDisplaySettingAction => ({
  type: SettingsActionTypes.SET_PAGE_BY_DISPLAY_SETTING,
  pageByDisplaySetting,
});

const setDefaultImportType = (importType: ObjectImportType): SetDefaultImportTypeAction => ({
  type: SettingsActionTypes.SET_DEFAULT_IMPORT_TYPE,
  defaultImportType: importType,
});

export const settingsActions = {
  toggleImportAttributesAsTextFlag,
  toggleMergeCrosstabColumnsFlag,
  loadSidePanelObjectInfoSettings,
  toggleSidePanelObjectInfoSetting,
  toggleMainSidePanelObjectInfoSetting,
  loadWorksheetObjectInfoSettings,
  toggleWorksheetObjectInfoSetting,
  toggleMainWorksheetObjectInfoSetting,
  setWorksheetNamingSetting,
  setPageByDisplaySetting,
  setDefaultImportType,
};
