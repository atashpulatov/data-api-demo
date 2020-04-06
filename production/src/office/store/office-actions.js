import { officeProperties } from './office-properties';
import officeStoreHelper from './office-store-helper';

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

export function toggleIsClearingFlag(isClearing) {
  return (dispatch) => {
    dispatch({
      type: officeProperties.actions.toggleIsClearingFlag,
      isClearing,
    });
  };
}

export function toggleRenderSettingsFlag() {
  return (dispatch) => {
    dispatch({ type: officeProperties.actions.toggleRenderSettingsFlag, });
  };
}

export const actions = { toggleSecuredFlag, };
