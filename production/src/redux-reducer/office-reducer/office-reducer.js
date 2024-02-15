import { officeProperties } from './office-properties';

const initialState = {
  shouldRenderSettings: false,
  isConfirm: false,
  isSettings: false,
  supportForms: true,
  activeCellAddress: null,
  popupData: null,
  isDialogOpen: false,
  isDialogLoaded: false,
  settingsPanelLoaded: false,
  reusePromptAnswers: false,
  isShapeAPISupported: false,
};

export const officeReducer = (state = initialState, action) => {
  switch (action.type) {
    case officeProperties.actions.showDialog:
      return onShowDialog(state);

    case officeProperties.actions.hideDialog:
      return onHideDialog(state);

    case officeProperties.actions.setIsDialogLoaded:
      return setIsDialogLoaded(action, state);

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

    case officeProperties.actions.setPopupData:
      return setPopupData(action, state);

    case officeProperties.actions.clearPopupData:
      return clearPopupData(action, state);

    case officeProperties.actions.setShapeAPISupported:
      return setIsShapeAPISupported(action, state);

    default:
      break;
  }
  return state;
};

function onShowDialog(state) {
  return {
    ...state,
    isDialogOpen: true,
  };
}

function onHideDialog(state) {
  return {
    ...state,
    isDialogOpen: false,
  };
}

function setIsDialogLoaded(action, state) {
  return {
    ...state,
    isDialogLoaded: action.isDialogLoaded,
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

function setPopupData(action, state) {
  return {
    ...state,
    popupData: action.popupData,
  };
}

function clearPopupData(action, state) {
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
