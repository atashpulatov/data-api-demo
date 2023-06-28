import { officeProperties } from './office-properties';
import officeStoreHelper from '../../office/store/office-store-helper';

const showPopup = () => ({ type: officeProperties.actions.showPopup });

const hidePopup = () => ({ type: officeProperties.actions.hidePopup });

const toggleSecuredFlag = (isSecured) => (dispatch) => {
  officeStoreHelper.setFileSecuredFlag(isSecured);
  dispatch({
    type: officeProperties.actions.toggleSecuredFlag,
    isSecured,
  });
};

const toggleIsSettingsFlag = (isSettings) => (dispatch) => {
  dispatch({
    type: officeProperties.actions.toggleIsSettingsFlag,
    isSettings,
  });
};

const toggleIsConfirmFlag = (isConfirm) => (dispatch) => {
  dispatch({ type: officeProperties.actions.toggleIsConfirmFlag, isConfirm });
};

const toggleIsClearDataFailedFlag = (isClearDataFailed) => (dispatch) => {
  officeStoreHelper.setIsClearDataFailed(isClearDataFailed);
  dispatch({
    type: officeProperties.actions.toggleIsClearDataFailedFlag,
    isClearDataFailed,
  });
};

/* eslint-disable */
const toggleSettingsPanelLoadedFlag = (settingsPanelLoded) => (dispatch) => {    
    dispatch({
      type: officeProperties.actions.toggleSettingsPanelLoadedFlag,
      settingsPanelLoded,
    });
};

const toggleReusePromptAnswersFlag = (reusePromptAnswers) => (dispatch) => {
    dispatch({
      type: officeProperties.actions.toggleReusePromptAnswersFlag,
      reusePromptAnswers,
    });
};

const toggleRenderSettingsFlag = () => (dispatch) => {
  dispatch({ type: officeProperties.actions.toggleRenderSettingsFlag, });
};

const setRangeTakenPopup = (popupData) => ({
  type: officeProperties.actions.setRangeTakenPopup,
  popupData,
});

const clearSidePanelPopupData = () => ({ type: officeProperties.actions.setRangeTakenPopup });

const setShowHidden = (showHidden) => ({ type: officeProperties.actions.setShowHidden, showHidden });

export const officeActions = {
  showPopup,
  hidePopup,
  toggleSecuredFlag,
  toggleIsSettingsFlag,
  toggleIsConfirmFlag,
  toggleIsClearDataFailedFlag,
  toggleSettingsPanelLoadedFlag,
  toggleReusePromptAnswersFlag,
  toggleRenderSettingsFlag,
  setRangeTakenPopup,
  clearSidePanelPopupData,
  setShowHidden
};
