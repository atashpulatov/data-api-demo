import {officeDisplayService} from '../office/office-display-service';
import {officeStoreService} from '../office/store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {authenticationHelper} from '../authentication/authentication-helper';
import {officeProperties} from '../office/office-properties';
import {errorService} from '../error/error-handler';
import {popupController} from '../popup/popup-controller';
import {PopupTypeEnum} from '../home/popup-type-enum';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REFRESHING_ALL_REPORTS = 'START_REFRESHING_ALL_REPORTS';
export const STOP_REFRESHING_ALL_REPORTS = 'STOP_REFRESHING_ALL_REPORTS';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';
// export const PRELOAD = 'PRELOAD';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function refreshAll(reportArray) {
  return async (dispatch) => {
    dispatch({
      type: START_REFRESHING_ALL_REPORTS,
    });
    const test = reportArray.map((report) => {
      return {key: report.bindId, name: report.name, result: false, isError: null};
    });
    localStorage.setItem('results', JSON.stringify(test));
    localStorage.setItem('allNumber', reportArray.length);
    localStorage.setItem('finished', JSON.stringify(false));
    const popupHeight = Math.floor(((220 + (reportArray.length * 30)) / (window.innerHeight + 200)) * 100);
    await popupController.runPopup(PopupTypeEnum.refreshAllPage, popupHeight, 28);
    for (const [index, report] of reportArray.entries()) {
      await refreshReport(report.bindId, report.objectType, true, index, reportArray.length)(dispatch);
      if (index === reportArray.length - 1) {
        localStorage.setItem('finished', JSON.stringify(true));
      }
    }
    // TODO: results will be handled in future
    dispatch({
      type: STOP_REFRESHING_ALL_REPORTS,
    });
    dispatch({
      type: RESET_STATE,
    });
  };
}

export function refreshReport(bindingId, objectType, isRefreshAll = false, index) {
  return async (dispatch) => {
    try {
      await authenticationHelper.validateAuthToken();
      // TODO: these two actions should be merged into one in the future
      dispatch({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: bindingId,
      });
      const isReport = objectType === 'report';
      const refreshReport = officeStoreService.getReportFromProperties(bindingId);
      dispatch({
        type: START_REPORT_LOADING,
        data: {name: refreshReport.name},
      });
      if (isRefreshAll) {
        localStorage.setItem('currentName', refreshReport.name);
        localStorage.setItem('currentNumber', index + 1);
      }
      const instanceId = null;
      // TODO: Pass refreshAll and skip opening dialog
      await officeDisplayService.printObject(instanceId, refreshReport.id, refreshReport.projectId, isReport, true, refreshReport.tableId, bindingId, refreshReport.body, true, isRefreshAll);
      if (isRefreshAll) {
        const fromStorage = JSON.parse(localStorage.getItem('results'));
        fromStorage[index].result = 'ok';
        fromStorage[index].isError = false;
        return localStorage.setItem('results', JSON.stringify(fromStorage));
      }
      return notificationService.displayNotification('success', `${capitalize(objectType)} refreshed`);
    } catch (error) {
      if (isRefreshAll) {
        const fromStorage = JSON.parse(localStorage.getItem('results'));
        const restError = errorService.errorRestFactory(error);
        const errorMessage = errorService.getErrorMessage(restError);
        fromStorage[index].result = errorMessage;
        fromStorage[index].isError = true;
        return localStorage.setItem('results', JSON.stringify(fromStorage));
      }
      if (error.code === 'ItemNotFound') {
        return notificationService.displayNotification('info', 'Data is not relevant anymore. You can delete it from the list');
      }
      return errorService.handleError(error);
    } finally {
      // TODO: these two actions should be merged into one in the future
      dispatch({
        type: STOP_REPORT_LOADING,
      });
      dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
      });
    }
  };
}

export function startReportLoading(data) {
  return (dispatch) => dispatch({
    type: START_REPORT_LOADING,
    refreshingReport: data,
  });
}

export function stopReportLoading() {
  return (dispatch) => dispatch({
    type: STOP_REPORT_LOADING,
  });
}

export function resetState() {
  return (dispatch) => dispatch({
    type: RESET_STATE,
  });
}

export const actions = {
  refreshAll,
  startReportLoading,
  stopReportLoading,
  resetState,
  refreshReport,
};
