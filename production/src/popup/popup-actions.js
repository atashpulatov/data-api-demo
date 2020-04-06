import { officeProperties } from '../office/store/office-properties';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';

export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';
export const START_REPORT_LOADING = 'START_REPORT_LOADING';
export const STOP_REPORT_LOADING = 'STOP_REPORT_LOADING';
export const RESET_STATE = 'RESET_STATE';
export const SET_REPORT_N_FILTERS = 'SET_REPORT_N_FILTERS';
export const SET_PREPARED_REPORT = 'SET_PREPARED_REPORT';
// export const PRELOAD = 'PRELOAD';
class PopupActions {
  init = (
    errorService,
    officeApiHelper,
    officeReducerHelper,
    popupHelper,
    mstrObjectRestService,
    popupController
  ) => {
    this.errorService = errorService;
    this.officeApiHelper = officeApiHelper;
    this.officeReducerHelper = officeReducerHelper;
    this.popupHelper = popupHelper;
    this.mstrObjectRestService = mstrObjectRestService;
    this.popupController = popupController;
  };

  callForEdit = (reportParams) => async (dispatch) => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const editedObject = this.officeReducerHelper.getObjectFromObjectReducer(reportParams.bindId);
      editedObject.objectType = editedObject.mstrObjectType;

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
  };

  preparePromptedReport = (instanceId, chosenObjectData) => (dispatch) => dispatch({
    type: SET_PREPARED_REPORT,
    instanceId,
    chosenObjectData,
  });

  callForEditDossier = (reportParams) => async (dispatch) => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const editedDossier = this.officeReducerHelper.getObjectFromObjectReducer(reportParams.bindId);

      const {
        projectId, objectId, manipulationsXML, visualizationInfo
      } = editedDossier;

      const instanceId = await this.mstrObjectRestService.createDossierInstance(
        projectId,
        objectId,
        { ...manipulationsXML, disableManipulationsAutoSaving: true, persistViewState: true }
      );

      const updatedVisualizationInfo = await this.mstrObjectRestService.getVisualizationInfo(
        projectId,
        objectId,
        visualizationInfo.visualizationKey,
        instanceId
      );

      editedDossier.instanceId = instanceId;
      editedDossier.isEdit = true;

      if (updatedVisualizationInfo) {
        editedDossier.visualizationInfo = updatedVisualizationInfo;
      }

      editedDossier.objectType = editedDossier.mstrObjectType;
      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedObject: editedDossier,
      });
      console.log('instanceId:', instanceId);
      this.popupController.runEditDossierPopup(reportParams);
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      return this.errorService.handleError(error);
    }
  };

  resetState = () => (dispatch) => dispatch({ type: RESET_STATE, });
}

export const popupActions = new PopupActions();
