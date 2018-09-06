import { officeProperties } from './office-properties';
import { OfficeError } from './office-error';

export const officeReducer = (state = {}, action) => {
    console.log('in reducer');
    switch (action.type) {
        case officeProperties.actions.loadReport:
            return onLoadReport(action, state);
        case officeProperties.actions.removeAllReports:
            return onRemoveAllReports(action, state);
        case officeProperties.actions.removeReport:
            return onRemoveReport(action, state);
        case officeProperties.actions.loadAllReports:
            return onLoadAllReports(action, state);
        default:
            break;
    }
    return state;
};

function onLoadReport(action, state) {
    _checkReportData(action.report);
    return {
        ...state,
        reportArray: state.reportArray
            ? [...state.reportArray, action.report]
            : [action.report],
    };
}

function onLoadAllReports(action, state) {
    if (!action.reportArray) {
        throw new OfficeError('Missing reportArray');
    }
    action.reportArray.forEach((report) => {
        _checkReportData(report);
    });
    return {
        ...state,
        reportArray: action.reportArray,
    };
}

function onRemoveAllReports(action, state) {
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

function _checkReportData(report) {
    if (!report) {
        throw new OfficeError('Missing report');
    }
    if (!report.id) {
        throw new OfficeError('Missing report.id');
    }
    if (!report.name) {
        throw new OfficeError('Missing report.name');
    }
    if (!report.bindId) {
        throw new OfficeError('Missing report.bindId');
    }
}
