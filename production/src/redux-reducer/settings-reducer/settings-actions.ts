import {
  KeyValue,
  OrderWorksheetObjectInfoSettingsAction,
  SettingsActionTypes,
  ToggleImportAttributesAsTextFlagAction,
  ToggleMainSidePanelObjectInfoSettingAction,
  ToggleMainWorksheetObjectInfoSettingAction,
  ToggleMergeCrosstabColumnsFlagAction,
  ToggleSidePanelObjectInfoSettingAction,
  ToggleWorksheetObjectInfoSettingAction,
} from './settings-reducer-types';

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

const orderWorksheetObjectInfoSettings = (
  worksheetObjectInfoKeys: string[]
): OrderWorksheetObjectInfoSettingsAction => ({
  type: SettingsActionTypes.ORDER_WORKSHEET_OBJECT_INFO_SETTINGS,
  worksheetObjectInfoKeys,
});

export const settingsActions = {
  toggleImportAttributesAsTextFlag,
  toggleMergeCrosstabColumnsFlag,
  toggleSidePanelObjectInfoSetting,
  toggleMainSidePanelObjectInfoSetting,
  toggleWorksheetObjectInfoSetting,
  toggleMainWorksheetObjectInfoSetting,
  orderWorksheetObjectInfoSettings,
};
