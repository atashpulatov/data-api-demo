import { SettingPanelSection, SettingsSection } from '@mstr/connector-components';

import { userRestService } from '../../../home/user-rest-service';
import { getBooleanUserPreference } from '../settings-side-panel-helper';

import { reduxStore } from '../../../store';

import { ImportFormattingOption, UserPreferenceKey } from '../settings-side-panel-types';

import i18n from '../../../i18n';
import { settingsActions } from '../../../redux-reducer/settings-reducer/settings-actions';
import initializationErrorDecorator from '../initialization-error-decorator';
import { ObjectImportType } from '../../../mstr-object/constants';

class FormattingSettingsHelper {
  /**
   * Initializes the import formatting section
   * Retrieves the user preference for the importing as a text and merge crosstab columns from the userRestService,
   * updates the redux store with the retrieved value.
   */
  @initializationErrorDecorator.initializationWrapper
  async initImportFormattingSettings(): Promise<void> {
    const importAttributesAsText = await getBooleanUserPreference(
      UserPreferenceKey.EXCEL_IMPORT_ATTRIBUTES_AS_TEXT
    );

    const mergeCrosstabColumns = await getBooleanUserPreference(
      UserPreferenceKey.EXCEL_IMPORT_MERGE_CROSSTAB_COLUMNS
    );

    const { value: defaultImportType } = await userRestService.getUserPreference(
      UserPreferenceKey.EXCEL_DEFAULT_IMPORT_TYPE
    );

    reduxStore.dispatch(
      settingsActions.toggleImportAttributesAsTextFlag(importAttributesAsText) as any
    );

    reduxStore.dispatch(
      settingsActions.toggleMergeCrosstabColumnsFlag(mergeCrosstabColumns) as any
    );

    reduxStore.dispatch(settingsActions.setDefaultImportType(defaultImportType) as any);
  }

  /**
   * Toggles the importAttributeAsText flag
   * @param importAttributesAsText - The new value for the importAttributesAsText flag.
   * @returns A Promise that resolves when the user preference is updated.
   */
  toggleImportAsText = async (importAttributesAsText: boolean): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_IMPORT_ATTRIBUTES_AS_TEXT,
      importAttributesAsText
    );

    reduxStore.dispatch(
      settingsActions.toggleImportAttributesAsTextFlag(importAttributesAsText) as any
    );
  };

  /**
   * Toggles the merge crosstab columns flag
   * @param mergeCrosstabColumns - The new value for the merge crosstab columns flag.
   * @returns A Promise that resolves when the user preference is updated.
   */
  toggleMergeCrosstabColumns = async (mergeCrosstabColumns: boolean): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_IMPORT_MERGE_CROSSTAB_COLUMNS,
      mergeCrosstabColumns
    );

    reduxStore.dispatch(
      settingsActions.toggleMergeCrosstabColumnsFlag(mergeCrosstabColumns) as any
    );
  };

  /**
   * Handles the import formatting change
   * @param value - The new value for the setting.
   * @param key - The key of the setting.
   */
  handleImportFormattingChange = (value: boolean, key: string): void => {
    switch (key) {
      case ImportFormattingOption.IMPORT_ATTRIBUTES_AS_TEXT:
        this.toggleImportAsText(value);
        break;
      case ImportFormattingOption.MERGE_CROSSTAB_COLUMNS:
        this.toggleMergeCrosstabColumns(value);
        break;
      default:
        break;
    }
  };

  /**
   * Handles the default import format change
   * @param format - The new default format.
   */
  handleDefaultImportTypeChange = async (format: ObjectImportType): Promise<void> => {
    await userRestService.setUserPreference(UserPreferenceKey.EXCEL_DEFAULT_IMPORT_TYPE, format);
    reduxStore.dispatch(settingsActions.setDefaultImportType(format));
  };

  /**
   * Returns the settings section for the import formatting settings.
   * @param importAttributesAsTextValue - The value of the importAttributesAsText setting.
   * @param mergeCrosstabColumnsValue - The value of the mergeCrosstabColumns setting.
   * @returns The settings section for import formatting settings.
   */

  getImportFormattingSection = (
    importAttributesAsTextValue: boolean,
    mergeCrosstabColumnsValue: boolean,
    defaultImportType: ObjectImportType
  ): SettingsSection => ({
    key: 'import-settings',
    label: i18n.t('Import'),
    initialExpand: false,
    settingsGroups: [
      {
        key: 'default-import-type',
        type: SettingPanelSection.SELECT,
        onChange: this.handleDefaultImportTypeChange,
        settings: [
          {
            key: ImportFormattingOption.DEFAULT_IMPORT_TYPE,
            label: i18n.t('Default import format:'),
            description: i18n.t(
              'Objects that cannot be imported in the selected format will be imported as data. You can change the format during import.'
            ),
            options: [
              { key: ObjectImportType.TABLE, value: i18n.t('Data') },
              { key: ObjectImportType.FORMATTED_TABLE, value: i18n.t('Data with formatting') },
              { key: ObjectImportType.IMAGE, value: i18n.t('Visualisation') },
              { key: ObjectImportType.PIVOT_TABLE, value: i18n.t('Pivot Table') },
            ],
            value: defaultImportType,
          },
        ],
      },
      {
        key: 'import-formatting',
        type: SettingPanelSection.SWITCH,
        onSwitch: this.handleImportFormattingChange,
        settings: [
          {
            key: ImportFormattingOption.IMPORT_ATTRIBUTES_AS_TEXT,
            label: i18n.t('Import data as text'),
            value: importAttributesAsTextValue,
            description: i18n.t(
              'If enabled, attribute values will be imported as text, maintaining the formatting from MicroStrategy. This may impact Excel formulas.'
            ),
          },
          {
            key: ImportFormattingOption.MERGE_CROSSTAB_COLUMNS,
            label: i18n.t('Merge columns'),
            value: mergeCrosstabColumnsValue,
            description: i18n.t(
              'If enabled, adjacent column headers with identical values will be merged. Applies only to cross-tab reports.'
            ),
          },
        ],
      },
    ],
  });
}
export const formattingSettingsHelper = new FormattingSettingsHelper();
