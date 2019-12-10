import { officeProperties } from '../office/office-properties';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';
export const SET_REPORT_N_FILTERS = 'SET_REPORT_N_FILTERS';
export const SET_PREPARED_REPORT = 'SET_PREPARED_REPORT';
// export const PRELOAD = 'PRELOAD';

export class PopupActions {
  init = (authenticationHelper,errorService, officeApiHelper, officeStoreService, popupHelper, mstrObjectRestService, popupController) => {
    this.authenticationHelper = authenticationHelper;
    this.errorService = errorService;
    this.officeApiHelper = officeApiHelper;
    this.officeStoreService = officeStoreService;
    this.popupHelper = popupHelper;
    this.mstrObjectRestService = mstrObjectRestService;
    this.popupController = popupController;
  }

  callForEdit = (reportParams) => async (dispatch) => {
    try {
      await Promise.all([
        this.officeApiHelper.getExcelSessionStatus(),
        this.authenticationHelper.validateAuthToken(),
      ]);
      const editedReport = this.officeStoreService.getReportFromProperties(reportParams.bindId);
      if (editedReport.isPrompted) {
        const config = { objectId: editedReport.id, projectId: editedReport.projectId };
        let instanceDefinition = await this.mstrObjectRestService.createInstance(config);
        let count = 0;
        while (instanceDefinition.status === 2) {
          const { id, projectId, promptsAnswers } = editedReport;
          const configPrompts = {
            objectId: id,
            projectId,
            instanceId: instanceDefinition.instanceId,
            promptsAnswers: promptsAnswers[count],
          };
          await this.mstrObjectRestService.answerPrompts(configPrompts);
          const configInstance = {
            objectId: editedReport.id,
            projectId: editedReport.projectId,
            body: editedReport.body,
            instanceId: instanceDefinition.instanceId,
          };
          instanceDefinition = await this.mstrObjectRestService.getInstance(configInstance);
          count += 1;
        }
        editedReport.instanceId = instanceDefinition.instanceId;
      }

      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedReport,
      });
      this.popupController.runEditFiltersPopup(reportParams);
    } catch (error) {
      dispatch({ type: officeProperties.actions.stopLoading });
      return this.errorService.handleError(error);
    }
  }

  callForReprompt = (reportParams) => async (dispatch) => {
    try {
      await Promise.all([
        this.officeApiHelper.getExcelSessionStatus(),
        this.authenticationHelper.validateAuthToken(),
      ]);
      const editedReport = this.officeStoreService.getReportFromProperties(reportParams.bindId);
      editedReport.isPrompted = true;
      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedReport,
      });
      this.popupController.runRepromptPopup(reportParams);
    } catch (error) {
      dispatch({ type: officeProperties.actions.stopLoading });
      return this.errorService.handleError(error);
    }
  }

  preparePromptedReport = (instanceId, reportData) => (dispatch) => dispatch({
    type: SET_PREPARED_REPORT,
    instanceId,
    reportData,
  })

  refreshReportsArray = (reportArray, isRefreshAll) => async (dispatch) => {
    try {
      await Promise.all([
        this.officeApiHelper.getExcelSessionStatus(),
        this.authenticationHelper.validateAuthToken(),
      ]);
    } catch (error) {
      dispatch({ type: officeProperties.actions.stopLoading });
      return this.errorService.handleError(error);
    }
    if (isRefreshAll) {
      this.popupHelper.storagePrepareRefreshAllData(reportArray);
      await this.popupHelper.runRefreshAllPopup(reportArray);
    }
    for (const [index, report] of reportArray.entries()) {
      let isError = true;
      try {
        const excelContext = await this.officeApiHelper.getExcelContext();
        await this.officeApiHelper.isCurrentReportSheetProtected(excelContext, report.bindId);
        // TODO: these two actions should be merged into one in the future
        dispatch({
          type: officeProperties.actions.startLoadingReport,
          reportBindId: report.bindId,
          isRefreshAll,
        });
        isError = await this.popupHelper.printRefreshedReport(report.bindId,
          report.objectType,
          reportArray.length,
          index,
          isRefreshAll,
          report.promptsAnswers);
      } catch (error) {
        this.popupHelper.handleRefreshError(error,
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
  }

  callForEditDossier = (reportParams) => async (dispatch) => {
    try {
      await Promise.all([
        this.officeApiHelper.getExcelSessionStatus(),
        this.authenticationHelper.validateAuthToken(),
      ]);
      const editedDossier = this.officeStoreService.getReportFromProperties(reportParams.bindId);
      const { projectId, id, manipulationsXML } = editedDossier;
      const instanceId = await this.mstrObjectRestService.createDossierInstance(projectId, id, { ...manipulationsXML });
      editedDossier.instanceId = instanceId;
      editedDossier.isEdit = true;
      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedReport: editedDossier,
      });
      this.popupController.runEditDossierPopup(reportParams);
    } catch (error) {
      return this.errorService.handleError(error);
    }
  }

  resetState = () => (dispatch) => dispatch({ type: RESET_STATE, })
}

export const popupActions = new PopupActions();
