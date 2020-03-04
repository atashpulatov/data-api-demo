import { officeProperties } from '../office/store/office-properties';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';
export const SET_REPORT_N_FILTERS = 'SET_REPORT_N_FILTERS';
export const SET_PREPARED_REPORT = 'SET_PREPARED_REPORT';
// export const PRELOAD = 'PRELOAD';
class PopupActions {
  init = (authenticationHelper,
    errorService,
    officeApiHelper,
    officeStoreService,
    popupHelper,
    mstrObjectRestService,
    popupController) => {
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
      const editedObject = this.officeStoreService.getReportFromProperties(reportParams.bindId);

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
    const { popupHelper, officeApiHelper } = this;
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
      popupHelper.storagePrepareRefreshAllData(reportArray);
      await popupHelper.runRefreshAllPopup(reportArray);
    }

    for (const [index, report] of reportArray.entries()) {
      let isError = true;
      const reportsNumber = reportArray.length;
      try {
        const excelContext = await officeApiHelper.getExcelContext();
        await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, report.bindId);
        // TODO: these two actions should be merged into one in the future

        dispatch({
          type: officeProperties.actions.startLoadingReport,
          reportBindId: report.bindId,
          isRefreshAll,
        });

        const { bindId, objectType, promptsAnswers } = report;
        isError = await popupHelper.printRefreshedReport(
          bindId,
          objectType,
          reportsNumber,
          index,
          isRefreshAll,
          promptsAnswers
        );
      } catch (error) {
        popupHelper.handleRefreshError(
          error,
          reportsNumber,
          index,
          isRefreshAll
        );
        if (!isRefreshAll) { return true; }
      } finally {
        isRefreshAll && dispatch({
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

      const {
        projectId, id, manipulationsXML, visualizationInfo
      } = editedDossier;

      const instanceId = await this.mstrObjectRestService.createDossierInstance(
        projectId,
        id,
        { ...manipulationsXML, disableManipulationsAutoSaving: true, persistViewState: true }
      );

      const updatedVisualizationInfo = await this.mstrObjectRestService.getVisualizationInfo(
        projectId,
        id,
        visualizationInfo.visualizationKey,
        instanceId
      );

      editedDossier.instanceId = instanceId;
      editedDossier.isEdit = true;

      if (updatedVisualizationInfo) {
        editedDossier.visualizationInfo = updatedVisualizationInfo;
      }

      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedObject: editedDossier,
      });
      this.popupController.runEditDossierPopup(reportParams);
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      return this.errorService.handleError(error);
    }
  }

  resetState = () => (dispatch) => dispatch({ type: RESET_STATE, })
}

export const popupActions = new PopupActions();
