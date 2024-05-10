import { Dispatch } from 'react';

import officeStoreHelper from '../../office/store/office-store-helper';

import {
  OfficeActionsTypes,
  SetActiveCellAddressAction,
  SetIsAdvancedWorksheetTrackingSupported,
  SetIsDialogLoadedAction,
  SetIsInsertWorksheetAPISupportedAction,
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

const toggleSecuredFlag = (isSecured: boolean) => (dispatch: Dispatch<any>) => {
  officeStoreHelper.setFileSecuredFlag(isSecured);
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
  officeStoreHelper.setIsClearDataFailed(isClearDataFailed);
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

const toggleRenderSettingsFlag = () => (dispatch: Dispatch<any>) => {
  dispatch({ type: OfficeActionsTypes.TOGGLE_RENDER_SETTINGS_FLAG });
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

const updateActiveCellAddress = (activeCellAddress: string) => (dispatch: Dispatch<any>) => {
  dispatch(setActiveCellAddress(activeCellAddress));
};

const setPopupData = (popupData: any): SetPopupDataAction => ({
  type: OfficeActionsTypes.SET_POPUP_DATA,
  popupData,
});

const clearPopupData = (): SetPopupDataAction => ({ type: OfficeActionsTypes.SET_POPUP_DATA });

const setIsShapeAPISupported = (isShapeAPISupported: boolean): SetIsShapeAPISupportedAction => ({
  type: OfficeActionsTypes.SET_SHAPE_API_SUPPORTED,
  isShapeAPISupported,
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
  toggleSecuredFlag,
  toggleIsSettingsFlag,
  toggleIsConfirmFlag,
  toggleIsClearDataFailedFlag,
  toggleSettingsPanelLoadedFlag,
  toggleReusePromptAnswersFlag,
  toggleRenderSettingsFlag,
  toggleImportAsPivotTableFlag,
  setActiveCellAddress,
  updateActiveCellAddress,
  setPopupData,
  clearPopupData,
  setIsShapeAPISupported,
  setIsInsertWorksheetAPISupported,
  setIsPivotTableSupported,
  setIsAdvancedWorksheetTrackingSupported,
};
