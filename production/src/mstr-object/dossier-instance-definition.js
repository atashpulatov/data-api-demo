import mstrObjectEnum from './mstr-object-type-enum';
import { errorTypes, incomingErrorStrings, INVALID_VIZ_KEY_MESSAGE } from '../error/constants';
import { mstrObjectRestService } from './mstr-object-rest-service';
import { IMPORT_OPERATION, DUPLICATE_OPERATION } from '../operation/operation-type-names';

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

    const updatedVisualizationInfo = await mstrObjectRestService.getVisualizationInfo(
      projectId,
      objectId,
      visualizationInfo.visualizationKey,
      instanceId
    );

    if (!updatedVisualizationInfo) {
      throw new Error(INVALID_VIZ_KEY_MESSAGE);
    }

    visualizationInfo = updatedVisualizationInfo;

    const config = {
      projectId,
      objectId,
      instanceId,
      mstrObjectType: mstrObjectEnum.mstrObjectType.dossier.name,
      dossierData,
      body,
      visualizationInfo,
      displayAttrFormNames
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
      visualizationInfo,
      instanceDefinition
    };
  }

  getVisualizationName = (operationData, name, instanceDefinition, vizKeyChanged) => {
    const { objectEditedData, operationType } = operationData;

    if (operationType === IMPORT_OPERATION
      || (objectEditedData && objectEditedData.visualizationInfo.formatShouldUpdate)
      || (operationType === DUPLICATE_OPERATION && vizKeyChanged)) {
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
