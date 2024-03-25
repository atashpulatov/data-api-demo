import { Dispatch } from 'redux';

import { ObjectData } from '../../types/object-types';
import { PopupActionTypes } from './popup-reducer-types';

import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { DisplayAttrFormNames } from '../../mstr-object/constants';

class PopupActions {
  errorService: any;

  officeApiHelper: any;

  officeReducerHelper: any;

  popupHelper: any;

  mstrObjectRestService: any;

  popupController: any;

  visualizationInfoService: any;

  init = (
    errorService: any,
    officeApiHelper: any,
    officeReducerHelper: any,
    popupHelper: any,
    mstrObjectRestService: any,
    popupController: any,
    visualizationInfoService: any
  ): void => {
    this.errorService = errorService;
    this.officeApiHelper = officeApiHelper;
    this.officeReducerHelper = officeReducerHelper;
    this.popupHelper = popupHelper;
    this.mstrObjectRestService = mstrObjectRestService;
    this.popupController = popupController;
    this.visualizationInfoService = visualizationInfoService;
  };

  callForReprompt = (reportParams: any) => async (dispatch: Dispatch<any>) => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const editedObject = this.officeReducerHelper.getObjectFromObjectReducerByBindId(
        reportParams.bindId
      );
      editedObject.objectType = editedObject.mstrObjectType;

      dispatch({
        type: PopupActionTypes.SET_REPORT_N_FILTERS,
        editedObject,
      });
      this.popupController.runRepromptPopup(reportParams, false);
    } catch (error) {
      return this.errorService.handleError(error);
    }
  };

  callForEdit = (reportParams: any) => async (dispatch: Dispatch<any>) => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const editedObject = this.officeReducerHelper.getObjectFromObjectReducerByBindId(
        reportParams.bindId
      );
      editedObject.objectType = editedObject.mstrObjectType;

      dispatch({
        type: PopupActionTypes.SET_REPORT_N_FILTERS,
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

  preparePromptedReport =
    (instanceId: string, chosenObjectData: any) => (dispatch: Dispatch<any>) =>
      dispatch({
        type: PopupActionTypes.SET_PREPARED_REPORT,
        instanceId,
        chosenObjectData,
      });

  callForRepromptDossier = (reportParams: any) => async (dispatch: Dispatch<any>) => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const repromptedDossier = this.officeReducerHelper.getObjectFromObjectReducerByBindId(
        reportParams.bindId
      );

      try {
        await this.prepareDossierForReprompt(repromptedDossier);
      } catch (error) {
        // Report error in console and continue with reprompting and let operation handle the error
        // so it is propagated to the user in SidePanel or/and Overview dialog if opened.
        console.error('Error during preparing dossier for reprompt', error);
      }

      dispatch({
        type: PopupActionTypes.SET_REPORT_N_FILTERS,
        editedObject: repromptedDossier,
      });
      this.popupController.runRepromptDossierPopup(reportParams);
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      return this.errorService.handleError(error);
    }
  };

  callForEditDossier = (reportParams: any) => async (dispatch: Dispatch<any>) => {
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      const editedDossier = this.officeReducerHelper.getObjectFromObjectReducerByBindId(
        reportParams.bindId
      );

      await this.prepareDossierForEdit(editedDossier);

      dispatch({
        type: PopupActionTypes.SET_REPORT_N_FILTERS,
        editedObject: editedDossier,
      });
      this.popupController.runEditDossierPopup(reportParams);
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      return this.errorService.handleError(error);
    }
  };

  resetState = () => (dispatch: Dispatch<any>) => dispatch({ type: PopupActionTypes.RESET_STATE });

  /**
   * Prepares object and passes it to excel popup in duplicate edit workflow and
   * passes reportParams (duplicateFlag, objectDataBeforeEdit) to PopupController.
   *
   * @param object - Data of duplicated object.
   */
  callForDuplicate = (object: ObjectData) => async (dispatch: Dispatch<any>) => {
    const isDossier =
      object.mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;
    try {
      await this.officeApiHelper.checkStatusOfSessions();
      object.objectType = object.mstrObjectType;

      if (isDossier) {
        await this.prepareDossierForEdit(object);
      }

      dispatch({
        type: PopupActionTypes.SET_REPORT_N_FILTERS,
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
   * @param editedDossier - Contains data of edited dossier.
   */
  prepareDossierForEdit = async (editedDossier: ObjectData): Promise<void> => {
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
        // @ts-expect-error
        visualizationInfo.visualizationKey,
        instance.mid
      );
    } catch (ignoreError) {
      // Ignored
    }

    editedDossier.instanceId = instance.mid;
    editedDossier.isEdit = true;

    if (updatedVisualizationInfo) {
      // @ts-expect-error
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
   * @param repromptedDossier
   */
  prepareDossierForReprompt = async (repromptedDossier: ObjectData): Promise<void> => {
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
        // @ts-expect-error
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
      // @ts-expect-error
      const { vizDimensions } = visualizationInfo;
      repromptedDossier.visualizationInfo = {
        vizDimensions,
        ...updatedVisualizationInfo,
      };
    }
    repromptedDossier.objectType = repromptedDossier.mstrObjectType;
  };

  switchImportSubtotalsOnEdit = (data: any) => (dispatch: Dispatch<any>) =>
    dispatch({ type: PopupActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_EDIT, data });

  clearEditedObject = () => (dispatch: Dispatch<any>) => {
    dispatch({ type: PopupActionTypes.CLEAR_EDITED_OBJECT });
  };

  updateDisplayAttrFormOnEdit = (data: DisplayAttrFormNames) => (dispatch: Dispatch<any>) => {
    dispatch({ type: PopupActionTypes.UPDATE_DISPLAY_ATTR_FORM_ON_EDIT, data });
  };
}

export const popupActions = new PopupActions();
