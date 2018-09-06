import { propsProxy } from '../enum-props-proxy';

export const officeProperties = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    reportArray: 'mstr-loaded-reports-array',
    actions: {
        loadReport: 'OFFICE_LOAD_REPORT',
        removeReports: 'OFFICE_REMOVE_REPORTS',
        removeReport: 'OFFICE_REMOVE_REPORT',
    },
}, propsProxy);
