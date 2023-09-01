export const officeProperties = {
  reportArray: 'mstr-loaded-reports-array',
  officeAddress: 'address',
  storedObjects: 'storedObjects',
  loadedReportProperties: 'reportProperties',
  isSecured: 'isSecured',
  isClearDataFailed: 'isClearDataFailed',
  actions: {
    showPopup: 'OFFICE_SHOW_POPUP',
    hidePopup: 'OFFICE_HIDE_POPUP',
    toggleSecuredFlag: 'OFFICE_TOGGLE_SECURED_FLAG',
    toggleIsSettingsFlag: 'OFFICE_TOGGLE_IS_SETTINGS_FLAG',
    toggleIsConfirmFlag: 'OFFICE_TOGGLE_IS_CONFIRM_FLAG',
    toggleRenderSettingsFlag: 'OFFICE_TOGGLE_RENDER_SETTINGS_FLAG',
    toggleIsClearDataFailedFlag: 'OFFICE_TOGGLE_IS_CLEAR_DATA_FAILED',
    setRangeTakenPopup: 'OFFICE_SET_RANGE_TAKEN_POPUP',
    clearSidePanelPopupData: 'OFFICE_CLEAR_SIDE_PANEL_POPUP_DATA'
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
};
