/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ObjectInfoSetting,
  OrderWorksheetObjectInfoSettingsAction,
  SettingsActions,
  SettingsActionTypes,
  SettingsState,
  ToggleImportAttributesAsTextFlagAction,
  ToggleMainSidePanelObjectInfoSettingAction,
  ToggleMainWorksheetObjectInfoSettingAction,
  ToggleMergeCrosstabColumnsFlagAction,
  ToggleSidePanelObjectInfoSettingAction,
  ToggleWorksheetObjectInfoSettingAction,
} from './settings-reducer-types';

import {
  initialSidePanelObjectInfoSettings,
  initialWorksheetObjectInfoSettings,
} from './settings-constants';

const initialState: SettingsState = {
  mergeCrosstabColumns: true,
  importAttributesAsText: false,
  sidePanelObjectInfoSettings: initialSidePanelObjectInfoSettings,
  worksheetObjectInfoSettings: initialWorksheetObjectInfoSettings,
};

// eslint-disable-next-line default-param-last
export const settingsReducer = (state = initialState, action: SettingsActions): SettingsState => {
  switch (action.type) {
    case SettingsActionTypes.TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG:
      return toggleMergeCrosstabColumnsFlag(state, action);
    case SettingsActionTypes.TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG:
      return toggleImportAttributesAsTextFlag(state, action);
    case SettingsActionTypes.TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING:
      return toggleSidePanelObjectInfoSetting(state, action);
    case SettingsActionTypes.TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING:
      return toggleMainSidePanelObjectInfoSetting(state, action);
    case SettingsActionTypes.TOGGLE_WORKSHEET_OBJECT_INFO_SETTING:
      return toggleWorksheetObjectInfoSetting(state, action);
    case SettingsActionTypes.TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING:
      return toggleMainWorksheetObjectInfoSetting(state, action);
    case SettingsActionTypes.ORDER_WORKSHEET_OBJECT_INFO_SETTINGS:
      return orderWorksheetObjectInfoSettings(state, action);
    default:
      return state;
  }
};

function toggleMergeCrosstabColumnsFlag(
  state: SettingsState,
  action: ToggleMergeCrosstabColumnsFlagAction
): SettingsState {
  return {
    ...state,
    mergeCrosstabColumns: action.mergeCrosstabColumns,
  };
}

function toggleImportAttributesAsTextFlag(
  state: SettingsState,
  action: ToggleImportAttributesAsTextFlagAction
): SettingsState {
  return {
    ...state,
    importAttributesAsText: action.importAttributesAsText,
  };
}

function toggleSidePanelObjectInfoSetting(
  state: SettingsState,
  action: ToggleSidePanelObjectInfoSettingAction
): SettingsState {
  const { key, value } = action.payload;

  return {
    ...state,
    sidePanelObjectInfoSettings: state.sidePanelObjectInfoSettings.map(setting =>
      setting.key === key ? { ...setting, toggleChecked: value } : setting
    ),
  };
}

function toggleMainSidePanelObjectInfoSetting(
  state: SettingsState,
  action: ToggleMainSidePanelObjectInfoSettingAction
): SettingsState {
  return {
    ...state,
    sidePanelObjectInfoSettings: state.sidePanelObjectInfoSettings.map(setting => ({
      ...setting,
      toggleChecked: action.payload,
    })),
  };
}

function toggleWorksheetObjectInfoSetting(
  state: SettingsState,
  action: ToggleWorksheetObjectInfoSettingAction
): SettingsState {
  const { key, value } = action.payload;

  return {
    ...state,
    worksheetObjectInfoSettings: state.worksheetObjectInfoSettings.map(setting =>
      setting.key === key ? { ...setting, toggleChecked: value } : setting
    ),
  };
}

function toggleMainWorksheetObjectInfoSetting(
  state: SettingsState,
  action: ToggleMainWorksheetObjectInfoSettingAction
): SettingsState {
  return {
    ...state,
    worksheetObjectInfoSettings: state.worksheetObjectInfoSettings.map(setting => ({
      ...setting,
      toggleChecked: action.payload,
    })),
  };
}

function orderWorksheetObjectInfoSettings(
  state: SettingsState,
  action: OrderWorksheetObjectInfoSettingsAction
): SettingsState {
  const { worksheetObjectInfoKeys } = action;

  const orderedList = worksheetObjectInfoKeys.reduce((acc, key) => {
    const item = state.worksheetObjectInfoSettings.find(i => i.key === key);
    if (item) {
      acc.push(item);
    }
    return acc;
  }, [] as ObjectInfoSetting[]);

  return {
    ...state,
    worksheetObjectInfoSettings: orderedList,
  };
}
