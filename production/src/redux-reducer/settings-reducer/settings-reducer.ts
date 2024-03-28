/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  SettingsActions,
  SettingsActionTypes,
  SettingsState,
  ToggleImportAttributesAsTextFlagAction,
  ToggleMergeCrosstabColumnsFlagAction,
} from './settings-reducer-types';

const initialState: SettingsState = {
  mergeCrosstabColumns: true,
  importAttributesAsText: false,
};

// eslint-disable-next-line default-param-last
export const settingsReducer = (state = initialState, action: SettingsActions): SettingsState => {
  switch (action.type) {
    case SettingsActionTypes.TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG:
      return toggleMergeCrosstabColumnsFlag(state, action);
    case SettingsActionTypes.TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG:
      return toggleImportAttributesAsTextFlag(state, action);
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
