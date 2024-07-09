import { PageByDisplayType } from '../../page-by/page-by-types';
import { ObjectAndWorksheetNamingOption } from '../../right-side-panel/settings-side-panel/settings-side-panel-types';
import {
  KeyValue,
  LoadSidePanelObjectInfoSettingAction,
  LoadWorksheetObjectInfoSettingAction,
  ObjectInfoSetting,
  SetDefaultImportTypeAction,
  SetEnableDataAutoRefresh,
  SetPageByDisplaySettingAction,
  SetPivotTableAddAttributesToColumnsAction,
  SetPivotTableAddMetricsToValuesAction,
  SetTableImportPositionAction,
  SettingsActionTypes,
  SetWorksheetNamingSettingAction,
  TableImportPosition,
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
  pageByDisplaySetting: PageByDisplayType
): SetPageByDisplaySettingAction => ({
  type: SettingsActionTypes.SET_PAGE_BY_DISPLAY_SETTING,
  pageByDisplaySetting,
});

const setTableImportPositionSetting = (
  tableImportPosition: TableImportPosition
): SetTableImportPositionAction => ({
  type: SettingsActionTypes.SET_TABLE_IMPORT_POSITION_SETTING,
  tableImportPosition,
});

const setDefaultImportType = (importType: ObjectImportType): SetDefaultImportTypeAction => ({
  type: SettingsActionTypes.SET_DEFAULT_IMPORT_TYPE,
  defaultImportType: importType,
});

const setPivotTableAddAttributesToColumns = (
  payload: boolean
): SetPivotTableAddAttributesToColumnsAction => ({
  type: SettingsActionTypes.SET_PIVOT_TABLE_ADD_ATTRIBUTES_TO_COLUMNS,
  payload,
});

const setPivotTableAddMetricsToValues = (
  payload: boolean
): SetPivotTableAddMetricsToValuesAction => ({
  type: SettingsActionTypes.SET_PIVOT_TABLE_ADD_METRICS_TO_VALUES,
  payload,
});

const setEnableDataAutoRefresh = (payload: boolean): SetEnableDataAutoRefresh => ({
  type: SettingsActionTypes.SET_ENABLE_DATA_AUTO_REFRESH,
  payload,
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
  setTableImportPositionSetting,
  setDefaultImportType,
  setPivotTableAddAttributesToColumns,
  setPivotTableAddMetricsToValues,
  setEnableDataAutoRefresh,
};
