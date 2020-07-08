import { officeProperties } from '../office-reducer/office-properties';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';

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
      const editedObject = this.officeReducerHelper.getObjectFromObjectReducerByBindId(reportParams.bindId);
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
      const editedDossier = this.officeReducerHelper.getObjectFromObjectReducerByBindId(reportParams.bindId);

      await this.prepareDossierForEdit(editedDossier);

      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedObject: editedDossier,
      });
      this.popupController.runEditDossierPopup(reportParams);
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      return this.errorService.handleError(error);
    }
  };

  resetState = () => (dispatch) => dispatch({ type: RESET_STATE, });

  /**
   * Prepares object and passes it to excel popup in duplicate edit workflow and
   * passes reportParams (duplicateFlag, objectDataBeforeEdit) to PopupController.
   *
   * @param {Object} object - Data of duplicated object.
   */
  callForDuplicate = (object) => async (dispatch) => {
    const isDossier = object.mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      object.objectType = object.mstrObjectType;

      if (isDossier) {
        await this.prepareDossierForEdit(object);
      }

      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedObject: object,
      });

      const reportParams = {
        duplicateMode: true,
        object
      };

      if (isDossier) {
        this.popupController.runEditDossierPopup(reportParams);
      } else if (object.isPrompted) {
        this.popupController.runRepromptPopup(reportParams);
      } else {
        this.popupController.runEditFiltersPopup(reportParams);
      }
    } catch (error) {
      dispatch({ type: officeProperties.actions.stopLoading });
      if (isDossier) {
        error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      }
      return this.errorService.handleError(error);
    }
  }

  /**
   * Creates instance of dossier which is used during edit workflow.
   *
   * @param {Object} editedDossier - Contains data of edited dossier.
   */
  prepareDossierForEdit = async (editedDossier) => {
    const {
      projectId, objectId, manipulationsXML, visualizationInfo
    } = editedDossier;

    const instanceId = await this.mstrObjectRestService.createDossierInstance(
      projectId,
      objectId,
      { ...manipulationsXML, disableManipulationsAutoSaving: true, persistViewState: true }
    );

    let updatedVisualizationInfo;
    try {
      updatedVisualizationInfo = await this.mstrObjectRestService.getVisualizationInfo(
        projectId,
        objectId,
        visualizationInfo.visualizationKey,
        instanceId,
      );
    } catch (ignoreError) {
      // Ignored
    }

    editedDossier.instanceId = instanceId;
    editedDossier.isEdit = true;

    if (updatedVisualizationInfo) {
      editedDossier.visualizationInfo = updatedVisualizationInfo;
    }
    editedDossier.objectType = editedDossier.mstrObjectType;
  }
}

export const popupActions = new PopupActions();