import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';

export const RESET_STATE = 'POPUP_RESET_STATE';
export const SET_REPORT_N_FILTERS = 'POPUP_SET_REPORT_N_FILTERS';
export const SET_PREPARED_REPORT = 'POPUP_SET_PREPARED_REPORT';
export const SWITCH_IMPORT_SUBTOTALS_ON_EDIT = 'POPUP_SWITCH_IMPORT_SUBTOTALS_ON_EDIT';
export const CLEAR_EDITED_OBJECT = 'POPUP_CLEAR_EDITED_OBEJECT';
export const UPDATE_DISPLAY_ATTR_FORM_ON_EDIT = 'POPUP_UPDATE_DISPLAY_ATTR_FORM_ON_EDIT';

class PopupActions {
  init = (
    errorService,
    officeApiHelper,
    officeReducerHelper,
    popupHelper,
    mstrObjectRestService,
    popupController,
    visualizationInfoService
  ) => {
    this.errorService = errorService;
    this.officeApiHelper = officeApiHelper;
    this.officeReducerHelper = officeReducerHelper;
    this.popupHelper = popupHelper;
    this.mstrObjectRestService = mstrObjectRestService;
    this.popupController = popupController;
    this.visualizationInfoService = visualizationInfoService;
  };

  callForReprompt = reportParams => async dispatch => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const editedObject = this.officeReducerHelper.getObjectFromObjectReducerByBindId(
        reportParams.bindId
      );
      editedObject.objectType = editedObject.mstrObjectType;

      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedObject,
      });
      this.popupController.runRepromptPopup(reportParams, false);
    } catch (error) {
      return this.errorService.handleError(error);
    }
  };

  callForEdit = reportParams => async dispatch => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const editedObject = this.officeReducerHelper.getObjectFromObjectReducerByBindId(
        reportParams.bindId
      );
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
      return this.errorService.handleError(error);
    }
  };

  preparePromptedReport = (instanceId, chosenObjectData) => dispatch =>
    dispatch({
      type: SET_PREPARED_REPORT,
      instanceId,
      chosenObjectData,
    });

  callForRepromptDossier = reportParams => async dispatch => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const repromptedDossier = this.officeReducerHelper.getObjectFromObjectReducerByBindId(
        reportParams.bindId
      );

      await this.prepareDossierForReprompt(repromptedDossier);

      dispatch({
        type: SET_REPORT_N_FILTERS,
        editedObject: repromptedDossier,
      });
      this.popupController.runRepromptDossierPopup(reportParams);
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      return this.errorService.handleError(error);
    }
  };

  callForEditDossier = reportParams => async dispatch => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const editedDossier = this.officeReducerHelper.getObjectFromObjectReducerByBindId(
        reportParams.bindId
      );

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

  resetState = () => dispatch => dispatch({ type: RESET_STATE });

  /**
   * Prepares object and passes it to excel popup in duplicate edit workflow and
   * passes reportParams (duplicateFlag, objectDataBeforeEdit) to PopupController.
   *
   * @param {Object} object - Data of duplicated object.
   */
  callForDuplicate = object => async dispatch => {
    const isDossier =
      object.mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;
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
        object,
      };

      if (isDossier) {
        this.popupController.runEditDossierPopup(reportParams);
      } else if (object.isPrompted) {
        this.popupController.runRepromptPopup(reportParams);
      } else {
        this.popupController.runEditFiltersPopup(reportParams);
      }
    } catch (error) {
      if (isDossier) {
        error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      }
      return this.errorService.handleError(error);
    }
  };

  /**
   * Creates instance of dossier which is used during edit workflow.
   *
   * @param {Object} editedDossier - Contains data of edited dossier.
   */
  prepareDossierForEdit = async editedDossier => {
    const { projectId, objectId, manipulationsXML, visualizationInfo } = editedDossier;

    const instance = await this.mstrObjectRestService.createDossierInstance(projectId, objectId, {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true,
    });

    let updatedVisualizationInfo;
    try {
      updatedVisualizationInfo = await this.visualizationInfoService.getVisualizationInfo(
        projectId,
        objectId,
        visualizationInfo.visualizationKey,
        instance.mid
      );
    } catch (ignoreError) {
      // Ignored
    }

    editedDossier.instanceId = instance.mid;
    editedDossier.isEdit = true;

    if (updatedVisualizationInfo) {
      const { vizDimensions } = visualizationInfo;
      editedDossier.visualizationInfo = {
        vizDimensions,
        ...updatedVisualizationInfo,
      };
    }
    editedDossier.objectType = editedDossier.mstrObjectType;
  };

  /**
   * Creates instance of dossier which is used during reprompt workflow.
   * @param {*} repromptedDossier
   */
  prepareDossierForReprompt = async repromptedDossier => {
    const { projectId, objectId, manipulationsXML, visualizationInfo } = repromptedDossier;

    const instance = await this.mstrObjectRestService.createDossierInstance(projectId, objectId, {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true,
    });

    let updatedVisualizationInfo;
    try {
      updatedVisualizationInfo = await this.visualizationInfoService.getVisualizationInfo(
        projectId,
        objectId,
        visualizationInfo.visualizationKey,
        instance.mid
      );
    } catch (ignoreError) {
      // Ignored
    }

    // Re-prompt the dossier to open prompts' popup
    const resp = await this.mstrObjectRestService.rePromptDossier(
      objectId,
      instance.mid,
      projectId
    );

    // Update dossier's instanceId with the new one
    repromptedDossier.instanceId = resp && resp.mid ? resp.mid : instance.mid;
    repromptedDossier.isEdit = true;

    if (updatedVisualizationInfo) {
      const { vizDimensions } = visualizationInfo;
      repromptedDossier.visualizationInfo = {
        vizDimensions,
        ...updatedVisualizationInfo,
      };
    }
    repromptedDossier.objectType = repromptedDossier.mstrObjectType;
  };

  switchImportSubtotalsOnEdit = data => dispatch =>
    dispatch({ type: SWITCH_IMPORT_SUBTOTALS_ON_EDIT, data });

  clearEditedObject = () => dispatch => {
    dispatch({ type: CLEAR_EDITED_OBJECT });
  };

  updateDisplayAttrFormOnEdit = data => dispatch => {
    dispatch({ type: UPDATE_DISPLAY_ATTR_FORM_ON_EDIT, data });
  };
}

export const popupActions = new PopupActions();
