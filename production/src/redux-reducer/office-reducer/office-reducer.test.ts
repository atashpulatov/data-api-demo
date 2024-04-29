import { createStore } from 'redux';

import {
  HideDialogAction,
  OfficeActionsTypes,
  SetActiveCellAddressAction,
  SetIsDialogLoadedAction,
  ShowDialogAction,
  ToggleIsClearDataFailedFlagAction,
  ToggleIsConfirmFlagAction,
  ToggleIsSettingsFlagAction,
  TogglePivotTableSupportedFlagAction,
  ToggleRenderSettingsFlagAction,
  ToggleReusePromptAnswersFlagAction,
  ToggleSecuredFlagAction,
  ToggleSettingsPanelLoadedFlagAction,
} from './office-reducer-types';

import { officeReducer } from './office-reducer';

describe('officeReducer', () => {
  const officeStore = createStore(officeReducer as any);

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
      isInsertWorksheetAPISupported: false,
      reusePromptAnswers: false,
      isClearDataFailed: false,
      isSecured: false,
      isPivotTableSupported: false,
    });
  });

  it('should set address of active cell on setActiveCellAddress', () => {
    // given
    const prevState: any = { activeCellAddress: null };
    const action: SetActiveCellAddressAction = {
      type: OfficeActionsTypes.SET_ACTIVE_CELL_ADDRESS,
      activeCellAddress: 'A1',
    };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.activeCellAddress).toBe('A1');
  });

  it('should set isDialogOpen to true on showDialog', () => {
    // given
    const prevState: any = { isDialogOpen: false };
    const action: ShowDialogAction = { type: OfficeActionsTypes.SHOW_DIALOG };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.isDialogOpen).toBe(true);
  });

  it('should set isDialogOpen to false on hideDialog', () => {
    // given
    const prevState: any = { isDialogOpen: true };
    const action: HideDialogAction = { type: OfficeActionsTypes.HIDE_DIALOG };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.isDialogOpen).toBe(false);
  });

  it('should set given value to isDialogLoaded on setIsDialogLoaded', () => {
    // given
    const prevState: any = { isDialogLoaded: false };
    const action: SetIsDialogLoadedAction = {
      type: OfficeActionsTypes.SET_IS_DIALOG_LOADED,
      isDialogLoaded: true,
    };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.isDialogLoaded).toBe(true);
  });

  it('should return new proper state in case of toggleSecuredFlag action', () => {
    // given
    const oldState: any = { isSecured: false };
    const action: ToggleSecuredFlagAction = {
      type: OfficeActionsTypes.TOGGLE_SECURED_FLAG,
      isSecured: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSecured: true });
  });

  it('should return new proper state in case of toggleIsSettingsFlag action', () => {
    // given
    const oldState: any = { isSettings: false };
    const action: ToggleIsSettingsFlagAction = {
      type: OfficeActionsTypes.TOGGLE_IS_SETTINGS_FLAG,
      isSettings: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSettings: true });
  });

  it('should return new proper state in case of toggleIsConfirmFlag action', () => {
    // given
    const oldState: any = { isConfirm: false, isSettings: false };
    const action: ToggleIsConfirmFlagAction = {
      type: OfficeActionsTypes.TOGGLE_IS_CONFIRM_FLAG,
      isConfirm: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isConfirm: true, isSettings: false });
  });

  it('should return new proper state in case of toggleRenderSettingsFlag action', () => {
    // given
    const oldState: any = { isSettings: false, shouldRenderSettings: false };
    const action: ToggleRenderSettingsFlagAction = {
      type: OfficeActionsTypes.TOGGLE_RENDER_SETTINGS_FLAG,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSettings: false, shouldRenderSettings: true });
  });

  it('should set IsClearDataFailed to given value on toggleIsClearDataFailedFlag', () => {
    // given
    const oldState: any = { isClearDataFailed: false };
    const action: ToggleIsClearDataFailedFlagAction = {
      type: OfficeActionsTypes.TOGGLE_IS_CLEAR_DATA_FAILED_FLAG,
      isClearDataFailed: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState.isClearDataFailed).toBe(true);
  });

  it('should set settingsPanelLoaded to given value on toggleSettingsPanelLoadedFlag', () => {
    // given
    const oldState: any = { settingsPanelLoaded: false };
    const action: ToggleSettingsPanelLoadedFlagAction = {
      type: OfficeActionsTypes.TOGGLE_SETTINGS_PANEL_LOADED_FLAG,
      settingsPanelLoaded: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState.settingsPanelLoaded).toBe(true);
  });

  it('should set settingsPanelLoaded to given value on toggleReusePromptAnswersFlag', () => {
    // given
    const oldState: any = { reusePromptAnswers: false };
    const action: ToggleReusePromptAnswersFlagAction = {
      type: OfficeActionsTypes.TOGGLE_REUSE_PROMPT_ANSWERS_FLAG,
      reusePromptAnswers: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState.reusePromptAnswers).toBe(true);
  });

  it('should return proper state in case of toggleImportAsPivotTableFlag action', () => {
    // given
    const oldState: any = { isPivotTableSupported: false };
    const action: TogglePivotTableSupportedFlagAction = {
      type: OfficeActionsTypes.TOGGLE_PIVOT_TABLE_FLAG,
      isPivotTableSupported: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isPivotTableSupported: true });
  });
});
