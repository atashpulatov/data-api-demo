import { Action } from 'redux';

import { PageByDisplayType } from '../../page-by/page-by-types';
import { ObjectAndWorksheetNamingOption } from '../../right-side-panel/settings-side-panel/settings-side-panel-types';

import {
  ChapterNamePosition,
  ContentPositioning,
  ObjectImportType,
} from '../../mstr-object/constants';

export type SettingsState = {
  mergeCrosstabColumns: boolean;
  importAttributesAsText: boolean;
  sidePanelObjectInfoSettings: ObjectInfoSetting[];
  worksheetObjectInfoSettings: ObjectInfoSetting[];
  importType: ObjectImportType;
  objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption;
  pageByDisplaySetting: PageByDisplayType;
  pivotTableAddAttributesToColumns: boolean;
  pivotTableAddMetricsToValues: boolean;
  enableDataAutoRefresh: boolean;
  tableImportPosition: TableImportPosition;
  displayChapterName: boolean;
  chapterNamePosition: ChapterNamePosition;
  contentPositioning: ContentPositioning;
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
  SET_TABLE_IMPORT_POSITION_SETTING = 'SET_TABLE_IMPORT_POSITION_SETTING',
  SET_DEFAULT_IMPORT_TYPE = 'SET_DEFAULT_IMPORT_TYPE',
  SET_PIVOT_TABLE_ADD_ATTRIBUTES_TO_COLUMNS = 'SET_PIVOT_TABLE_ADD_ATTRIBUTES_TO_COLUMNS',
  SET_PIVOT_TABLE_ADD_METRICS_TO_VALUES = 'SET_PIVOT_TABLE_ADD_METRICS_TO_VALUES',
  SET_ENABLE_DATA_AUTO_REFRESH = 'SET_ENABLE_DATA_AUTO_REFRESH',
  TOGGLE_CHAPTER_NAME_VISIBILTY = 'TOGGLE_CHAPTER_NAME_VISIBILTY',
  SET_CHAPTER_NAME_POSITION = 'SET_CHAPTER_NAME_POSITION',
  SET_CONTENT_POSITIONING = 'SET_CONTENT_POSITIONING',
}

export enum TableImportPosition {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
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
  pageByDisplaySetting: PageByDisplayType;
}

export interface SetTableImportPositionAction extends Action {
  type: SettingsActionTypes.SET_TABLE_IMPORT_POSITION_SETTING;
  tableImportPosition: TableImportPosition;
}

export interface SetDefaultImportTypeAction extends Action {
  type: SettingsActionTypes.SET_DEFAULT_IMPORT_TYPE;
  defaultImportType: ObjectImportType;
}

export interface SetPivotTableAddAttributesToColumnsAction extends Action {
  type: SettingsActionTypes.SET_PIVOT_TABLE_ADD_ATTRIBUTES_TO_COLUMNS;
  payload: boolean;
}

export interface SetPivotTableAddMetricsToValuesAction extends Action {
  type: SettingsActionTypes.SET_PIVOT_TABLE_ADD_METRICS_TO_VALUES;
  payload: boolean;
}

export interface SetEnableDataAutoRefresh extends Action {
  type: SettingsActionTypes.SET_ENABLE_DATA_AUTO_REFRESH;
  payload: boolean;
}

export interface ToggleChapterNameVisibilityAction extends Action {
  type: SettingsActionTypes.TOGGLE_CHAPTER_NAME_VISIBILTY;
  payload: boolean;
}

export interface SetChapterNamePositonAction extends Action {
  type: SettingsActionTypes.SET_CHAPTER_NAME_POSITION;
  chapterNamePosition: ChapterNamePosition;
}

export interface SetContentPositioningAction extends Action {
  type: SettingsActionTypes.SET_CONTENT_POSITIONING;
  contentPositioning: ContentPositioning;
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
  | SetPageByDisplaySettingAction
  | SetTableImportPositionAction
  | SetDefaultImportTypeAction
  | SetPivotTableAddAttributesToColumnsAction
  | SetPivotTableAddMetricsToValuesAction
  | SetEnableDataAutoRefresh
  | ToggleChapterNameVisibilityAction
  | SetChapterNamePositonAction
  | SetContentPositioningAction;

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
