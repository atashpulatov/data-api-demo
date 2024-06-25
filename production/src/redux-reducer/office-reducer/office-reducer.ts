/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  OfficeActions,
  OfficeActionsTypes,
  OfficeState,
  SetActiveCellAddressAction,
  SetDialogToOpenAction,
  SetIsAdvancedWorksheetTrackingSupported,
  SetIsDialogLoadedAction,
  SetIsInsertWorksheetAPISupportedAction,
  SetIsOverviewWindowAPISupportedAction,
  SetIsPivotTableSupported,
  SetIsShapeAPISupportedAction,
  SetPopupDataAction,
  ToggleIsClearDataFailedFlagAction,
  ToggleIsConfirmFlagAction,
  ToggleIsSettingsFlagAction,
  TogglePivotTableSupportedFlagAction,
  ToggleReusePromptAnswersFlagAction,
  ToggleSecuredFlagAction,
} from './office-reducer-types';

const initialState: OfficeState = {
  isConfirm: false,
  isSettings: false,
  supportForms: true,
  activeCellAddress: null,
  popupData: null,
  isDialogOpen: false,
  isDialogLoaded: false,
  dialogToOpen: null,
  settingsPanelLoaded: false,
  reusePromptAnswers: false,
  isSecured: false,
  isClearDataFailed: false,
  isShapeAPISupported: false,
  isOverviewWindowAPISupported: false,
  isInsertWorksheetAPISupported: false,
  isPivotTableSupported: false,
  isAdvancedWorksheetTrackingSupported: false,
};

// eslint-disable-next-line default-param-last
export const officeReducer = (state = initialState, action: OfficeActions): OfficeState => {
  switch (action.type) {
    case OfficeActionsTypes.SHOW_DIALOG:
      return onShowDialog(state);

    case OfficeActionsTypes.HIDE_DIALOG:
      return onHideDialog(state);

    case OfficeActionsTypes.SET_IS_DIALOG_LOADED:
      return setIsDialogLoaded(state, action);

    case OfficeActionsTypes.SET_DIALOG_TO_OPEN:
      return setDialogToOpen(state, action);

    case OfficeActionsTypes.TOGGLE_SECURED_FLAG:
      return toggleSecuredFlag(state, action);

    case OfficeActionsTypes.TOGGLE_IS_SETTINGS_FLAG:
      return toggleIsSettingsFlag(state, action);

    case OfficeActionsTypes.TOGGLE_IS_CONFIRM_FLAG:
      return toggleIsConfirmFlag(state, action);

    case OfficeActionsTypes.TOGGLE_IS_CLEAR_DATA_FAILED_FLAG:
      return toggleIsClearDataFailedFlag(state, action);

    case OfficeActionsTypes.TOGGLE_SETTINGS_PANEL_LOADED_FLAG:
      return toggleSettingsPanelLoadedFlag(state);

    case OfficeActionsTypes.TOGGLE_REUSE_PROMPT_ANSWERS_FLAG:
      return toggleReusePromptAnswersFlag(state, action);

    case OfficeActionsTypes.TOGGLE_PIVOT_TABLE_FLAG:
      return toggleImportAsPivotTableFlag(state, action);

    case OfficeActionsTypes.SET_ACTIVE_CELL_ADDRESS:
      return setActiveCellAddress(state, action);

    case OfficeActionsTypes.SET_POPUP_DATA:
      return setPopupData(state, action);

    case OfficeActionsTypes.CLEAR_POPUP_DATA:
      return clearPopupData(state);

    case OfficeActionsTypes.SET_SHAPE_API_SUPPORTED:
      return setIsShapeAPISupported(state, action);

    case OfficeActionsTypes.SET_OVERVIEW_WINDOW_API_SUPPORTED:
      return setIsOverviewWindowAPISupported(state, action);

    case OfficeActionsTypes.SET_INSERT_WORKSHEET_API_SUPPORTED:
      return setIsInsertWorksheetAPISupported(state, action);

    case OfficeActionsTypes.SET_PIVOT_TABLE_SUPPORTED:
      return setIsPivotTableSupported(state, action);

    case OfficeActionsTypes.SET_ADVANCED_WORKSHEET_TRACKING_SUPPORTED:
      return setIsAdvancedWorksheetTrackingSupported(state, action);

    default:
      break;
  }
  return state;
};

function onShowDialog(state: OfficeState): OfficeState {
  return {
    ...state,
    isDialogOpen: true,
  };
}

function onHideDialog(state: OfficeState): OfficeState {
  return {
    ...state,
    isDialogOpen: false,
  };
}

function setIsDialogLoaded(state: OfficeState, action: SetIsDialogLoadedAction): OfficeState {
  return {
    ...state,
    isDialogLoaded: action.isDialogLoaded,
  };
}

const setDialogToOpen = (state: OfficeState, action: SetDialogToOpenAction): OfficeState => ({
  ...state,
  dialogToOpen: action.dialogToOpen,
});

function toggleSecuredFlag(state: OfficeState, action: ToggleSecuredFlagAction): OfficeState {
  const { isSecured } = action;

  return {
    ...state,
    isSecured,
  };
}

function toggleIsSettingsFlag(state: OfficeState, action: ToggleIsSettingsFlagAction): OfficeState {
  return {
    ...state,
    isSettings: action.isSettings,
  };
}

function toggleIsConfirmFlag(state: OfficeState, action: ToggleIsConfirmFlagAction): OfficeState {
  return {
    ...state,
    isConfirm: action.isConfirm,
    isSettings: false,
  };
}

function toggleIsClearDataFailedFlag(
  state: OfficeState,
  action: ToggleIsClearDataFailedFlagAction
): OfficeState {
  const { isClearDataFailed } = action;
  return {
    ...state,
    isClearDataFailed,
  };
}

function toggleSettingsPanelLoadedFlag(state: OfficeState): OfficeState {
  return {
    ...state,
    settingsPanelLoaded: !state.settingsPanelLoaded,
  };
}

function toggleReusePromptAnswersFlag(
  state: OfficeState,
  action: ToggleReusePromptAnswersFlagAction
): OfficeState {
  return {
    ...state,
    reusePromptAnswers: action.reusePromptAnswers,
  };
}

function toggleImportAsPivotTableFlag(
  state: OfficeState,
  action: TogglePivotTableSupportedFlagAction
): OfficeState {
  return {
    ...state,
    isPivotTableSupported: action.isPivotTableSupported,
  };
}

function setActiveCellAddress(state: OfficeState, action: SetActiveCellAddressAction): OfficeState {
  return {
    ...state,
    activeCellAddress: action.activeCellAddress,
  };
}

function setPopupData(state: OfficeState, action: SetPopupDataAction): OfficeState {
  return {
    ...state,
    popupData: action.popupData,
  };
}

function clearPopupData(state: OfficeState): OfficeState {
  return {
    ...state,
    popupData: null,
  };
}

function setIsShapeAPISupported(
  state: OfficeState,
  action: SetIsShapeAPISupportedAction
): OfficeState {
  return {
    ...state,
    isShapeAPISupported: action.isShapeAPISupported,
  };
}

function setIsOverviewWindowAPISupported(
  state: OfficeState,
  action: SetIsOverviewWindowAPISupportedAction
): OfficeState {
  return {
    ...state,
    isOverviewWindowAPISupported: action.isOverviewWindowAPISupported,
  };
}

function setIsInsertWorksheetAPISupported(
  state: OfficeState,
  action: SetIsInsertWorksheetAPISupportedAction
): OfficeState {
  return {
    ...state,
    isInsertWorksheetAPISupported: action.isInsertWorksheetAPISupported,
  };
}

function setIsPivotTableSupported(
  state: OfficeState,
  action: SetIsPivotTableSupported
): OfficeState {
  return {
    ...state,
    isPivotTableSupported: action.isPivotTableSupported,
  };
}

function setIsAdvancedWorksheetTrackingSupported(
  state: OfficeState,
  action: SetIsAdvancedWorksheetTrackingSupported
): OfficeState {
  return {
    ...state,
    isAdvancedWorksheetTrackingSupported: action.isAdvancedWorksheetTrackingSupported,
  };
}
