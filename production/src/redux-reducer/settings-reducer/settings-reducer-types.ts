import { Action } from 'redux';

export type SettingsState = {
  mergeCrosstabColumns: boolean;
  importAttributesAsText: boolean;
};

export enum SettingsActionTypes {
  TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG = 'SETTINGS_TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG',
  TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG = 'SETTINGS_TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG',
}

export interface ToggleMergeCrosstabColumnsFlagAction extends Action {
  type: SettingsActionTypes.TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG;
  mergeCrosstabColumns: boolean;
}

export interface ToggleImportAttributesAsTextFlagAction extends Action {
  type: SettingsActionTypes.TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG;
  importAttributesAsText: boolean;
}

export type SettingsActions =
  | ToggleMergeCrosstabColumnsFlagAction
  | ToggleImportAttributesAsTextFlagAction;
