import { officeProperties } from './office-properties';
import officeStoreHelper from '../../office/store/office-store-helper';

export function toggleSecuredFlag(isSecured) {
  officeStoreHelper.setFileSecuredFlag(isSecured);
  return (dispatch) => {
    dispatch({
      type: officeProperties.actions.toggleSecuredFlag,
      isSecured,
    });
  };
}

export function toggleIsSettingsFlag(isSettings) {
  return (dispatch) => {
    dispatch({
      type: officeProperties.actions.toggleIsSettingsFlag,
      isSettings,
    });
  };
}

export function toggleIsConfirmFlag(isConfirm) {
  return (dispatch) => {
    dispatch({ type: officeProperties.actions.toggleIsConfirmFlag, isConfirm });
  };
}

export function toggleIsClearDataFailedFlag(isClearDataFailed) {
  officeStoreHelper.setIsClearDataFailed(isClearDataFailed);
  return (dispatch) => {
    dispatch({
      type: officeProperties.actions.toggleIsClearDataFailedFlag,
      isClearDataFailed,
    });
  };
}

export function toggleRenderSettingsFlag() {
  return (dispatch) => {
    dispatch({ type: officeProperties.actions.toggleRenderSettingsFlag, });
  };
}

export const setRangeTakenPopup = (popupData) => ({
  type: officeProperties.actions.setRangeTakenPopup,
  popupData,
});

export const clearSidePanelPopupData = () => ({ type: officeProperties.actions.setRangeTakenPopup });

export const actions = { toggleSecuredFlag, };
