import {officeProperties} from './office-properties';
import {OfficeError} from './office-error';

export const officeReducer = (state = {}, action) => {
  switch (action.type) {
    case officeProperties.actions.preLoadReport:
      return onPreLoadReport(action, state);
    case officeProperties.actions.loadReport:
      return onLoadReport(action, state);
    case officeProperties.actions.removeAllReports:
      return onRemoveAllReports(action, state);
    case officeProperties.actions.removeReport:
      return onRemoveReport(action, state);
    case officeProperties.actions.loadAllReports:
      return onLoadAllReports(action, state);
    case officeProperties.actions.startLoadingReport:
      return onStartLoadingReport(action, state);
    case officeProperties.actions.finishLoadingReport:
      return onFinishLoadingReport(action, state);
    default:
      break;
  }
  return state;
};

function onPreLoadReport(action, state) {
  return {
    ...state,
    preLoadReport: action.preLoadReport,
  };
}

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

function onStartLoadingReport(action, state) {
  return _toggleSetLoadingStatus(action, state, true);
}

function onFinishLoadingReport(action, state) {
  return _toggleSetLoadingStatus(action, state, false);
}

function _toggleSetLoadingStatus(action, state, status) {
  if (!action.reportBindId) {
    throw new OfficeError('Missing reportBindId');
  }
  const indexOfElement = state.reportArray.findIndex((report) => {
    return (report.bindId === action.reportBindId);
  });
  const newReportArray = [...state.reportArray];
  newReportArray[indexOfElement].isLoading = status;
  return {
    ...state,
    loading: status,
    reportArray: newReportArray,
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
  if (!report.envUrl) {
    throw new OfficeError('Missing report.envUrl');
  }
  if (!report.projectId) {
    throw new OfficeError('Missing report.projectId');
  }
}
