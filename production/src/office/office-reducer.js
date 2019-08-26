import {officeProperties} from './office-properties';
import {OfficeError} from './office-error';
import {officeStoreService} from './store/office-store-service';

export const officeReducer = (state = {loading: false}, action) => {
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
    case officeProperties.actions.popupShown:
      return onPopupShown(state);
    case officeProperties.actions.popupHidden:
      return onPopupHidden(state);
    case officeProperties.actions.startLoading:
      return onStartLoading(state);
    case officeProperties.actions.stopLoading:
      return onStopLoading(state);
    case officeProperties.actions.toggleSecuredFlag:
      return toggleSecuredFlag(action, state);
    case officeProperties.actions.toggleIsSettingsFlag:
      return toggleIsSettingsFlag(action, state);
    case officeProperties.actions.toggleIsConfirmFlag:
      return toggleIsConfirmFlag(action, state);
    case officeProperties.actions.toggleRenderSettingsFlag:
      return toggleRenderSettingsFlag(action, state);
    default:
      break;
  }
  return state;
};

function onStartLoading(state) {
  return {
    ...state,
    loading: true,
  };
}
function onStopLoading(state) {
  return {
    ...state,
    loading: false,
  };
}

function onPopupShown(state) {
  return {
    ...state,
    popupOpen: true,
  };
}

function onPopupHidden(state) {
  return {
    ...state,
    popupOpen: false,
  };
}

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
    loading: false,
    reportArray: state.reportArray
      ? [action.report, ...state.reportArray]
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
    reportArray: [...action.reportArray],
  };
}

function onRemoveAllReports(action, state) {
  const newState = {...state};
  delete newState.reportArray;
  return newState;
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
  if (!status && !action.isError) {
    const currentDate = new Date();
    newReportArray[indexOfElement].refreshDate = currentDate;
    officeStoreService.preserveReportValue(state.reportArray[indexOfElement].bindId, 'refreshDate', currentDate);
  }
  return {
    ...state,
    loading: status,
    reportArray: newReportArray,
    isRefreshAll: action.isRefreshAll,
  };
}

function toggleSecuredFlag(action, state) {
  return {
    ...state,
    isSecured: action.isSecured,
  };
}

function toggleIsSettingsFlag(action, state) {
  return {
    ...state,
    isSettings: action.isSettings,
  };
}

function toggleIsConfirmFlag(action, state) {
  return {
    ...state,
    isConfirm: action.isConfirm,
  };
}

function toggleRenderSettingsFlag(action, state) {
  return {
    ...state,
    shouldRenderSettings: action.shouldRenderSettings,
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
