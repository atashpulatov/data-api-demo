import mstrObjectEnum from './mstr-object-type-enum';
import {
  errorTypes, incomingErrorStrings, INVALID_VIZ_KEY_MESSAGE, DOSSIER_HAS_CHANGED
} from '../error/constants';
import { mstrObjectRestService } from './mstr-object-rest-service';
import { IMPORT_OPERATION } from '../operation/operation-type-names';
import { errorService } from '../error/error-handler';

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
   * If creating the visualization info fails and if the error is due to changed dossier structure, throws the error that dossier is removed has changed.
   * Or throws error that dossier structure
   *
   * @param {String} projectId
   * @param {String} objectId
   * @param {String} visualizationKey visualization id.
   * @param {Object} instanceId
   * @returns {Object} Contains info for visualization.
   * @throws {Error} Dossier has changed.
   * @throws {Error} Dossier is not supported
   */
  getUpdatedVisualizationInfo = async (projectId, objectId, visualizationKey, instanceId) => {
    try {
      return await mstrObjectRestService.getVisualizationInfo(
        projectId,
        objectId,
        visualizationKey,
        instanceId
      );
    } catch (error) {
      if (errorService.getErrorMessage(error) === DOSSIER_HAS_CHANGED) {
        throw new Error(DOSSIER_HAS_CHANGED);
      }
    }
    throw new Error(INVALID_VIZ_KEY_MESSAGE);
  }

  getVisualizationName = (operationData, name, instanceDefinition) => {
    const { objectEditedData, operationType } = operationData;

    if (operationType === IMPORT_OPERATION
      || (objectEditedData && objectEditedData.visualizationInfo
        && objectEditedData.visualizationInfo.nameAndFormatShouldUpdate)) {
      name = instanceDefinition.mstrTable.name;
    }
    return name;
  }

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
