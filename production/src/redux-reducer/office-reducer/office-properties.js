export const officeProperties = {
  reportArray: 'mstr-loaded-reports-array',
  officeAddress: 'address',
  storedObjects: 'storedObjects',
  storedAnswers: 'storedAnswers',
  loadedReportProperties: 'reportProperties',
  isSecured: 'isSecured',
  isClearDataFailed: 'isClearDataFailed',
  actions: {
    showPopup: 'OFFICE_SHOW_POPUP',
    hidePopup: 'OFFICE_HIDE_POPUP',
    setIsPopupLoaded: 'OFFICE_SET_IS_POPUP_LOADED',
    toggleSecuredFlag: 'OFFICE_TOGGLE_SECURED_FLAG',
    toggleIsSettingsFlag: 'OFFICE_TOGGLE_IS_SETTINGS_FLAG',
    toggleIsConfirmFlag: 'OFFICE_TOGGLE_IS_CONFIRM_FLAG',
    toggleRenderSettingsFlag: 'OFFICE_TOGGLE_RENDER_SETTINGS_FLAG',
    toggleIsClearDataFailedFlag: 'OFFICE_TOGGLE_IS_CLEAR_DATA_FAILED',
    toggleSettingsPanelLoadedFlag: 'OFFICE_TOGGLE_SETTINGS_PANEL_LOADED_FLAG',
    toggleReusePromptAnswersFlag: 'OFFICE_TOGGLE_REUSE_PROMPT_ANSWERS_FLAG',
    setActiveCellAddress: 'OFFICE_SET_ACTIVE_CELL_ADDRESS',
    setRangeTakenPopup: 'OFFICE_SET_RANGE_TAKEN_POPUP',
    clearSidePanelPopupData: 'OFFICE_CLEAR_SIDE_PANEL_POPUP_DATA',
    setShapeAPISupported: 'OFFICE_SET_SHAPE_API_SUPPORTED',
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
