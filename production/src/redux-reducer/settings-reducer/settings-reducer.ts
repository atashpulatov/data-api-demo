/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ObjectAndWorksheetNamingOption,
  PageByDisplayOption,
} from '../../right-side-panel/settings-side-panel/settings-side-panel-types';
import {
  LoadSidePanelObjectInfoSettingAction,
  LoadWorksheetObjectInfoSettingAction,
  SetDefaultImportTypeAction,
  SetPageByDisplaySettingAction,
  SetPivotTableAddAttributesToColumnsAction,
  SetPivotTableAddMetricsToValuesAction,
  SettingsActions,
  SettingsActionTypes,
  SettingsState,
  SetWorksheetNamingSettingAction,
  ToggleImportAttributesAsTextFlagAction,
  ToggleMainSidePanelObjectInfoSettingAction,
  ToggleMainWorksheetObjectInfoSettingAction,
  ToggleMergeCrosstabColumnsFlagAction,
  ToggleSidePanelObjectInfoSettingAction,
  ToggleWorksheetObjectInfoSettingAction,
} from './settings-reducer-types';

import { ObjectImportType } from '../../mstr-object/constants';
import {
  initialSidePanelObjectInfoSettings,
  initialWorksheetObjectInfoSettings,
} from './settings-constants';

const initialState: SettingsState = {
  mergeCrosstabColumns: true,
  importAttributesAsText: false,
  sidePanelObjectInfoSettings: initialSidePanelObjectInfoSettings,
  worksheetObjectInfoSettings: initialWorksheetObjectInfoSettings,
  importType: ObjectImportType.TABLE,
  objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption.REPORT_NAME,
  pageByDisplaySetting: PageByDisplayOption.SELECT_PAGES,
  pivotTableAddAttributesToColumns: false,
  pivotTableAddMetricsToValues: false,
};

// eslint-disable-next-line default-param-last
export const settingsReducer = (state = initialState, action: SettingsActions): SettingsState => {
  switch (action.type) {
    case SettingsActionTypes.TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG:
      return toggleMergeCrosstabColumnsFlag(state, action);
    case SettingsActionTypes.TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG:
      return toggleImportAttributesAsTextFlag(state, action);
    case SettingsActionTypes.LOAD_SIDE_PANEL_OBJECT_INFO_SETTINGS:
      return loadSidePanelObjectInfoSettings(state, action);
    case SettingsActionTypes.TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING:
      return toggleSidePanelObjectInfoSetting(state, action);
    case SettingsActionTypes.TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING:
      return toggleMainSidePanelObjectInfoSetting(state, action);
    case SettingsActionTypes.LOAD_WORKSHEET_OBJECT_INFO_SETTINGS:
      return loadWorksheetObjectInfoSettings(state, action);
    case SettingsActionTypes.TOGGLE_WORKSHEET_OBJECT_INFO_SETTING:
      return toggleWorksheetObjectInfoSetting(state, action);
    case SettingsActionTypes.TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING:
      return toggleMainWorksheetObjectInfoSetting(state, action);
    case SettingsActionTypes.SET_OBJECT_AND_WORKSHEET_NAMING_SETTING:
      return setWorksheetNamingSetting(state, action);
    case SettingsActionTypes.SET_PAGE_BY_DISPLAY_SETTING:
      return setPageByDisplaySetting(state, action);
    case SettingsActionTypes.SET_DEFAULT_IMPORT_TYPE:
      return setDefaultImportType(state, action);
    case SettingsActionTypes.SET_PIVOT_TABLE_ADD_ATTRIBUTES_TO_COLUMNS:
      return setPivotTableAddAttributesToColumns(state, action);
    case SettingsActionTypes.SET_PIVOT_TABLE_ADD_METRICS_TO_VALUES:
      return setPivotTableAddMetricsToValues(state, action);
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

function loadSidePanelObjectInfoSettings(
  state: SettingsState,
  action: LoadSidePanelObjectInfoSettingAction
): SettingsState {
  return {
    ...state,
    sidePanelObjectInfoSettings: action.sidePanelObjectInfoSettings,
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

function loadWorksheetObjectInfoSettings(
  state: SettingsState,
  action: LoadWorksheetObjectInfoSettingAction
): SettingsState {
  return {
    ...state,
    worksheetObjectInfoSettings: action.worksheetObjectInfoSettings,
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

function setWorksheetNamingSetting(
  state: SettingsState,
  action: SetWorksheetNamingSettingAction
): SettingsState {
  return { ...state, objectAndWorksheetNamingSetting: action.objectAndWorksheetNamingSetting };
}

function setPageByDisplaySetting(
  state: SettingsState,
  action: SetPageByDisplaySettingAction
): SettingsState {
  return { ...state, pageByDisplaySetting: action.pageByDisplaySetting };
}

function setDefaultImportType(
  state: SettingsState,
  action: SetDefaultImportTypeAction
): SettingsState {
  return { ...state, importType: action.defaultImportType };
}

function setPivotTableAddAttributesToColumns(
  state: SettingsState,
  action: SetPivotTableAddAttributesToColumnsAction
): SettingsState {
  return { ...state, pivotTableAddAttributesToColumns: action.payload };
}

function setPivotTableAddMetricsToValues(
  state: SettingsState,
  action: SetPivotTableAddMetricsToValuesAction
): SettingsState {
  return { ...state, pivotTableAddMetricsToValues: action.payload };
}
