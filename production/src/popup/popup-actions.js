import {officeDisplayService} from '../office/office-display-service';
import {officeStoreService} from '../office/store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {authenticationHelper} from '../authentication/authentication-helper';
import {officeProperties} from '../office/office-properties';
import {errorService} from '../error/error-handler';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REFRESHING_ALL_REPORTS = 'START_REFRESHING_ALL_REPORTS';
export const STOP_REFRESHING_ALL_REPORTS = 'STOP_REFRESHING_ALL_REPORTS';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function refreshAll(reportArray) {
  return async (dispatch) => {
    dispatch({
      type: START_REFRESHING_ALL_REPORTS,
    });
    const results = await reportArray.reduce(async (acc, report) => {
      const results = await acc;
      try {
        const refreshResult = await refreshReport(report.bindId, report.objectType, true)(dispatch);
        return [...results, refreshResult];
      } catch (err) {
        return [...results, err];
      }
    }, Promise.resolve([]));
    // TODO: results will be handled in future
    console.log('results', results);
    dispatch({
      type: STOP_REFRESHING_ALL_REPORTS,
    });
  };
}

export function refreshReport(bindingId, objectType, refreshAll = false) {
  return async (dispatch) => {
    let result;
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
        data: refreshReport.name,
      });
      // InstanceId should be passed in the case of prompted reports, null since it's not supported
      const instanceId = null;
      result = await officeDisplayService.printObject(instanceId, refreshReport.id, refreshReport.projectId, isReport, true, refreshReport.tableId, bindingId, refreshReport.body, true);
      return (refreshAll && !result) || notificationService.displayNotification('success', `${capitalize(objectType)} refreshed`);
    } catch (error) {
      if (error.code === 'ItemNotFound') {
        return notificationService.displayNotification('info', 'Data is not relevant anymore. You can delete it from the list');
      }
      return (refreshAll && error) || errorService.handleError(error);
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
