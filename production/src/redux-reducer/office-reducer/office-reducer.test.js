import { createStore } from 'redux';

import { officeProperties } from './office-properties';
import { officeReducer } from './office-reducer';

describe('officeReducer', () => {
  const officeStore = createStore(officeReducer);

  beforeEach(() => {
    // default state should be empty
    expect(officeStore.getState()).toEqual({
      shouldRenderSettings: false,
      isSettings: false,
      isConfirm: false,
      supportForms: true,
      activeCellAddress: null,
      popupData: null,
      isDialogOpen: false,
      isDialogLoaded: false,
      settingsPanelLoaded: false,
      isShapeAPISupported: false,
      reusePromptAnswers: false,
    });
  });

  it('should set address of active cell on setActiveCellAddress', () => {
    // given
    const prevState = { activeCellAddress: null };
    const action = {
      type: officeProperties.actions.setActiveCellAddress,
      activeCellAddress: 'A1',
    };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.activeCellAddress).toBe('A1');
  });

  it('should set isDialogOpen to true on showDialog', () => {
    // given
    const prevState = { isDialogOpen: false };
    const action = { type: officeProperties.actions.showDialog };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.isDialogOpen).toBe(true);
  });

  it('should set isDialogOpen to false on hideDialog', () => {
    // given
    const prevState = { isDialogOpen: true };
    const action = { type: officeProperties.actions.hideDialog };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.isDialogOpen).toBe(false);
  });

  it('should set given value to isDialogLoaded on setIsDialogLoaded', () => {
    // given
    const prevState = { isDialogLoaded: false };
    const action = {
      type: officeProperties.actions.setIsDialogLoaded,
      isDialogLoaded: true,
    };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.isDialogLoaded).toBe(true);
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
});
