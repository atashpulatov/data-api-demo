import { createStore } from 'redux';
import { officeReducer } from '../../../redux-reducer/office-reducer/office-reducer';
import { officeProperties } from '../../../redux-reducer/office-reducer/office-properties';
import { officeActions } from '../../../redux-reducer/office-reducer/office-actions';

describe('officeReducer', () => {
  const officeStore = createStore(officeReducer);

  beforeEach(() => {
    // default state should be empty
    expect(officeStore.getState()).toEqual({
      shouldRenderSettings: false,
      isSettings: false,
      isConfirm: false,
      supportForms: true,
      popupData: null,
      popupOpen: false,
      showHidden: true,
      reusePromptAnswers: false,
      settingsPanelLoaded: false,
    });
  });

  it('should set popupOpen to true on showPopup', () => {
    // given
    const prevState = { popupOpen: false };
    const action = { type: officeProperties.actions.showPopup };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.popupOpen).toBe(true);
  });

  it('should set popupOpen to false on hidePopup', () => {
    // given
    const prevState = { popupOpen: true };
    const action = { type: officeProperties.actions.hidePopup };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.popupOpen).toBe(false);
  });

  it('should return new proper state in case of toggleSecuredFlag action', () => {
    // given
    const oldState = { isSecured: false };
    const action = {
      type: officeProperties.actions.toggleSecuredFlag,
      isSecured: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSecured: true });
  });

  it('should return new proper state in case of toggleIsSettingsFlag action', () => {
    // given
    const oldState = { isSettings: false };
    const action = {
      type: officeProperties.actions.toggleIsSettingsFlag,
      isSettings: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSettings: true });
  });

  it('should return new proper state in case of toggleIsConfirmFlag action', () => {
    // given
    const oldState = { isConfirm: false, isSettings: false };
    const action = {
      type: officeProperties.actions.toggleIsConfirmFlag,
      isConfirm: true,
      isSettings: false,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isConfirm: true, isSettings: false });
  });

  it('should return new proper state in case of toggleRenderSettingsFlag action', () => {
    // given
    const oldState = { isSettings: false, shouldRenderSettings: false };
    const action = {
      type: officeProperties.actions.toggleRenderSettingsFlag,
      isSettings: false,
      shouldRenderSettings: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSettings: false, shouldRenderSettings: true });
  });

  it('should set IsClearDataFailed to given value on toggleIsClearDataFailedFlag', () => {
    // given
    const oldState = { isClearDataFailed: false };
    const action = {
      type: officeProperties.actions.toggleIsClearDataFailedFlag,
      isClearDataFailed: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState.isClearDataFailed).toBe(true);
  });

  it('should set settingsPanelLoaded to given value on toggleSettingsPanelLoadedFlag', () => {
    // given
    const oldState = { settingsPanelLoaded: false };
    const action = {
      type: officeProperties.actions.toggleSettingsPanelLoadedFlag,
      settingsPanelLoaded: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState.settingsPanelLoaded).toBe(true);
  });

  it('should set settingsPanelLoaded to given value on toggleReusePromptAnswersFlag', () => {
    // given
    const oldState = { reusePromptAnswers: false };
    const action = {
      type: officeProperties.actions.toggleReusePromptAnswersFlag,
      reusePromptAnswers: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState.reusePromptAnswers).toBe(true);
  });

  it('should set showHidden to false', () => {
    // given
    const oldState = { showHidden: true };
    const action = officeActions.setShowHidden(false);

    // when
    const newState = officeReducer(oldState, action);

    // then
    expect(newState.showHidden).toBe(false);
  });
});
