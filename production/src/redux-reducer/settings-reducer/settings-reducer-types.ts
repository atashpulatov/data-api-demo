import { Action } from 'redux';

import {
  ObjectAndWorksheetNamingOption,
  PageByDisplayOption,
} from '../../right-side-panel/settings-side-panel/settings-side-panel-types';

import { ObjectImportType } from '../../mstr-object/constants';

export type SettingsState = {
  mergeCrosstabColumns: boolean;
  importAttributesAsText: boolean;
  sidePanelObjectInfoSettings: ObjectInfoSetting[];
  worksheetObjectInfoSettings: ObjectInfoSetting[];
  importType: ObjectImportType;
  objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption;
  pageByDisplaySetting: PageByDisplayOption;
};

export enum SettingsActionTypes {
  TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG = 'SETTINGS_TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG',
  TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG = 'SETTINGS_TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG',
  LOAD_SIDE_PANEL_OBJECT_INFO_SETTINGS = 'SETTINGS_LOAD_SIDE_PANEL_OBJECT_INFO_SETTINGS',
  TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING = 'SETTINGS_TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING',
  TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING = 'SETTINGS_TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING',
  LOAD_WORKSHEET_OBJECT_INFO_SETTINGS = 'SETTINGS_LOAD_WORKSHEET_OBJECT_INFO_SETTINGS',
  TOGGLE_WORKSHEET_OBJECT_INFO_SETTING = 'SETTINGS_TOGGLE_WORKSHEET_OBJECT_INFO_SETTING',
  TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING = 'SETTINGS_TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING',
  SET_OBJECT_AND_WORKSHEET_NAMING_SETTING = 'SET_OBJECT_AND_WORKSHEET_NAMING_SETTING',
  SET_PAGE_BY_DISPLAY_SETTING = 'SET_PAGE_BY_DISPLAY_SETTING',
}

export interface ToggleMergeCrosstabColumnsFlagAction extends Action {
  type: SettingsActionTypes.TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG;
  mergeCrosstabColumns: boolean;
}

export interface ToggleImportAttributesAsTextFlagAction extends Action {
  type: SettingsActionTypes.TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG;
  importAttributesAsText: boolean;
}

export interface LoadSidePanelObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.LOAD_SIDE_PANEL_OBJECT_INFO_SETTINGS;
  sidePanelObjectInfoSettings: ObjectInfoSetting[];
}

export interface ToggleSidePanelObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING;
  payload: KeyValue;
}

export interface ToggleMainSidePanelObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING;
  payload: boolean;
}

export interface LoadWorksheetObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.LOAD_WORKSHEET_OBJECT_INFO_SETTINGS;
  worksheetObjectInfoSettings: ObjectInfoSetting[];
}

export interface ToggleWorksheetObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.TOGGLE_WORKSHEET_OBJECT_INFO_SETTING;
  payload: KeyValue;
}

export interface ToggleMainWorksheetObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING;
  payload: boolean;
}

export interface SetWorksheetNamingSettingAction extends Action {
  type: SettingsActionTypes.SET_OBJECT_AND_WORKSHEET_NAMING_SETTING;
  objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption;
}

export interface SetPageByDisplaySettingAction extends Action {
  type: SettingsActionTypes.SET_PAGE_BY_DISPLAY_SETTING;
  pageByDisplaySetting: PageByDisplayOption;
}

export type SettingsActions =
  | ToggleMergeCrosstabColumnsFlagAction
  | ToggleImportAttributesAsTextFlagAction
  | LoadSidePanelObjectInfoSettingAction
  | ToggleSidePanelObjectInfoSettingAction
  | ToggleMainSidePanelObjectInfoSettingAction
  | LoadWorksheetObjectInfoSettingAction
  | ToggleWorksheetObjectInfoSettingAction
  | ToggleMainWorksheetObjectInfoSettingAction
  | SetWorksheetNamingSettingAction
  | SetPageByDisplaySettingAction;

export type ObjectInfoSetting = {
  key: string;
  item: string;
  showToggle: boolean;
  toggleChecked: boolean;
};

export type KeyValue = {
  key: string;
  value: boolean;
};
