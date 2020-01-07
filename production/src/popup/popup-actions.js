import { officeProperties } from '../office/office-properties';
import objectTypeEnum from '../mstr-object/mstr-object-type-enum';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';
export const SET_REPORT_N_FILTERS = 'SET_REPORT_N_FILTERS';
export const SET_PREPARED_REPORT = 'SET_PREPARED_REPORT';
// export const PRELOAD = 'PRELOAD';

export class PopupActions {
  init = (authenticationHelper, errorService, officeApiHelper, officeStoreService, popupHelper, mstrObjectRestService, popupController, notificationService, officeDisplayService) => {
    this.authenticationHelper = authenticationHelper;
    this.errorService = errorService;
    this.officeApiHelper = officeApiHelper;
    this.officeStoreService = officeStoreService;
    this.popupHelper = popupHelper;
    this.mstrObjectRestService = mstrObjectRestService;
    this.popupController = popupController;
    this.notificationService = notificationService;
    this.officeDisplayService = officeDisplayService;
  }

  callForEdit = (reportParams) => async (dispatch) => {
    try {
      await Promise.all([
        this.officeApiHelper.getExcelSessionStatus(),
        this.authenticationHelper.validateAuthToken(),
      ]);
      const editedObject = this.officeStoreService.getReportFromProperties(reportParams.bindId);

      console.log({ editedObject });

      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedObject,
      });
      if (editedObject.isPrompted) {
        this.popupController.runRepromptPopup(reportParams);
      } else {
        this.popupController.runEditFiltersPopup(reportParams);
      }
    } catch (error) {
      dispatch({ type: officeProperties.actions.stopLoading });
      return this.errorService.handleError(error);
    }
  }

  preparePromptedReport = (instanceId, chosenObjectData) => (dispatch) => dispatch({
    type: SET_PREPARED_REPORT,
    instanceId,
    chosenObjectData,
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
        editedObject: editedDossier,
      });
      this.popupController.runEditDossierPopup(reportParams);
    } catch (error) {
      return this.errorService.handleError(error);
    }
  }

  resetState = () => (dispatch) => dispatch({ type: RESET_STATE, })

  callForDuplicate = ({ reportParams, insertNewWorksheet }) => async (dispatch) => {
    try {
      await Promise.all([
        this.officeApiHelper.getExcelSessionStatus(),
        this.authenticationHelper.validateAuthToken(),
      ]);
    } catch (error) {
      dispatch({ type: officeProperties.actions.stopLoading });
      return this.errorService.handleError(error);
    }
    try {
      const excelContext = await this.officeApiHelper.getExcelContext();
      await this.officeApiHelper.isCurrentReportSheetProtected(excelContext, reportParams.bindId);
      dispatch({ type: officeProperties.actions.startLoading });
      const { bindId: bindingId, objectType, promptsAnswers } = reportParams;

      const refreshReport = this.officeStoreService.getReportFromProperties(bindingId);
      const mstrObjectType = objectTypeEnum.getMstrTypeByName(objectType);

      const options = {
        dossierData: null,
        promptsAnswers: !promptsAnswers
          ? refreshReport.promptsAnswers
          : promptsAnswers,
        objectId: refreshReport.id,
        projectId: refreshReport.projectId,
        mstrObjectType,
        body: refreshReport.body,
        isCrosstab: refreshReport.isCrosstab,
        crosstabHeaderDimensions: refreshReport.crosstabHeaderDimensions,
        isPrompted: refreshReport.isPrompted,
        subtotalInfo: refreshReport.subtotalInfo,
        visualizationInfo: refreshReport.visualizationInfo,
        manipulationsXML: refreshReport.manipulationsXML,
        insertNewWorksheet,
      };
      const result = await this.officeDisplayService.printObject(options);
      if (result) {
        this.notificationService.displayNotification({ type: result.type, content: 'Duplication successful' });
      }
    } catch (error) {
      this.errorService.handleError(error);
    } finally {
      dispatch({ type: officeProperties.actions.stopLoading });
    }
  };
}

export const popupActions = new PopupActions();
