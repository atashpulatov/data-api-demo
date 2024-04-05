import { Action } from 'redux';

export type OfficeState = {
  isSecured: boolean;
  shouldRenderSettings: boolean;
  isClearDataFailed: boolean;
  isConfirm: boolean;
  isSettings: boolean;
  supportForms: boolean;
  activeCellAddress: string;
  popupData: any;
  isDialogOpen: boolean;
  isDialogLoaded: boolean;
  settingsPanelLoaded: boolean;
  reusePromptAnswers: boolean;
  isShapeAPISupported: boolean;
};

export enum OfficeActionsTypes {
  SHOW_DIALOG = 'OFFICE_SHOW_DIALOG',
  HIDE_DIALOG = 'OFFICE_HIDE_DIALOG',
  SET_IS_DIALOG_LOADED = 'OFFICE_SET_IS_DIALOG_LOADED',
  TOGGLE_SECURED_FLAG = 'OFFICE_TOGGLE_SECURED_FLAG',
  TOGGLE_IS_SETTINGS_FLAG = 'OFFICE_TOGGLE_IS_SETTINGS_FLAG',
  TOGGLE_IS_CONFIRM_FLAG = 'OFFICE_TOGGLE_IS_CONFIRM_FLAG',
  TOGGLE_RENDER_SETTINGS_FLAG = 'OFFICE_TOGGLE_RENDER_SETTINGS_FLAG',
  TOGGLE_IS_CLEAR_DATA_FAILED_FLAG = 'OFFICE_TOGGLE_IS_CLEAR_DATA_FAILED',
  TOGGLE_SETTINGS_PANEL_LOADED_FLAG = 'OFFICE_TOGGLE_SETTINGS_PANEL_LOADED_FLAG',
  TOGGLE_REUSE_PROMPT_ANSWERS_FLAG = 'OFFICE_TOGGLE_REUSE_PROMPT_ANSWERS_FLAG',
  SET_ACTIVE_CELL_ADDRESS = 'OFFICE_SET_ACTIVE_CELL_ADDRESS',
  SET_POPUP_DATA = 'OFFICE_SET_POPUP_DATA',
  CLEAR_POPUP_DATA = 'OFFICE_CLEAR_POPUP_DATA',
  SET_SHAPE_API_SUPPORTED = 'OFFICE_SET_SHAPE_API_SUPPORTED',
}

export interface ShowDialogAction extends Action {
  type: OfficeActionsTypes.SHOW_DIALOG;
}

export interface HideDialogAction extends Action {
  type: OfficeActionsTypes.HIDE_DIALOG;
}

export interface SetIsDialogLoadedAction extends Action {
  type: OfficeActionsTypes.SET_IS_DIALOG_LOADED;
  isDialogLoaded: boolean;
}

export interface ToggleSecuredFlagAction extends Action {
  type: OfficeActionsTypes.TOGGLE_SECURED_FLAG;
  isSecured: boolean;
}

export interface ToggleIsSettingsFlagAction extends Action {
  type: OfficeActionsTypes.TOGGLE_IS_SETTINGS_FLAG;
  isSettings: boolean;
}

export interface ToggleIsConfirmFlagAction extends Action {
  type: OfficeActionsTypes.TOGGLE_IS_CONFIRM_FLAG;
  isConfirm: boolean;
}

export interface ToggleRenderSettingsFlagAction extends Action {
  type: OfficeActionsTypes.TOGGLE_RENDER_SETTINGS_FLAG;
}

export interface ToggleIsClearDataFailedFlagAction extends Action {
  type: OfficeActionsTypes.TOGGLE_IS_CLEAR_DATA_FAILED_FLAG;
  isClearDataFailed: boolean;
}

export interface ToggleSettingsPanelLoadedFlagAction extends Action {
  type: OfficeActionsTypes.TOGGLE_SETTINGS_PANEL_LOADED_FLAG;
  settingsPanelLoaded: boolean;
}

export interface ToggleReusePromptAnswersFlagAction extends Action {
  type: OfficeActionsTypes.TOGGLE_REUSE_PROMPT_ANSWERS_FLAG;
  reusePromptAnswers: boolean;
}

export interface SetActiveCellAddressAction extends Action {
  type: OfficeActionsTypes.SET_ACTIVE_CELL_ADDRESS;
  activeCellAddress: string;
}

export interface SetPopupDataAction extends Action {
  type: OfficeActionsTypes.SET_POPUP_DATA;
  popupData?: any;
}

export interface ClearPopupDataAction extends Action {
  type: OfficeActionsTypes.CLEAR_POPUP_DATA;
}

export interface SetIsShapeAPISupportedAction extends Action {
  type: OfficeActionsTypes.SET_SHAPE_API_SUPPORTED;
  isShapeAPISupported: boolean;
}

export type OfficeActions =
  | ShowDialogAction
  | HideDialogAction
  | SetIsDialogLoadedAction
  | ToggleSecuredFlagAction
  | ToggleIsSettingsFlagAction
  | ToggleIsConfirmFlagAction
  | ToggleRenderSettingsFlagAction
  | ToggleIsClearDataFailedFlagAction
  | ToggleSettingsPanelLoadedFlagAction
  | ToggleReusePromptAnswersFlagAction
  | SetActiveCellAddressAction
  | SetPopupDataAction
  | ClearPopupDataAction
  | SetIsShapeAPISupportedAction;