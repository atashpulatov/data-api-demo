import { officeProperties } from './office-properties';

const initialState = {
  loading: false,
  shouldRenderSettings: false,
  isConfirm: false,
  isSettings: false,
  supportForms: true,
  popupData: null,
};

export const officeReducer = (state = initialState, action) => {
  switch (action.type) {
    case officeProperties.actions.showPopup:
      return onShowPopup(state);

    case officeProperties.actions.hidePopup:
      return onHidePopup(state);

    case officeProperties.actions.startLoading:
      return onStartLoading(state);

    case officeProperties.actions.stopLoading:
      return onStopLoading(state);

    case officeProperties.actions.toggleSecuredFlag:
      return toggleSecuredFlag(action, state);

    case officeProperties.actions.toggleIsSettingsFlag:
      return toggleIsSettingsFlag(action, state);

    case officeProperties.actions.toggleIsConfirmFlag:
      return toggleIsConfirmFlag(action, state);

    case officeProperties.actions.toggleRenderSettingsFlag:
      return toggleRenderSettingsFlag(action, state);

    case officeProperties.actions.toggleIsClearDataFailedFlag:
      return toggleIsClearDataFailedFlag(action, state);

    case officeProperties.actions.setRangeTakenPopup:
      return setRangeTakenPopup(action, state);

    case officeProperties.actions.clearSidePanelPopupData:
      return clearSidePanelPopupData(action, state);

    default:
      break;
  }
  return state;
};

function onStartLoading(state) {
  return {
    ...state,
    loading: true,
  };
}
function onStopLoading(state) {
  return {
    ...state,
    loading: false,
  };
}

function onShowPopup(state) {
  return {
    ...state,
    popupOpen: true,
  };
}

function onHidePopup(state) {
  return {
    ...state,
    popupOpen: false,
  };
}

function toggleSecuredFlag(action, state) {
  return {
    ...state,
    isSecured: action.isSecured,
  };
}

function toggleIsSettingsFlag(action, state) {
  return {
    ...state,
    isSettings: action.isSettings,
  };
}

function toggleIsConfirmFlag(action, state) {
  return {
    ...state,
    isConfirm: action.isConfirm,
    isSettings: false,
  };
}

function toggleRenderSettingsFlag(action, state) {
  return {
    ...state,
    shouldRenderSettings: !state.shouldRenderSettings,
    isSettings: false,
  };
}

function toggleIsClearDataFailedFlag(action, state) {
  return {
    ...state,
    isClearDataFailed: action.isClearDataFailed,
  };
}

function setRangeTakenPopup(action, state) {
  return {
    ...state,
    popupData: action.popupData,
  };
}

function clearSidePanelPopupData(action, state) {
  return {
    ...state,
    popupData: null,
  };
}
