import {officeDisplayService} from '../office/office-display-service';
import {officeStoreService} from '../office/store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {authenticationHelper} from '../authentication/authentication-helper';
import {officeProperties} from '../office/office-properties';
import {errorService} from '../error/error-handler';
import {popupController} from '../popup/popup-controller';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {officeApiHelper} from '../office/office-api-helper';

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
    localStorage.removeItem('refreshData');
    dispatch({
      type: START_REFRESHING_ALL_REPORTS,
    });
    const refreshReportsData = reportArray.map((report) => {
      return {key: report.bindId, name: report.name, result: false, isError: null};
    });
    const refreshData = {data: refreshReportsData, allNumber: reportArray.length, finished: false, currentNumber: 1};
    localStorage.setItem('refreshData', JSON.stringify(refreshData));
    const reportsListLength = reportArray.length > 10 ? 10 : reportArray.length;
    const popupHeight = Math.floor(((220 + (reportsListLength * 30)) / (window.innerHeight + 200)) * 100);
    await popupController.runPopup(PopupTypeEnum.refreshAllPage, popupHeight, 28);
    for (const [index, report] of reportArray.entries()) {
      await refreshReport(report.bindId, report.objectType, true, index, reportArray.length)(dispatch);
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

export function refreshReport(bindingId, objectType, isRefreshAll = false, index, length) {
  return async (dispatch) => {
    try {
      await officeApiHelper.getExcelSessionStatus();
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
        const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
        fromStorage.currentName = refreshReport.name;
        fromStorage.currentNumber = index + 1;
        localStorage.setItem('refreshData', JSON.stringify(fromStorage));
      }
      const instanceId = null;
      // TODO: Pass proper isPrompted value
      const result = await officeDisplayService.printObject(instanceId, refreshReport.id, refreshReport.projectId, isReport, true, refreshReport.tableId, bindingId, refreshReport.body, true, false, isRefreshAll);
      if (result.type !== 'success') {
        throw new Error(result.message);
      }
      dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
        isError: false,
      });
      if (isRefreshAll) {
        const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
        fromStorage.data[index].result = 'ok';
        fromStorage.data[index].isError = false;
        if (index === length - 1) {
          fromStorage.finished = true;
        }
        localStorage.setItem('refreshData', JSON.stringify(fromStorage));
      }
      return notificationService.displayNotification('success', `${capitalize(objectType)} refreshed`);
    } catch (error) {
      dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
        isError: true,
      });
      if (isRefreshAll) {
        const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
        const officeError = errorService.errorOfficeFactory(error);
        const errorMessage = errorService.getErrorMessage(officeError);
        fromStorage.data[index].result = errorMessage;
        fromStorage.data[index].isError = true;
        if (index === length - 1) {
          fromStorage.finished = true;
        }
        return localStorage.setItem('refreshData', JSON.stringify(fromStorage));
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
