import { officeProperties } from './office-properties';

const initialState = {
  shouldRenderSettings: false,
  isConfirm: false,
  isSettings: false,
  supportForms: true,
  activeCellAddress: null,
  popupData: null,
  popupOpen: false,
  settingsPanelLoaded: false,
  reusePromptAnswers: false,
  isShapeAPISupported: false,
};

export const officeReducer = (state = initialState, action) => {
  switch (action.type) {
    case officeProperties.actions.showPopup:
      return onShowPopup(state);

    case officeProperties.actions.hidePopup:
      return onHidePopup(state);

    case officeProperties.actions.setIsPopupLoaded:
      return setIsPopupLoaded(action, state);

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

    case officeProperties.actions.toggleSettingsPanelLoadedFlag:
      return toggleSettingsPanelLoadedFlag(action, state);

    case officeProperties.actions.toggleReusePromptAnswersFlag:
      return toggleReusePromptAnswersFlag(action, state);

    case officeProperties.actions.setActiveCellAddress:
      return setActiveCellAddress(action, state);

    case officeProperties.actions.setRangeTakenPopup:
      return setRangeTakenPopup(action, state);

    case officeProperties.actions.clearSidePanelPopupData:
      return clearSidePanelPopupData(action, state);

    case officeProperties.actions.setShapeAPISupported:
      return setIsShapeAPISupported(action, state);

    default:
      break;
  }
  return state;
};

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

function setIsPopupLoaded(action, state) {
  return {
    ...state,
    isPopupLoaded: action.isPopupLoaded,
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

function toggleSettingsPanelLoadedFlag(action, state) {
  return {
    ...state,
    settingsPanelLoaded: !state.settingsPanelLoaded
  };
}

function toggleReusePromptAnswersFlag(action, state) {
  return {
    ...state,
    reusePromptAnswers: action.reusePromptAnswers
  };
}

function setActiveCellAddress(action, state) {
  return {
    ...state,
    activeCellAddress: action.activeCellAddress,
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

function setIsShapeAPISupported(action, state) {
  return {
    ...state,
    isShapeAPISupported: action.data
  };
}
