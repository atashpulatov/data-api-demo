import { propsProxy } from '../../home/enum-props-proxy';

export const officeProperties = new Proxy({
  /**
       * propertyAlias: propertyName,
       */
  reportArray: 'mstr-loaded-reports-array',
  officeAddress: 'address',
  workbookBindings: 'bindings',
  bindingItems: 'items',
  loadedReportProperties: 'reportProperties',
  isSecured: 'isSecured',
  isClearing: 'isClearing',
  browsingFiltersApplied: 'browsingFiltersApplied',
  actions: {
    preLoadReport: 'PRE_OFFICE_LOAD_REPORT',
    loadReport: 'OFFICE_LOAD_REPORT',
    loadAllReports: 'OFFICE_LOAD_ALL_REPORTS',
    removeAllReports: 'OFFICE_REMOVE_ALL_REPORTS',
    removeReport: 'OFFICE_REMOVE_REPORT',
    startLoadingReport: 'START_LOADING_REPORT',
    finishLoadingReport: 'FINISH_LOADING_REPORT',
    popupShown: 'POPUP_OPEN',
    popupHidden: 'POPUP_HIDDEN',
    startLoading: 'START_LOADING',
    stopLoading: 'STOP_LOADING',
    startRefreshingAll: 'START_REFRESHING_ALL',
    stopRefreshingAll: 'STOP_REFRESHING_ALL',
    toggleSecuredFlag: 'TOGGLE_SECURED_FLAG',
    toggleIsSettingsFlag: 'TOGGLE_IS_SETTINGS_FLAG',
    toggleIsConfirmFlag: 'TOGGLE_IS_CONFIRM_FLAG',
    toggleRenderSettingsFlag: 'TOGGLE_RENDER_SETTINGS_FLAG',
    toggleIsClearingFlag: 'TOGGLE_IS_CLEARING_FLAG',
  },
  displayAttrFormNames: {
    automatic: 'AUTOMATIC',
    showAttrNameOnce : 'SHOW_ATTR_NAME_ONCE',
    formNameOnly: 'FORM_NAME_ONLY',
    on: 'ON',
    off: 'OFF',
  },
  displayAttrFormNamesOptions: [
    {
      value: 'AUTOMATIC',
      displayName : 'Automatic',
    },
    {
      value: 'SHOW_ATTR_NAME_ONCE',
      displayName : 'Show attribute name once',
    },
    {
      value: 'FORM_NAME_ONLY',
      displayName : 'Form name only',
    },
    {
      value: 'ON',
      displayName : 'On',
    },
    {
      value: 'OFF',
      displayName : 'Off',
    },
  ]
}, propsProxy);
