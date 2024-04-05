import { Action } from 'redux';

export type SettingsState = {
  mergeCrosstabColumns: boolean;
  importAttributesAsText: boolean;
  sidePanelObjectInfoSettings: ObjectInfoSetting[];
  worksheetObjectInfoSettings: ObjectInfoSetting[];
};

export enum SettingsActionTypes {
  TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG = 'SETTINGS_TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG',
  TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG = 'SETTINGS_TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG',
  TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING = 'SETTINGS_TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING',
  TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING = 'SETTINGS_TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING',
  TOGGLE_WORKSHEET_OBJECT_INFO_SETTING = 'SETTINGS_TOGGLE_WORKSHEET_OBJECT_INFO_SETTING',
  TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING = 'SETTINGS_TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING',
  ORDER_WORKSHEET_OBJECT_INFO_SETTINGS = 'SETTINGS_ORDER_WORKSHEET_OBJECT_INFO_SETTINGS',
}

export interface ToggleMergeCrosstabColumnsFlagAction extends Action {
  type: SettingsActionTypes.TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG;
  mergeCrosstabColumns: boolean;
}

export interface ToggleImportAttributesAsTextFlagAction extends Action {
  type: SettingsActionTypes.TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG;
  importAttributesAsText: boolean;
}

export interface ToggleSidePanelObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING;
  payload: KeyValue;
}

export interface ToggleMainSidePanelObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING;
  payload: boolean;
}

export interface ToggleWorksheetObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.TOGGLE_WORKSHEET_OBJECT_INFO_SETTING;
  payload: KeyValue;
}

export interface ToggleMainWorksheetObjectInfoSettingAction extends Action {
  type: SettingsActionTypes.TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING;
  payload: boolean;
}

export interface OrderWorksheetObjectInfoSettingsAction extends Action {
  type: SettingsActionTypes.ORDER_WORKSHEET_OBJECT_INFO_SETTINGS;
  worksheetObjectInfoKeys: string[];
}

export type SettingsActions =
  | ToggleMergeCrosstabColumnsFlagAction
  | ToggleImportAttributesAsTextFlagAction
  | ToggleSidePanelObjectInfoSettingAction
  | ToggleMainSidePanelObjectInfoSettingAction
  | ToggleWorksheetObjectInfoSettingAction
  | ToggleMainWorksheetObjectInfoSettingAction
  | OrderWorksheetObjectInfoSettingsAction;

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
