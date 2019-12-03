import { authenticationHelper } from '../authentication/authentication-helper';
import { errorService } from '../error/error-handler';
import { officeApiHelper } from '../office/office-api-helper';
import { officeProperties } from '../office/office-properties';
import { officeStoreService } from '../office/store/office-store-service';
import { popupController } from './popup-controller';
import { popupHelper } from './popup-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { reduxStore } from '../store';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';
export const SET_REPORT_N_FILTERS = 'SET_REPORT_N_FILTERS';
export const SET_PREPARED_REPORT = 'SET_PREPARED_REPORT';
// export const PRELOAD = 'PRELOAD';

const { createInstance, answerPrompts, getInstance, createDossierInstance } = mstrObjectRestService;

export function callForEdit(reportParams) {
  return async (dispatch) => {
    try {
      await Promise.all([
        officeApiHelper.getExcelSessionStatus(),
        authenticationHelper.validateAuthToken(),
      ]);
      const editedReport = officeStoreService.getReportFromProperties(reportParams.bindId);
      if (editedReport.isPrompted) {
        const config = { objectId: editedReport.id, projectId: editedReport.projectId };
        let instanceDefinition = await createInstance(config);
        let count = 0;
        while (instanceDefinition.status === 2) {
          const { id, projectId, promptsAnswers } = editedReport;
          const configPrompts = {
            objectId: id,
            projectId,
            instanceId: instanceDefinition.instanceId,
            promptsAnswers: promptsAnswers[count],
          };
          await answerPrompts(configPrompts);
          const configInstance = {
            objectId: editedReport.id,
            projectId: editedReport.projectId,
            body: editedReport.body,
            instanceId: instanceDefinition.instanceId,
          };
          instanceDefinition = await getInstance(configInstance);
          count += 1;
        }
        editedReport.instanceId = instanceDefinition.instanceId;
      }

      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedReport,
      });
      popupController.runEditFiltersPopup(reportParams);
    } catch (error) {
      reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
      return errorService.handleError(error);
    }
  };
}

export function callForReprompt(reportParams) {
  return async (dispatch) => {
    try {
      await Promise.all([
        officeApiHelper.getExcelSessionStatus(),
        authenticationHelper.validateAuthToken(),
      ]);
      const editedReport = officeStoreService.getReportFromProperties(reportParams.bindId);
      editedReport.isPrompted = true;
      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedReport,
      });
      popupController.runRepromptPopup(reportParams);
    } catch (error) {
      reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
      return errorService.handleError(error);
    }
  };
}

export function preparePromptedReport(instanceId, reportData) {
  return (dispatch) => dispatch({
    type: SET_PREPARED_REPORT,
    instanceId,
    reportData,
  });
}

export function refreshReportsArray(reportArray, isRefreshAll) {
  return async (dispatch) => {
    try {
      await Promise.all([
        officeApiHelper.getExcelSessionStatus(),
        authenticationHelper.validateAuthToken(),
      ]);
    } catch (error) {
      reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
      return errorService.handleError(error);
    }
    if (isRefreshAll) {
      popupHelper.storagePrepareRefreshAllData(reportArray);
      await popupHelper.runRefreshAllPopup(reportArray);
    }
    for (const [index, report] of reportArray.entries()) {
      let isError = true;
      try {
        const excelContext = await officeApiHelper.getExcelContext();
        await officeApiHelper.isCurrentReportSheetProtected(excelContext, report.bindId);
        // TODO: these two actions should be merged into one in the future
        dispatch({
          type: officeProperties.actions.startLoadingReport,
          reportBindId: report.bindId,
          isRefreshAll,
        });
        isError = await popupHelper.printRefreshedReport(report.bindId,
          report.objectType,
          reportArray.length,
          index,
          isRefreshAll,
          report.promptsAnswers);
      } catch (error) {
        popupHelper.handleRefreshError(error,
          reportArray.length,
          index,
          isRefreshAll);
        if (!isRefreshAll) return true;
      } finally {
        dispatch({
          type: officeProperties.actions.finishLoadingReport,
          reportBindId: report.bindId,
          isRefreshAll: false,
          isError,
        });
      }
    }
  };
}

export function callForEditDossier(reportParams) {
  return async (dispatch) => {
    try {
      await Promise.all([
        officeApiHelper.getExcelSessionStatus(),
        authenticationHelper.validateAuthToken(),
      ]);
      const editedDossier = officeStoreService.getReportFromProperties(reportParams.bindId);
      const { projectId, id, manipulationsXML } = editedDossier;
      const instanceId = await createDossierInstance(projectId, id, { ...manipulationsXML });
      editedDossier.instanceId = instanceId;
      editedDossier.isEdit = true;
      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedReport: editedDossier,
      });
      popupController.runEditDossierPopup(reportParams);
    } catch (error) {
      return errorService.handleError(error);
    }
  };
}

export function resetState() {
  return (dispatch) => dispatch({ type: RESET_STATE, });
}

export const actions = {
  refreshReportsArray,
  resetState,
};
