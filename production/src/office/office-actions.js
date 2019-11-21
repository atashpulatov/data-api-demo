import { officeProperties } from './office-properties';
import { officeStoreService } from './store/office-store-service';

export function toggleSecuredFlag(isSecured) {
  officeStoreService.toggleFileSecuredFlag(isSecured);
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

export function toggleIsConfirmFlag() {
  return (dispatch) => {
    dispatch({ type: officeProperties.actions.toggleIsConfirmFlag, });
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
