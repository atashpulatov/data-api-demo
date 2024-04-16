import { SettingPanelSection, SettingsSection } from '@mstr/connector-components';

import { userRestService } from '../../home/user-rest-service';

import { reduxStore } from '../../store';

import i18n from '../../i18n';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';

const EXCEL_REUSE_PROMPT_ANSWERS = 'excelReusePromptAnswers';

class SettingsSidePanelHelper {
  /**
   * Toggles the settings panel loaded flag.
   *
   * @param settingsPanelLoded - A boolean indicating whether the settings panel is loaded or not.
   */
  toggleSettingsPanel(): void {
    const settingsPanelLoded = reduxStore.getState().officeReducer.settingsPanelLoaded;
    reduxStore.dispatch(officeActions.toggleSettingsPanelLoadedFlag(!settingsPanelLoded) as any);
  }

  /**
   * Toggles the reuse prompt answers flag and updates the user preference.
   * @param reusePromptAnswers - The current value of the reuse prompt answers flag.
   * @returns A Promise that resolves when the user preference is updated.
   */
  async toggleReusePromptAnswers(reusePromptAnswers: boolean): Promise<void> {
    await userRestService.setUserPreference(EXCEL_REUSE_PROMPT_ANSWERS, reusePromptAnswers);

    reduxStore.dispatch(officeActions.toggleReusePromptAnswersFlag(reusePromptAnswers) as any);
  }

  /**
   * Initializes the reuse prompt answers feature.
   * Retrieves the user preference for the reuse prompt answers flag from the userRestService,
   * updates the redux store with the retrieved value.
   * @returns A promise that resolves when the initialization is complete.
   */
  async initReusePromptAnswers(): Promise<void> {
    const { value } = await userRestService.getUserPreference(EXCEL_REUSE_PROMPT_ANSWERS);
    const reusePromptAnswersFlag = !Number.isNaN(+value)
      ? !!parseInt(value, 10)
      : JSON.parse(value);

    reduxStore.dispatch(officeActions.toggleReusePromptAnswersFlag(reusePromptAnswersFlag) as any);
  }

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
}
export const settingsSidePanelHelper = new SettingsSidePanelHelper();
