import { Dispatch } from 'react';

import {
  DialogToOpen,
  OfficeActionsTypes,
  SetActiveCellAddressAction,
  SetDialogToOpenAction,
  SetIsAdvancedWorksheetTrackingSupported,
  SetIsDialogLoadedAction,
  SetIsInsertWorksheetAPISupportedAction,
  SetIsOverviewWindowAPISupportedAction,
  SetIsPivotTableSupported,
  SetIsShapeAPISupportedAction,
  SetPopupDataAction,
  ShowDialogAction,
} from './office-reducer-types';

const showDialog = (): ShowDialogAction => ({ type: OfficeActionsTypes.SHOW_DIALOG });

const setIsDialogLoaded = (isDialogLoaded: boolean): SetIsDialogLoadedAction => ({
  type: OfficeActionsTypes.SET_IS_DIALOG_LOADED,
  isDialogLoaded,
});

const hideDialog = () => (dispatch: Dispatch<any>) => {
  dispatch(setIsDialogLoaded(false));
  dispatch({ type: OfficeActionsTypes.HIDE_DIALOG });
};

const setDialogToOpen = (dialogToOpen: DialogToOpen): SetDialogToOpenAction => ({
  type: OfficeActionsTypes.SET_DIALOG_TO_OPEN,
  dialogToOpen,
});

const toggleSecuredFlag = (isSecured: boolean) => (dispatch: Dispatch<any>) => {
  dispatch({
    type: OfficeActionsTypes.TOGGLE_SECURED_FLAG,
    isSecured,
  });
};

const toggleIsSettingsFlag = (isSettings: boolean) => (dispatch: Dispatch<any>) => {
  dispatch({
    type: OfficeActionsTypes.TOGGLE_IS_SETTINGS_FLAG,
    isSettings,
  });
};

const toggleIsConfirmFlag = (isConfirm: boolean) => (dispatch: Dispatch<any>) => {
  dispatch({ type: OfficeActionsTypes.TOGGLE_IS_CONFIRM_FLAG, isConfirm });
};

const toggleIsClearDataFailedFlag = (isClearDataFailed: boolean) => (dispatch: Dispatch<any>) => {
  dispatch({
    type: OfficeActionsTypes.TOGGLE_IS_CLEAR_DATA_FAILED_FLAG,
    isClearDataFailed,
  });
};

const toggleSettingsPanelLoadedFlag =
  (settingsPanelLoded: boolean) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: OfficeActionsTypes.TOGGLE_SETTINGS_PANEL_LOADED_FLAG,
      settingsPanelLoded,
    });
  };

const toggleReusePromptAnswersFlag = (reusePromptAnswers: boolean) => (dispatch: Dispatch<any>) => {
  dispatch({
    type: OfficeActionsTypes.TOGGLE_REUSE_PROMPT_ANSWERS_FLAG,
    reusePromptAnswers,
  });
};

const toggleImportAsPivotTableFlag =
  (isImportAsPivotTableSupported: boolean) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: OfficeActionsTypes.TOGGLE_PIVOT_TABLE_FLAG,
      isImportAsPivotTableSupported,
    });
  };

const setActiveCellAddress = (activeCellAddress: string): SetActiveCellAddressAction => ({
  type: OfficeActionsTypes.SET_ACTIVE_CELL_ADDRESS,
  activeCellAddress,
});

const setPopupData = (popupData: any): SetPopupDataAction => ({
  type: OfficeActionsTypes.SET_POPUP_DATA,
  popupData,
});

const clearPopupData = (): SetPopupDataAction => ({ type: OfficeActionsTypes.SET_POPUP_DATA });

const setIsShapeAPISupported = (isShapeAPISupported: boolean): SetIsShapeAPISupportedAction => ({
  type: OfficeActionsTypes.SET_SHAPE_API_SUPPORTED,
  isShapeAPISupported,
});

const setIsOverviewWindowAPISupported = (
  isOverviewWindowAPISupported: boolean
): SetIsOverviewWindowAPISupportedAction => ({
  type: OfficeActionsTypes.SET_OVERVIEW_WINDOW_API_SUPPORTED,
  isOverviewWindowAPISupported,
});

const setIsInsertWorksheetAPISupported = (
  isInsertWorksheetAPISupported: boolean
): SetIsInsertWorksheetAPISupportedAction => ({
  type: OfficeActionsTypes.SET_INSERT_WORKSHEET_API_SUPPORTED,
  isInsertWorksheetAPISupported,
});

const setIsPivotTableSupported = (isPivotTableSupported: boolean): SetIsPivotTableSupported => ({
  type: OfficeActionsTypes.SET_PIVOT_TABLE_SUPPORTED,
  isPivotTableSupported,
});

const setIsAdvancedWorksheetTrackingSupported = (
  isAdvancedWorksheetTrackingSupported: boolean
): SetIsAdvancedWorksheetTrackingSupported => ({
  type: OfficeActionsTypes.SET_ADVANCED_WORKSHEET_TRACKING_SUPPORTED,
  isAdvancedWorksheetTrackingSupported,
});

export const officeActions = {
  showDialog,
  hideDialog,
  setIsDialogLoaded,
  setDialogToOpen,
  toggleSecuredFlag,
  toggleIsSettingsFlag,
  toggleIsConfirmFlag,
  toggleIsClearDataFailedFlag,
  toggleSettingsPanelLoadedFlag,
  toggleReusePromptAnswersFlag,
  toggleImportAsPivotTableFlag,
  setActiveCellAddress,
  setPopupData,
  clearPopupData,
  setIsShapeAPISupported,
  setIsOverviewWindowAPISupported,
  setIsInsertWorksheetAPISupported,
  setIsPivotTableSupported,
  setIsAdvancedWorksheetTrackingSupported,
};
