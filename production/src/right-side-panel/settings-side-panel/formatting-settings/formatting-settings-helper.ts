import {
  MultiSectionSettingType,
  SettingPanelSection,
  SettingsSection,
} from '@mstr/connector-components';

import { userRestService } from '../../../home/user-rest-service';
import { getBooleanUserPreference } from '../settings-side-panel-helper';

import { reduxStore } from '../../../store';

import {
  ChapterNamePositionOptions,
  ContentPositioningOptions,
  ImportFormatOptions,
  ImportFormattingOption,
  UserPreferenceKey,
} from '../settings-side-panel-types';

import i18n from '../../../i18n';
import { settingsActions } from '../../../redux-reducer/settings-reducer/settings-actions';
import initializationErrorDecorator from '../initialization-error-decorator';
import {
  ChapterNamePosition,
  ContentPositioning,
  ObjectImportType,
} from '../../../mstr-object/constants';

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
   * Toggles the displayChapterName flag
   * @param displayChapterName - The new value for the importAttributesAsText flag.
   */
  handleDisplayChapterNameSwitch = async (displayChapterName: boolean): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_IMPORT_SHEET_CHAPTER_NAME_VISIBILITY,
      displayChapterName
    );
    reduxStore.dispatch(settingsActions.toggleChapterNameVisibility(displayChapterName));
  };

  /**
   * Handles chapterNamePosition change
   * @param position - The new value for the chapterNamePosition flag.
   */
  handleChapterNamePositionSelectionChange = async (
    position: ChapterNamePosition
  ): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_IMPORT_SHEET_CHAPTER_NAME_POSITION,
      position
    );
    reduxStore.dispatch(settingsActions.setChapterNamePosition(position));
  };

  /**
   * Handles contentPositioning change
   * @param contentPositioning - The new value for the contentPositioning flag.
   */
  handleContentPositioningSelectionChange = async (
    contentPositioning: ContentPositioning
  ): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_TABLES_FROM_SAME_DASHBOARD_PAGE_POSITIONING,
      contentPositioning
    );
    reduxStore.dispatch(settingsActions.setContentPositioning(contentPositioning));
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
    defaultImportType: ObjectImportType,
    chapterNameVisibilityValue: boolean,
    defaultChapterNamePosition: ChapterNamePosition,
    defaultContentPositioning: ContentPositioning
  ): SettingsSection => {
    const storeState = reduxStore.getState();
    const { isShapeAPISupported, isInsertWorksheetAPISupported, isPivotTableSupported } =
      storeState.officeReducer;

    const importFormatOptions: ImportFormatOptions[] = [];

    importFormatOptions.push({ key: ObjectImportType.TABLE, value: i18n.t('Data') });

    if (isInsertWorksheetAPISupported) {
      importFormatOptions.push({
        key: ObjectImportType.FORMATTED_DATA,
        value: i18n.t('Formatted Data'),
      });
    }

    if (isShapeAPISupported) {
      importFormatOptions.push({ key: ObjectImportType.IMAGE, value: i18n.t('Visualization') });
    }

    if (isPivotTableSupported) {
      importFormatOptions.push({ key: ObjectImportType.PIVOT_TABLE, value: i18n.t('Pivot Table') });
    }

    const chapterNamePositionOptions: ChapterNamePositionOptions[] = [
      {
        key: ChapterNamePosition.BEFORE_PAGE_NAME,
        value: i18n.t('Before page name'),
      },
      {
        key: ChapterNamePosition.TOP_OF_SHEET,
        value: i18n.t('On top of sheet'),
      },
    ];

    const contentPositioningOptions: ContentPositioningOptions[] = [
      {
        key: ContentPositioning.STACKED,
        value: i18n.t('Stacked'),
      },
      {
        key: ContentPositioning.SIDE_BY_SIDE,
        value: i18n.t('Side by Side'),
      },
    ];

    return {
      key: 'import-settings',
      label: i18n.t('Import'),
      initialExpand: false,
      settingsGroups: [
        {
          key: 'multi-section-import',
          type: SettingPanelSection.MULTI,
          settings: [
            {
              type: MultiSectionSettingType.SELECT,
              key: ImportFormattingOption.DEFAULT_IMPORT_TYPE,
              label: i18n.t('Default import format:'),
              description: i18n.t(
                'Objects that cannot be imported in the selected format will be imported as data. You can change the format during import.'
              ),
              onChange: this.handleDefaultImportTypeChange,
              options: importFormatOptions,
              value: defaultImportType,
            },
            {
              type: MultiSectionSettingType.SWITCH,
              key: ImportFormattingOption.DISPLAY_CHAPTER_NAME,
              label: i18n.t('Chapter name'),
              onSwitch: this.handleDisplayChapterNameSwitch,
              value: chapterNameVisibilityValue,
            },
            {
              type: MultiSectionSettingType.SELECT,
              key: ImportFormattingOption.CHAPTER_NAME_POSITION,
              label: i18n.t('Chapter name position'),
              onChange: this.handleChapterNamePositionSelectionChange,
              options: chapterNamePositionOptions,
              value: defaultChapterNamePosition,
              customItemCssClass: 'chapter-name-position',
              disabled: !chapterNameVisibilityValue,
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
        {
          key: 'content-positioning',
          type: SettingPanelSection.SELECT,
          onChange: this.handleContentPositioningSelectionChange,
          settings: [
            {
              key: ImportFormattingOption.CONTENT_POSITIONING,
              description: i18n.t(
                'Choose content arrangement for importing entire Dashboard page onto one sheet.'
              ),
              label: i18n.t('Positioning'),
              options: contentPositioningOptions,
              value: defaultContentPositioning,
            },
          ],
        },
      ],
    };
  };
}
export const formattingSettingsHelper = new FormattingSettingsHelper();
