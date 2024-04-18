import { SettingPanelSection, SettingsSection } from '@mstr/connector-components';

import { userRestService } from '../../home/user-rest-service';

import { reduxStore } from '../../store';

import {
  KeyValue,
  LoadSidePanelObjectInfoSettingAction,
  LoadWorksheetObjectInfoSettingAction,
  ObjectInfoSetting,
} from '../../redux-reducer/settings-reducer/settings-reducer-types';

import i18n from '../../i18n';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { settingsActions } from '../../redux-reducer/settings-reducer/settings-actions';

const EXCEL_REUSE_PROMPT_ANSWERS = 'excelReusePromptAnswers';
const EXCEL_OBJECT_INFO_SIDE_PANEL_PREFERENCES = 'excelObjectInfoSidePanelPreferences';
const EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES = 'excelObjectInfoWorksheetPreferences';

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
  initReusePromptAnswers = async (): Promise<void> => {
    const { value } = await userRestService.getUserPreference(EXCEL_REUSE_PROMPT_ANSWERS);
    const reusePromptAnswersFlag = !Number.isNaN(+value)
      ? !!parseInt(value, 10)
      : JSON.parse(value);

    reduxStore.dispatch(officeActions.toggleReusePromptAnswersFlag(reusePromptAnswersFlag) as any);
  };

  /**
   * Toggles the reuse prompt answers flag and updates the user preference.
   * @param reusePromptAnswers - The current value of the reuse prompt answers flag.
   * @returns A Promise that resolves when the user preference is updated.
   */
  toggleReusePromptAnswers = async (reusePromptAnswers: boolean): Promise<void> => {
    await userRestService.setUserPreference(EXCEL_REUSE_PROMPT_ANSWERS, reusePromptAnswers);

    reduxStore.dispatch(officeActions.toggleReusePromptAnswersFlag(reusePromptAnswers) as any);
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
   * Loads the settings from the user's preference and dispatches the corresponding action.
   * @param preferenceKey - The key of the user's preference.
   * @param defaultValue - The default value for the settings.
   * @param action - The action to be dispatched with the loaded settings.
   */
  loadSettings = async (
    preferenceKey: string,
    defaultValue: ObjectInfoSetting[],
    action: (
      settings: ObjectInfoSetting[]
    ) => LoadSidePanelObjectInfoSettingAction | LoadWorksheetObjectInfoSettingAction
  ): Promise<void> => {
    const { value } = await userRestService.getUserPreference(preferenceKey);
    const settings = this.jsonParseWithDefault(value, defaultValue);
    reduxStore.dispatch(action(settings));
  };

  /**
   * Initializes the object info settings for the side panel and worksheet.
   */
  initObjectInfoSettings = async (): Promise<void> => {
    const { sidePanelObjectInfoSettings, worksheetObjectInfoSettings } =
      reduxStore.getState().settingsReducer;

    // Load side panel object info settings
    await this.loadSettings(
      EXCEL_OBJECT_INFO_SIDE_PANEL_PREFERENCES,
      sidePanelObjectInfoSettings,
      settingsActions.loadSidePanelObjectInfoSettings
    );

    // Load worksheet object info settings
    await this.loadSettings(
      EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES,
      worksheetObjectInfoSettings,
      settingsActions.loadWorksheetObjectInfoSettings
    );
  };

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
          ...setting,
          toggleChecked: settingValue,
        }))
      );
    }

    // For individual toggle
    return JSON.stringify(
      settings.map((setting: ObjectInfoSetting) => {
        if (setting.key === settingValue.key) {
          return { ...setting, toggleChecked: settingValue.value };
        }
        return setting;
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
      EXCEL_OBJECT_INFO_SIDE_PANEL_PREFERENCES,
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
      EXCEL_OBJECT_INFO_SIDE_PANEL_PREFERENCES,
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
      EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES,
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
      EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES,
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
        acc.push(item);
      }
      return acc;
    }, [] as ObjectInfoSetting[]);

    await userRestService.setUserPreference(
      EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES,
      encodeURI(JSON.stringify(orderedList))
    );

    reduxStore.dispatch(settingsActions.loadWorksheetObjectInfoSettings(orderedList));
  };

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
}
export const settingsSidePanelHelper = new SettingsSidePanelHelper();
