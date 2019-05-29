import {authenticationHelper} from '../authentication/authentication-helper';
import {officeProperties} from '../office/office-properties';
import {popupHelper} from './popup-helper';
import {officeApiHelper} from '../office/office-api-helper';
import {officeStoreService} from '../office/store/office-store-service';
import {popupController} from './popup-controller';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';
export const SET_REPORT_N_FILTERS = 'SET_REPORT_N_FILTERS';
// export const PRELOAD = 'PRELOAD';

export function callForEdit(bindingId) {
  return async (dispatch) => {
    await Promise.all([officeApiHelper.getExcelSessionStatus(), authenticationHelper.validateAuthToken()]);
    const editedReport = officeStoreService.getReportFromProperties(bindingId);
    dispatch({
      type: SET_REPORT_N_FILTERS,
      editedReport,
    });
    popupController.runPopupDataPreparation();
  };
};

export function refreshReportsArray(reportArray, isRefreshAll) {
  return async (dispatch) => {
    await Promise.all([officeApiHelper.getExcelSessionStatus(), authenticationHelper.validateAuthToken()]);
    if (isRefreshAll) {
      popupHelper.storagePrepareRefreshAllData(reportArray);
      await popupHelper.runRefreshAllPopup(reportArray);
    }
    for (const [index, report] of reportArray.entries()) {
      let isError = true;
      try {
        // TODO: these two actions should be merged into one in the future
        dispatch({
          type: officeProperties.actions.startLoadingReport,
          reportBindId: report.bindId,
          isRefreshAll: isRefreshAll,
        });
        isError = await popupHelper.printRefreshedReport(report.bindId, report.objectType, reportArray.length, index, isRefreshAll);
      } catch (error) {
        popupHelper.handleRefreshError(error, reportArray.length, index, isRefreshAll);
      } finally {
        dispatch({
          type: officeProperties.actions.finishLoadingReport,
          reportBindId: report.bindId,
          isRefreshAll: false,
          isError: isError,
        });
      }
    }
  };
}

export function resetState() {
  return (dispatch) => dispatch({
    type: RESET_STATE,
  });
}

export const actions = {
  refreshReportsArray,
  resetState,
};
