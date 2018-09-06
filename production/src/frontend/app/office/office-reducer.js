import { officeProperties } from './office-properties';
import { OfficeError } from './office-error';

export const officeReducer = (state = {}, action) => {
    switch (action.type) {
        case officeProperties.actions.loadReport:
            return onLoadReport(action, state);
        case officeProperties.actions.removeReports:
            return onRemoveReports(action, state);
        case officeProperties.actions.removeReport:
            return onRemoveReport(action, state);
        default:
            break;
    }
    return state;
};

function onLoadReport(action, state) {
    if (!action.report) {
        throw new OfficeError('Missing report');
    }
    if (!action.report.id) {
        throw new OfficeError('Missing report.id');
    }
    if (!action.report.name) {
        throw new OfficeError('Missing report.name');
    }
    if (!action.report.bindId) {
        throw new OfficeError('Missing report.bindId');
    }
    const reportArray = state.reportArray ? state.reportArray : [];
    reportArray.push(action.report);
    return {
        ...state,
        reportArray,
    };
}

function onRemoveReports(action, state) {
    return {
        ...state,
        reportArray: undefined,
    };
}

function onRemoveReport(action, state) {
    if (!action.reportBindId) {
        throw new OfficeError('Missing reportBindId');
    }
    const indexOfElement = state.reportArray.findIndex((report) => {
        return (report.bindId === action.reportBindId);
    });
    return {
        ...state,
        reportArray: [
            ...state.reportArray.slice(0, indexOfElement),
            ...state.reportArray.slice(indexOfElement + 1),
        ],
    };
}
