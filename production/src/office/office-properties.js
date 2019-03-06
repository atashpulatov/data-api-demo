import { propsProxy } from '../home/enum-props-proxy';

export const officeProperties = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    reportArray: 'mstr-loaded-reports-array',
    officeAddress: 'address',
    workbookBindings: 'bindings',
    bindingItems: 'items',
    loadedReportProperties: 'reportProperties',
    actions: {
        loadReport: 'OFFICE_LOAD_REPORT',
        loadAllReports: 'OFFICE_LOAD_ALL_REPORTS',
        removeAllReports: 'OFFICE_REMOVE_ALL_REPORTS',
        removeReport: 'OFFICE_REMOVE_REPORT',
        startLoadingReport: 'START_LOADING_REPORT',
        finishLoadingReport: 'FINISH_LOADING_REPORT',
    },
}, propsProxy);
