import { propsProxy } from '../enum-props-proxy';

export const officeProperties = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    reportArray: 'mstr-loaded-reports-array',
    actions: {
        loadReport: 'OFFICE_LOAD_REPORT',
        loadAllReports: 'OFFICE_LOAD_ALL_REPORTS',
        removeAllReports: 'OFFICE_REMOVE_ALL_REPORTS',
        removeReport: 'OFFICE_REMOVE_REPORT',
    },
}, propsProxy);
