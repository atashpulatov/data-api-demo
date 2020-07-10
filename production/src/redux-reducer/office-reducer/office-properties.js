import { propsProxy } from '../../home/enum-props-proxy';

// TODO: rethink the name and the place of these properties
export const officeProperties = new Proxy({
  /**
       * propertyAlias: propertyName,
       */
  reportArray: 'mstr-loaded-reports-array',
  officeAddress: 'address',
  storedObjects: 'storedObjects',
  loadedReportProperties: 'reportProperties',
  isSecured: 'isSecured',
  isClearDataFailed: 'isClearDataFailed',
  actions: {
    popupShown: 'POPUP_OPEN',
    popupHidden: 'POPUP_HIDDEN',
    startLoading: 'START_LOADING',
    stopLoading: 'STOP_LOADING',
    toggleSecuredFlag: 'TOGGLE_SECURED_FLAG',
    toggleIsSettingsFlag: 'TOGGLE_IS_SETTINGS_FLAG',
    toggleIsConfirmFlag: 'TOGGLE_IS_CONFIRM_FLAG',
    toggleRenderSettingsFlag: 'TOGGLE_RENDER_SETTINGS_FLAG',
    toggleIsClearDataFailedFlag: 'TOGGLE_IS_CLEAR_DATA_FAILED',
    setRangeTakenPopup: 'SET_RANGE_TAKEN_POPUP',
    clearSidePanelPopupData: 'CLEAR_SIDE_PANEL_POUP_DATA',
  },
  displayAttrFormNames: {
    automatic: 'AUTOMATIC',
    showAttrNameOnce: 'SHOW_ATTR_NAME_ONCE',
    formNameOnly: 'FORM_NAME_ONLY',
    on: 'ON',
    off: 'OFF',
  },
  displayAttrFormNamesOptions: [
    {
      value: 'AUTOMATIC',
      displayName: 'Automatic',
    },
    {
      value: 'SHOW_ATTR_NAME_ONCE',
      displayName: 'Show attribute name once',
    },
    {
      value: 'FORM_NAME_ONLY',
      displayName: 'Form name only',
    },
    {
      value: 'ON',
      displayName: 'On',
    },
    {
      value: 'OFF',
      displayName: 'Off',
    },
  ]
}, propsProxy);
