import {propsProxy} from '../home/enum-props-proxy';

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
    setRefresh: 'SET_REFRESH',
    endRefresh: 'END_REFRESH',
  },
}, propsProxy);
