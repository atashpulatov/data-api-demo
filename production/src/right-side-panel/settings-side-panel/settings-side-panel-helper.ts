import { SettingPanelSection, SettingsSection } from '@mstr/connector-components';

import { userRestService } from '../../home/user-rest-service';

import { reduxStore } from '../../store';

import { PageByDisplayType } from '../../page-by/page-by-types';
import {
  KeyValue,
  LoadSidePanelObjectInfoSettingAction,
  LoadWorksheetObjectInfoSettingAction,
  ObjectInfoSetting,
} from '../../redux-reducer/settings-reducer/settings-reducer-types';
import {
  OBJECT_INFO_KEY_VALUE,
  ObjectAndWorksheetNamingOption,
  UserPreferenceKey,
} from './settings-side-panel-types';

import i18n from '../../i18n';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { settingsActions } from '../../redux-reducer/settings-reducer/settings-actions';
import initializationErrorDecorator from './initialization-error-decorator';

class SettingsSidePanelHelper {
  // COMMON SETTINGS
  /**
   * Toggles the settings panel loaded flag.
   *
   * @param settingsPanelLoded - A boolean indicating whether the settings panel is loaded or not.
   */
  toggleSettingsPanel = (isSidePanelLoaded: boolean): void => {
    reduxStore.dispatch(officeActions.toggleSettingsPanelLoadedFlag(!isSidePanelLoaded) as any);
  };

  // PROMPT SETTINGS
  /**
   * Initializes the reuse prompt answers feature.
   * Retrieves the user preference for the reuse prompt answers flag from the userRestService,
   * updates the redux store with the retrieved value.
   * @returns A promise that resolves when the initialization is complete.
   */
  @initializationErrorDecorator.initializationWrapper
  async initReusePromptAnswers(): Promise<void> {
    const { value } = await userRestService.getUserPreference(
      UserPreferenceKey.EXCEL_REUSE_PROMPT_ANSWERS
    );
    const reusePromptAnswersFlag = !Number.isNaN(+value)
      ? !!parseInt(value, 10)
      : JSON.parse(value);

    reduxStore.dispatch(officeActions.toggleReusePromptAnswersFlag(reusePromptAnswersFlag) as any);
  }

  /**
   * Toggles the reuse prompt answers flag and updates the user preference.
   * @param reusePromptAnswers - The current value of the reuse prompt answers flag.
   * @returns A Promise that resolves when the user preference is updated.
   */
  toggleReusePromptAnswers = async (reusePromptAnswers: boolean): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_REUSE_PROMPT_ANSWERS,
      reusePromptAnswers
    );

    reduxStore.dispatch(officeActions.toggleReusePromptAnswersFlag(reusePromptAnswers) as any);
  };

  /**
   * Toggles the data auto refresh flag and updates the user preference.
   * @param enableDataAutoRefresh - The current value of the data auto refresh flag.
   * @returns A Promise that resolves when the user preference is updated.
   */
  toggleDataAutoRefresh = async (enableDataAutoRefresh: boolean): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_DATA_AUTO_REFRESH,
      enableDataAutoRefresh
    );

    reduxStore.dispatch(settingsActions.setEnableDataAutoRefresh(enableDataAutoRefresh));
  };

  // OBJECT INFO SETTINGS
  /**
   * Safely parses a JSON string into an array of ObjectInfoSetting objects.
   * If parsing fails, it returns the provided default value.
   *
   * @param value - The JSON string to parse.
   * @param defaultValue - The default value to return if parsing fails.
   * @returns An array of ObjectInfoSetting objects.
   */
  jsonParseWithDefault = (
    value: string,
    defaultValue: ObjectInfoSetting[]
  ): ObjectInfoSetting[] => {
    try {
      return JSON.parse(value) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  /**
   * Translates the object info settings by replacing the keys with their corresponding translated values.
   *
   * @param settings - The array of object info settings to be translated.
   * @returns The array of object info settings with translated keys.
   */
  translateObjectInfoByKey = (settings: ObjectInfoSetting[]): ObjectInfoSetting[] =>
    settings.map(setting => ({
      ...setting,
      showToggle: true,
      item: i18n.t(OBJECT_INFO_KEY_VALUE[setting.key as keyof typeof OBJECT_INFO_KEY_VALUE]),
    }));

  /**
   * Loads the settings from the user's preference and dispatches the corresponding action.
   * @param preferenceKey - The key of the user's preference.
   * @param defaultValue - The default value for the settings.
   * @param action - The action to be dispatched with the loaded settings.
   */
  async loadSettings(
    preferenceKey: string,
    defaultValue: ObjectInfoSetting[],
    action: (
      settings: ObjectInfoSetting[]
    ) => LoadSidePanelObjectInfoSettingAction | LoadWorksheetObjectInfoSettingAction
  ): Promise<void> {
    const { value } = await userRestService.getUserPreference(preferenceKey);
    const settings = this.jsonParseWithDefault(value, defaultValue);
    reduxStore.dispatch(action(this.translateObjectInfoByKey(settings)));
  }

  /**
   * Initializes the object info settings for the side panel and worksheet.
   */
  @initializationErrorDecorator.initializationWrapper
  async initObjectInfoSettings(): Promise<void> {
    const { sidePanelObjectInfoSettings, worksheetObjectInfoSettings } =
      reduxStore.getState().settingsReducer;

    // Load side panel object info settings
    await this.loadSettings(
      UserPreferenceKey.EXCEL_OBJECT_INFO_SIDE_PANEL_PREFERENCES,
      sidePanelObjectInfoSettings,
      settingsActions.loadSidePanelObjectInfoSettings
    );

    // Load worksheet object info settings
    await this.loadSettings(
      UserPreferenceKey.EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES,
      worksheetObjectInfoSettings,
      settingsActions.loadWorksheetObjectInfoSettings
    );
  }

  /**
   * Returns the updated settings string based on the provided settings and setting value.
   *
   * @param settings - The array of ObjectInfoSetting objects representing the settings.
   * @param settingValue - The KeyValue object or boolean value representing the setting value.
   * @returns The updated settings string.
   */
  getUpdatedSettingsString = (
    settings: ObjectInfoSetting[],
    settingValue: KeyValue | boolean
  ): string => {
    // For main toggle
    if (typeof settingValue === 'boolean') {
      return JSON.stringify(
        settings.map((setting: ObjectInfoSetting) => ({
          key: setting.key,
          toggleChecked: settingValue,
        }))
      );
    }

    // For individual toggle
    return JSON.stringify(
      settings.map((setting: ObjectInfoSetting) => {
        if (setting.key === settingValue.key) {
          return { key: setting.key, toggleChecked: settingValue.value };
        }
        return {
          key: setting.key,
          toggleChecked: setting.toggleChecked,
        };
      })
    );
  };

  /**
   * Toggles the side panel object info setting and updates the user preference.
   *
   * @param value - The new value for the setting.
   * @param key - The key of the setting.
   */
  toggleSidePanelObjectInfoSetting = async (value: boolean, key: string): Promise<void> => {
    const sidePanelSettings = reduxStore.getState().settingsReducer.sidePanelObjectInfoSettings;

    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_OBJECT_INFO_SIDE_PANEL_PREFERENCES,
      encodeURI(
        this.getUpdatedSettingsString(sidePanelSettings, {
          key,
          value,
        })
      )
    );

    reduxStore.dispatch(settingsActions.toggleSidePanelObjectInfoSetting({ key, value }));
  };

  /**
   * Toggles the main side panel object info setting and updates the user preference.
   *
   * @param value - The new value for the main side panel object info setting.
   */
  toggleMainSidePanelObjectInfoSetting = async (value: boolean): Promise<void> => {
    const sidePanelSettings = reduxStore.getState().settingsReducer.sidePanelObjectInfoSettings;

    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_OBJECT_INFO_SIDE_PANEL_PREFERENCES,
      encodeURI(this.getUpdatedSettingsString(sidePanelSettings, value))
    );

    reduxStore.dispatch(settingsActions.toggleMainSidePanelObjectInfoSetting(value));
  };

  /**
   * Toggles the worksheet object info setting and updates the user preference.
   *
   * @param value - The new value for the setting.
   * @param key - The key of the setting.
   */
  toggleWorksheetObjectInfoSetting = async (value: boolean, key: string): Promise<void> => {
    const worksheetSettings = reduxStore.getState().settingsReducer.worksheetObjectInfoSettings;

    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES,
      encodeURI(this.getUpdatedSettingsString(worksheetSettings, { key, value }))
    );

    reduxStore.dispatch(settingsActions.toggleWorksheetObjectInfoSetting({ key, value }));
  };

  /**
   * Toggles the main worksheet object info setting and updates the user preference.
   *
   * @param value - The new value for the setting.
   */
  toggleMainWorksheetObjectInfoSetting = async (value: boolean): Promise<void> => {
    const worksheetSettings = reduxStore.getState().settingsReducer.worksheetObjectInfoSettings;

    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES,
      encodeURI(this.getUpdatedSettingsString(worksheetSettings, value))
    );

    reduxStore.dispatch(settingsActions.toggleMainWorksheetObjectInfoSetting(value));
  };

  /**
   * Orders the worksheet object info settings based on the provided keys and updates the user preference.
   *
   * @param worksheetObjectInfoKeys - The keys used to order the settings.
   */
  orderWorksheetObjectInfoSettings = async (worksheetObjectInfoKeys: string[]): Promise<void> => {
    const worksheetSettings = reduxStore.getState().settingsReducer.worksheetObjectInfoSettings;

    const orderedList = worksheetObjectInfoKeys.reduce((acc, key) => {
      const item = worksheetSettings.find(i => i.key === key);
      if (item) {
        acc.push({
          ...item,
        });
      }
      return acc;
    }, []);

    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES,
      encodeURI(JSON.stringify(orderedList))
    );

    reduxStore.dispatch(settingsActions.loadWorksheetObjectInfoSettings(orderedList));
  };

  // PAGEBY SETTING
  /**
   * Updates the worksheet naming settings value
   * @param worksheetNamingOption - worksheet naming value.
   */
  async handleWorksheetNamingChange(
    worksheetNamingOption: ObjectAndWorksheetNamingOption
  ): Promise<void> {
    reduxStore.dispatch(settingsActions.setWorksheetNamingSetting(worksheetNamingOption));
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_PAGE_BY_AND_WORKSHEET_NAMING,
      worksheetNamingOption
    );
  }

  /**
   * Updates the page-by display settings value
   * @param pageByDisplayType - page-by display value.
   */
  async handlePageByDisplayChange(pageByDisplayType: PageByDisplayType): Promise<void> {
    reduxStore.dispatch(settingsActions.setPageByDisplaySetting(pageByDisplayType));
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_PAGE_BY_SELECTION,
      pageByDisplayType
    );
  }

  /**
   * Initializes the page by display option
   * Retrieves the user preference for the page by display from the userRestService,
   * updates the redux store with the retrieved value.
   */
  @initializationErrorDecorator.initializationWrapper
  async initPageByDisplayAnswers(): Promise<void> {
    const { value } = await userRestService.getUserPreference(
      UserPreferenceKey.EXCEL_PAGE_BY_SELECTION
    );
    reduxStore.dispatch(settingsActions.setPageByDisplaySetting(value));
  }

  /**
   * Initializes the worksheet naming option
   * Retrieves the user preference for the worksheet naming from the userRestService,
   * updates the redux store with the retrieved value.
   */
  @initializationErrorDecorator.initializationWrapper
  async initWorksheetNamingAnswers(): Promise<void> {
    const { value } = await userRestService.getUserPreference(
      UserPreferenceKey.EXCEL_PAGE_BY_AND_WORKSHEET_NAMING
    );
    reduxStore.dispatch(settingsActions.setWorksheetNamingSetting(value));
  }

  /**
   * Initialize data auto refresh value.
   * Fetches preference value from server and sets it to the store.
   */
  @initializationErrorDecorator.initializationWrapper
  async initDataAutoRefreshSetting(): Promise<void> {
    const { value } = await userRestService.getUserPreference(
      UserPreferenceKey.EXCEL_DATA_AUTO_REFRESH
    );
    reduxStore.dispatch(settingsActions.setEnableDataAutoRefresh(value === 'true'));
  }

  // SETTINGS PANEL SECTIONS
  /**
   * Returns the settings section for the prompt settings.
   * @param reusePromptAnswers - A boolean indicating whether to reuse prompt answers.
   * @returns The settings section for the prompt settings.
   */
  getPromptSection = (reusePromptAnswers: boolean): SettingsSection => ({
    key: 'prompt-settings',
    label: i18n.t('Prompt'),
    initialExpand: false,
    settingsGroups: [
      {
        key: 'prompt-settings',
        type: SettingPanelSection.SWITCH,
        onSwitch: this.toggleReusePromptAnswers,
        settings: [
          {
            key: 'reuse-prompt-answers',
            label: i18n.t('Reuse Prompt Answers'),
            value: reusePromptAnswers,
            description: i18n.t(
              'When this function is enabled, previously given answers to prompts will be shared automatically across dashboards and reports.'
            ),
          },
        ],
      },
    ],
  });

  /**
   * Returns the settings section for the data refresh settings.
   * @param enableDataAutoRefresh  A boolean indicating whether to enabla data auto refresh.
   * @returns The settings section for the data refresh settings.
   */
  getAutoRefreshSection = (enableDataAutoRefresh: boolean): SettingsSection => ({
    key: 'auto-refresh-settings',
    label: i18n.t('Data Refresh'),
    initialExpand: false,
    settingsGroups: [
      {
        key: 'auto-refresh-settings',
        type: SettingPanelSection.SWITCH,
        onSwitch: this.toggleDataAutoRefresh,
        settings: [
          {
            key: 'enable-auto-refresh-settings',
            label: i18n.t('Auto Refresh'),
            value: enableDataAutoRefresh,
            description: i18n.t(
              'If enabled, the data will be automatically refreshed each time you open the Excel document.'
            ),
          },
        ],
      },
    ],
  });

  /**
   * Returns a settings section for object information.
   *
   * @param sidePanelObjectInfoSettings - The settings for the side panel object information.
   * @param worksheetObjectInfoSettings - The settings for the worksheet object information.
   * @param sidePanelMainSwitchValue - The value of the main switch for the side panel object information.
   * @param worksheetMainSwitchValue - The value of the main switch for the worksheet object information.
   * @returns The settings section for object information.
   */
  getObjectInfoSection = (
    sidePanelObjectInfoSettings: ObjectInfoSetting[],
    worksheetObjectInfoSettings: ObjectInfoSetting[],
    sidePanelMainSwitchValue: boolean,
    worksheetMainSwitchValue: boolean
  ): SettingsSection => ({
    key: 'object-info-settings',
    label: i18n.t('Object Information'),
    initialExpand: false,
    settingsGroups: [
      {
        key: 'object-info-side-panel',
        type: SettingPanelSection.LIST_GROUP,
        label: i18n.t('Side panel details'),
        info: i18n.t(
          'Always visible on the side panel: Object Name, Source Name, Type, Attributes, Metrics, Filters, Table Size, Page-By Information'
        ),
        showMainSwitch: true,
        mainSwitchValue: sidePanelMainSwitchValue,
        onMainSwitch: this.toggleMainSidePanelObjectInfoSetting,
        onListItemSwitchChange: this.toggleSidePanelObjectInfoSetting,
        settings: sidePanelObjectInfoSettings,
      },
      {
        key: 'object-info-worksheet',
        type: SettingPanelSection.LIST_GROUP,
        label: i18n.t('Worksheet details'),
        showMainSwitch: true,
        mainSwitchValue: worksheetMainSwitchValue,
        dragEnabled: true,
        onMainSwitch: this.toggleMainWorksheetObjectInfoSetting,
        onOrderChange: this.orderWorksheetObjectInfoSettings,
        onListItemSwitchChange: this.toggleWorksheetObjectInfoSetting,
        settings: worksheetObjectInfoSettings,
      },
    ],
  });

  /**
   * Returns the settings section for the worksheet naming settings.
   * @param objectAndWorksheetNamingSetting - worksheet naming value.
   * @returns The settings section for the worksheet naming settings.
   */
  getPageBySection = (
    objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption,
    pageByDisplayType: PageByDisplayType
  ): SettingsSection => ({
    key: 'page-by-section',
    label: i18n.t('Page-By'),
    initialExpand: false,
    settingsGroups: [
      {
        key: 'object-and-worksheet-naming-section',
        label: i18n.t('Object and Worksheet Naming'),
        type: SettingPanelSection.RADIO,
        selectedOption: objectAndWorksheetNamingSetting,
        onChange: this.handleWorksheetNamingChange,
        settings: [
          {
            key: ObjectAndWorksheetNamingOption.PAGE_NAME,
            label: i18n.t('Use page name'),
            description: '“West, January”, “West, February”',
          },
          {
            key: ObjectAndWorksheetNamingOption.REPORT_NAME,
            label: i18n.t('Use source report name'),
            description: '“Sales Report”, “Sales Report2”',
          },
          {
            key: ObjectAndWorksheetNamingOption.REPORT_NAME_AND_PAGE_NAME,
            label: i18n.t('Use source report name and page name'),
            description: '“Sales Report - West, January”, “Sales Report - West, February”',
          },
          {
            key: ObjectAndWorksheetNamingOption.PAGE_NAME_AND_REPORT_NAME,
            label: i18n.t('Use page name and source report name'),
            description: '“West, January - Sales Report”, “West, February - Sales Report”',
          },
        ],
      },
      {
        key: 'page-by-display-section',
        label: i18n.t('Page-by Display'),
        type: SettingPanelSection.RADIO,
        selectedOption: pageByDisplayType,
        onChange: this.handlePageByDisplayChange,
        settings: [
          {
            key: PageByDisplayType.SELECT_PAGES,
            label: i18n.t('Prompt to select pages'),
          },
          {
            key: PageByDisplayType.DEFAULT_PAGE,
            label: i18n.t('Import default page'),
          },
          {
            key: PageByDisplayType.ALL_PAGES,
            label: i18n.t('Import all pages'),
          },
        ],
      },
    ],
  });
}
export const settingsSidePanelHelper = new SettingsSidePanelHelper();

/**
 * Gets the initial value of boolean setting preference. Assumes the received from the server value is "0" or "1" or "true" or "false".
 * @param preferenceKey name of the preference
 * @returns A Promise that resolves with the boolean value of the preference.
 */
export const getBooleanUserPreference = async (
  preferenceKey: UserPreferenceKey
): Promise<boolean> => {
  const { value } = await userRestService.getUserPreference(preferenceKey);
  return !Number.isNaN(+value) ? !!parseInt(value, 10) : JSON.parse(value);
};
