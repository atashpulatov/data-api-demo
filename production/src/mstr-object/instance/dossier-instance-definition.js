import mstrObjectEnum from '../mstr-object-type-enum';
import { mstrObjectRestService } from '../mstr-object-rest-service';
import { IMPORT_OPERATION } from '../../operation/operation-type-names';
import { errorService } from '../../error/error-handler';
import { errorTypes, incomingErrorStrings, errorMessages } from '../../error/constants';
import { visualizationInfoService } from '../visualization-info-service';

class DossierInstanceDefinition {
  async getDossierInstanceDefinition(
    {
      projectId,
      objectId,
      body,
      dossierData,
      displayAttrFormNames,
      manipulationsXML,
      preparedInstanceId,
      visualizationInfo,
    },
  ) {
    if (manipulationsXML) {
      if (!body) {
        body = {};
      }
      body.manipulations = manipulationsXML.manipulations;
      body.promptAnswers = manipulationsXML.promptAnswers;
    }

    let instanceId;
    try {
      instanceId = preparedInstanceId || (await mstrObjectRestService.createDossierInstance(projectId, objectId, body));
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier;
      throw error;
    }

    const updatedVisualizationInfo = await this.getUpdatedVisualizationInfo(
      projectId,
      objectId,
      visualizationInfo.visualizationKey,
      instanceId
    );

    const config = {
      projectId,
      objectId,
      instanceId,
      mstrObjectType: mstrObjectEnum.mstrObjectType.dossier.name,
      dossierData,
      body,
      visualizationInfo: updatedVisualizationInfo,
      displayAttrFormNames,
    };

    let temporaryInstanceDefinition;
    try {
      temporaryInstanceDefinition = await mstrObjectRestService.fetchVisualizationDefinition(config);
    } catch (error) {
      error.type = this.getVisualizationErrorType(error);
      throw error;
    }

    const instanceDefinition = {
      ...temporaryInstanceDefinition,
      instanceId
    };

    return {
      body,
      visualizationInfo: updatedVisualizationInfo,
      instanceDefinition,
    };
  }

  /**
   * Returns new visualization info object.
   *
   * If creating the visualization info fails and if the error is due to changed dossier structure,
   * throws the error that dossier removed has changed (errorMessages.DOSSIER_HAS_CHANGED).
   *
   * If there is no visualization for a given key, throws error that dossier doesn't exist (INVALID_VIZ_KEY_MESSAGE).
   *
   * @param {String} projectId Id of the project that object belongs
   * @param {String} objectId Id of the object itself
   * @param {String} visualizationKey visualization id.
   * @param {Object} instanceId Id of the created instance
   * @returns {Object} Contains info for visualization.
   *
   * @throws {Error} errorMessages.DOSSIER_HAS_CHANGED when dossier has changed.
   * @throws {Error} errorMessages.INVALID_VIZ_KEY_MESSAGE when dossier is not supported.
   */
  getUpdatedVisualizationInfo = async (projectId, objectId, visualizationKey, instanceId) => {
    try {
      const visualizationInfo = await visualizationInfoService.getVisualizationInfo(
        projectId,
        objectId,
        visualizationKey,
        instanceId
      );
      if (visualizationInfo) {
        return visualizationInfo;
      }
      throw new Error(errorMessages.DOSSIER_HAS_CHANGED);
    } catch (error) {
      if (errorService.getErrorMessage(error) === errorMessages.DOSSIER_HAS_CHANGED) {
        throw new Error(errorMessages.DOSSIER_HAS_CHANGED);
      }
      throw new Error(errorMessages.INVALID_VIZ_KEY_MESSAGE);
    }
  };

  getVisualizationName = (operationData, name, instanceDefinition) => {
    const { objectEditedData, operationType } = operationData;

    if (operationType === IMPORT_OPERATION
      || (objectEditedData && objectEditedData.visualizationInfo
        && objectEditedData.visualizationInfo.nameAndFormatShouldUpdate)) {
      name = instanceDefinition.mstrTable.name;
    }
    return name;
  };

  /**
   * Returns an error type based on error get from visualization importing.
   *
   * @param {Object} error
   * @return {String || undefined} errorType
   */
  getVisualizationErrorType = (error) => {
    if (!error) {
      return;
    }

    let errorType = error.type;
    if ((error.message && error.message.includes(incomingErrorStrings.INVALID_VIZ_KEY))
      || (error.response
        && error.response.body
        && error.response.body.message
        && error.response.body.message.includes(incomingErrorStrings.INVALID_VIZ_KEY))
    ) {
      errorType = errorTypes.INVALID_VIZ_KEY;
    }

    return errorType;
  };
}

const dossierInstanceDefinition = new DossierInstanceDefinition();
export default dossierInstanceDefinition;
