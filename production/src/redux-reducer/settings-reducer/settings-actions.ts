import {
  SettingsActionTypes,
  ToggleImportAttributesAsTextFlagAction,
  ToggleMergeCrosstabColumnsFlagAction,
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

export const settingsActions = {
  toggleImportAttributesAsTextFlag,
  toggleMergeCrosstabColumnsFlag,
};
