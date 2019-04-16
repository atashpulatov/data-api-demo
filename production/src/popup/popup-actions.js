import {officeDisplayService} from '../office/office-display-service';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REFRESHING_ALL_REPORTS = 'START_REFRESHING_ALL_REPORTS';
export const STOP_REFRESHING_ALL_REPORTS = 'STOP_REFRESHING_ALL_REPORTS';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';

export function refreshAll(reportArray) {
  return async (dispatch) => {
    dispatch({
      type: START_REFRESHING_ALL_REPORTS,
    });
    await officeDisplayService.refreshAll(reportArray);
    dispatch({
      type: STOP_REFRESHING_ALL_REPORTS,
    });
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
};
