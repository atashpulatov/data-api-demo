import officeStoreHelper from '../../office/store/office-store-helper';

import { officeProperties } from './office-properties';

const showDialog = () => ({ type: officeProperties.actions.showDialog });

const setIsDialogLoaded = isDialogLoaded => ({
  type: officeProperties.actions.setIsDialogLoaded,
  isDialogLoaded,
});

const hideDialog = () => dispatch => {
  dispatch(setIsDialogLoaded(false));
  dispatch({ type: officeProperties.actions.hideDialog });
};

const toggleSecuredFlag = isSecured => dispatch => {
  officeStoreHelper.setFileSecuredFlag(isSecured);
  dispatch({
    type: officeProperties.actions.toggleSecuredFlag,
    isSecured,
  });
};

const toggleIsSettingsFlag = isSettings => dispatch => {
  dispatch({
    type: officeProperties.actions.toggleIsSettingsFlag,
    isSettings,
  });
};

const toggleIsConfirmFlag = isConfirm => dispatch => {
  dispatch({ type: officeProperties.actions.toggleIsConfirmFlag, isConfirm });
};

const toggleIsClearDataFailedFlag = isClearDataFailed => dispatch => {
  officeStoreHelper.setIsClearDataFailed(isClearDataFailed);
  dispatch({
    type: officeProperties.actions.toggleIsClearDataFailedFlag,
    isClearDataFailed,
  });
};

const toggleSettingsPanelLoadedFlag = settingsPanelLoded => dispatch => {
  dispatch({
    type: officeProperties.actions.toggleSettingsPanelLoadedFlag,
    settingsPanelLoded,
  });
};

const toggleReusePromptAnswersFlag = reusePromptAnswers => dispatch => {
  dispatch({
    type: officeProperties.actions.toggleReusePromptAnswersFlag,
    reusePromptAnswers,
  });
};

const toggleRenderSettingsFlag = () => dispatch => {
  dispatch({ type: officeProperties.actions.toggleRenderSettingsFlag });
};

const setActiveCellAddress = activeCellAddress => ({
  type: officeProperties.actions.setActiveCellAddress,
  activeCellAddress,
});

const updateActiveCellAddress = activeCellAddress => dispatch => {
  dispatch(setActiveCellAddress(activeCellAddress));
};

const setPopupData = popupData => ({
  type: officeProperties.actions.setPopupData,
  popupData,
});

const clearPopupData = () => ({ type: officeProperties.actions.setPopupData });

const setIsShapeAPISupported = data => ({
  type: officeProperties.actions.setShapeAPISupported,
  data,
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
  setActiveCellAddress,
  updateActiveCellAddress,
  setPopupData,
  clearPopupData,
  setIsShapeAPISupported,
};
