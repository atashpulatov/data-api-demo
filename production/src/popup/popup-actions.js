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
    localStorage.setItem('allNumber', reportArray.length);
    const test = reportArray.map((report) => {
      return {key: report.bindId, name: report.name, result: false, isError: null};
    });
    localStorage.setItem('results', JSON.stringify(test));
    await popupController.runPopup(PopupTypeEnum.refreshAllPage, 22, 28);
    for (const [index, report] of reportArray.entries()) {
      await refreshReport(report.bindId, report.objectType, true, index, reportArray.length)(dispatch);
      if (index === reportArray.length - 1) {
        localStorage.setItem('finished', JSON.stringify(true));
      }
      // return [...results, {name: report.name, result: refreshResult, isError: false}];
    }
    // await reportArray.reduce(async (acc, report, index) => {
    //   const test = reportArray.map((report) => {
    //     return {name: report.name, result: '', isError: false};
    //   });
    //   console.log('test array', test);
    //   localStorage.setItem('results', JSON.stringify(test));
    //   const results = await acc;
    //   try {
    //     // localStorage.setItem('refreshData', JSON.stringify([{name: refreshReport.name, status: false, isRefreshed: false}]));
    //     // const isReport = report.objectType === 'report';
    //     // const objectInfo = await mstrObjectRestService.getObjectInfo(report.id, report.projectId, isReport);
    //     // console.log('----object info', objectInfo);
    //     // reduxStore.dispatch({
    //     //   type: PRELOAD,
    //     //   data: index,
    //     // });
    //     const refreshResult = await refreshReport(report.bindId, report.objectType, true, index, reportArray.length)(dispatch);
    //     const fromStorage = JSON.parse(localStorage.getItem('results'));
    //     console.log('from storage in try', fromStorage);
    //     // fromStorage[index].result = refreshResult;
    //     return [...results, {name: report.name, result: refreshResult, isError: false}];
    //   } catch (err) {
    //     const fromStorage = JSON.parse(localStorage.getItem('results'));
    //     console.log('from storage in catch', fromStorage);
    //     // fromStorage[index].result = err;
    //     // fromStorage[index].isError = true;
    //     return [...results, {name: report.name, result: err, isError: true}];
    //   } finally {
    //     localStorage.setItem('results', JSON.stringify(results));
    //   }
    // }, Promise.resolve([]));
    // TODO: results will be handled in future
    dispatch({
      type: STOP_REFRESHING_ALL_REPORTS,
    });
    return dispatch({
      type: RESET_STATE,
    });
  };
}

export function refreshReport(bindingId, objectType, refreshAll = false, index) {
  const refresh = refreshAll ? officeDisplayService._printObject : officeDisplayService.printObject;
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
        data: {name: refreshReport.name},
      });
      if (!!refreshAll) {
        localStorage.setItem('currentName', refreshReport.name);
        localStorage.setItem('currentNumber', index + 1);
      }
      result = await refresh(refreshReport.id, refreshReport.projectId, isReport, true, refreshReport.tableId, bindingId, refreshReport.body, true);
      if (!!refreshAll) {
        const fromStorage = JSON.parse(localStorage.getItem('results'));
        // console.log('from storage in try', fromStorage);
        fromStorage[index].result = 'ok';
        fromStorage[index].isError = false;
        return localStorage.setItem('results', JSON.stringify(fromStorage));
      }
      // return (refreshAll && !result) || notificationService.displayNotification('success', `${capitalize(objectType)} refreshed`);
      return notificationService.displayNotification('success', `${capitalize(objectType)} refreshed`);
    } catch (error) {
      if (!!refreshAll) {
        const fromStorage = JSON.parse(localStorage.getItem('results'));
        console.log('from storage in try', fromStorage);
        fromStorage[index].result = error;
        fromStorage[index].isError = true;
        return localStorage.setItem('results', JSON.stringify(fromStorage));
      }
      if (error.code === 'ItemNotFound') {
        return notificationService.displayNotification('info', 'Data is not relevant anymore. You can delete it from the list');
      }
      // return (refreshAll && error) || errorService.handleError(error);
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
