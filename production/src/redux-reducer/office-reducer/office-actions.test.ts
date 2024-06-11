import { OfficeActionsTypes } from './office-reducer-types';

import { officeActions } from './office-actions';

describe('Office Actions', () => {
  it('should dispatch proper toggleStoreSecuredFlag action', () => {
    // given

    const listener = jest.fn();

    // when
    officeActions.toggleSecuredFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({
      type: OfficeActionsTypes.TOGGLE_SECURED_FLAG,
      isSecured: true,
    });
  });

  it('should dispatch proper toggleIsSettingsFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    officeActions.toggleIsSettingsFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({
      type: OfficeActionsTypes.TOGGLE_IS_SETTINGS_FLAG,
      isSettings: true,
    });
  });

  it('should dispatch proper toggleIsConfirmFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    officeActions.toggleIsConfirmFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({
      type: OfficeActionsTypes.TOGGLE_IS_CONFIRM_FLAG,
      isConfirm: true,
    });
  });

  it('should dispatch proper toggleSettingsPanelLoadedFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    officeActions.toggleSettingsPanelLoadedFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({
      type: OfficeActionsTypes.TOGGLE_SETTINGS_PANEL_LOADED_FLAG,
      settingsPanelLoded: true,
    });
  });

  it('should dispatch proper toggleReusePromptAnswersFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    officeActions.toggleReusePromptAnswersFlag(false)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({
      type: OfficeActionsTypes.TOGGLE_REUSE_PROMPT_ANSWERS_FLAG,
      reusePromptAnswers: false,
    });
  });

  it('should dispatch proper toggleRenderSettingsFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    officeActions.toggleRenderSettingsFlag()(listener);

    // then
    expect(listener).toHaveBeenCalledWith({
      type: OfficeActionsTypes.TOGGLE_RENDER_SETTINGS_FLAG,
    });
  });

  it('should dispatch proper toggleIsClearDataFailedFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    officeActions.toggleIsClearDataFailedFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({
      type: OfficeActionsTypes.TOGGLE_IS_CLEAR_DATA_FAILED_FLAG,
      isClearDataFailed: true,
    });
  });
});
