import { errorService } from '../../error/error-service';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { visualizationInfoService } from '../../mstr-object/visualization-info-service';

import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';
import { DialogToOpen } from '../office-reducer/office-reducer-types';

import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { officeActions } from '../office-reducer/office-actions';
import { popupActions } from './popup-actions';

class PopupHelper {
  callForReprompt = (objectData: ObjectData): void => {
    objectData.objectType = objectData.mstrObjectType;
    reduxStore.dispatch(popupActions.setReportAndFilters(objectData));
    reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.REPROMPT_POPUP));
    reduxStore.dispatch(popupActions.setIsEdit(false));
  };

  callForEdit = (objectData: ObjectData): void => {
    objectData.objectType = objectData.mstrObjectType;
    reduxStore.dispatch(popupActions.setReportAndFilters(objectData));

    if (objectData.isPrompted) {
      reduxStore.dispatch(popupActions.setIsEdit(true));
      reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.REPROMPT_POPUP));
    } else {
      reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.EDIT_FILTERS_POPUP));
    }
  };

  callForRepromptDossier = async (objectData: ObjectData): Promise<void> => {
    try {
      await this.prepareDossierForReprompt(objectData);
    } catch (error) {
      // Report error in console and continue with reprompting and let operation handle the error
      // so it is propagated to the user in SidePanel or/and Overview dialog if opened.
      console.error('Error during preparing dossier for reprompt', error);
    }

    reduxStore.dispatch(popupActions.setReportAndFilters(objectData));
    reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.REPROMPT_DOSSIER_POPUP));
  };

  callForEditDossier = async (objectData: ObjectData): Promise<void> => {
    try {
      await this.prepareDossierForEdit(objectData);

      reduxStore.dispatch(popupActions.setReportAndFilters(objectData));
      reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.EDIT_DOSSIER_POPUP));
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      errorService.handleError(error);
    }
  };

  /**
   * Prepares object and passes it to excel popup in duplicate edit workflow and
   * passes reportParams (duplicateFlag, objectDataBeforeEdit) to DialogController.
   *
   * @param objectData - Data of duplicated object.
   */
  callForDuplicate = async (objectData: ObjectData): Promise<void> => {
    const isDossier =
      objectData.mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;
    try {
      objectData.objectType = objectData.mstrObjectType;

      if (isDossier) {
        await this.prepareDossierForEdit(objectData);
      }

      reduxStore.dispatch(popupActions.setIsDuplicate(true));
      reduxStore.dispatch(popupActions.setReportAndFilters(objectData));

      if (isDossier) {
        reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.EDIT_DOSSIER_POPUP));
      } else if (objectData.isPrompted) {
        reduxStore.dispatch(popupActions.setIsEdit(true));
        reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.REPROMPT_POPUP));
      } else {
        reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.EDIT_FILTERS_POPUP));
      }
    } catch (error) {
      if (isDossier) {
        error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      }
      errorService.handleError(error);
    }
  };

  /**
   * Creates instance of dossier which is used during edit workflow.
   *
   * @param editedDossier - Contains data of edited dossier.
   */
  prepareDossierForEdit = async (editedDossier: any): Promise<void> => {
    const { projectId, objectId, manipulationsXML, visualizationInfo } = editedDossier;

    const instance = await mstrObjectRestService.createDossierInstance(projectId, objectId, {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true,
    });

    let updatedVisualizationInfo;
    try {
      ({ vizInfo: updatedVisualizationInfo } = await visualizationInfoService.getVisualizationInfo(
        projectId,
        objectId,
        visualizationInfo.visualizationKey,
        instance.mid
      ));
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
   * @param repromptedDossier
   */
  prepareDossierForReprompt = async (repromptedDossier: any): Promise<void> => {
    const { projectId, objectId, manipulationsXML, visualizationInfo } = repromptedDossier;

    const instance = await mstrObjectRestService.createDossierInstance(projectId, objectId, {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true,
    });

    let updatedVisualizationInfo;
    try {
      ({ vizInfo: updatedVisualizationInfo } = await visualizationInfoService.getVisualizationInfo(
        projectId,
        objectId,
        visualizationInfo.visualizationKey,
        instance.mid
      ));
    } catch (ignoreError) {
      // Ignored
    }

    // Re-prompt the dossier to open prompts' popup
    const resp = await mstrObjectRestService.rePromptDossier(objectId, instance.mid, projectId);

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
}

export const popupHelper = new PopupHelper();
