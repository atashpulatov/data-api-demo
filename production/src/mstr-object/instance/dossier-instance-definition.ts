import { mstrObjectRestService } from '../mstr-object-rest-service';
import { visualizationInfoService } from '../visualization-info-service';

import {
  InstanceDefinition,
  OperationData,
} from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, VisualizationInfo } from '../../types/object-types';

import { errorService } from '../../error/error-handler';
import { OperationTypes } from '../../operation/operation-type-names';
import mstrObjectEnum from '../mstr-object-type-enum';
import { ErrorMessages, ErrorType, IncomingErrorStrings } from '../../error/constants';

class DossierInstanceDefinition {
  async getDossierInstanceDefinition({
    projectId,
    objectId,
    body,
    dossierData,
    displayAttrFormNames,
    manipulationsXML,
    preparedInstanceId,
    visualizationInfo,
  }: ObjectData): Promise<{
    body: any;
    visualizationInfo: VisualizationInfo;
    instanceDefinition: InstanceDefinition;
  }> {
    if (manipulationsXML) {
      if (!body) {
        body = {};
      }
      body.manipulations = manipulationsXML.manipulations;
      body.promptAnswers = manipulationsXML.promptAnswers;
    }

    let instanceId: string;
    try {
      if (preparedInstanceId) {
        instanceId = preparedInstanceId;
      } else {
        const instance = await mstrObjectRestService.createDossierInstance(
          projectId,
          objectId,
          body
        );
        instanceId = instance.mid;
      }
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      throw error;
    }

    const updatedVisualizationInfo = await this.getUpdatedVisualizationInfo(
      projectId,
      objectId,
      // @ts-expect-error
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
      temporaryInstanceDefinition =
        await mstrObjectRestService.fetchVisualizationDefinition(config);
    } catch (error) {
      error.type = this.getVisualizationErrorType(error);
      throw error;
    }

    const instanceDefinition = {
      ...temporaryInstanceDefinition,
      instanceId,
    };

    return {
      body,
      visualizationInfo: updatedVisualizationInfo,
      // @ts-expect-error
      instanceDefinition,
    };
  }

  /**
   * Returns new visualization info object.
   *
   * If creating the visualization info fails and if the error is due to changed dossier structure,
   * throws the error that dossier removed has changed (ErrorMessages.DOSSIER_HAS_CHANGED).
   *
   * If there is no visualization for a given key, throws error that dossier doesn't exist (INVALID_VIZ_KEY_MESSAGE).
   *
   * @param projectId Id of the project that object belongs
   * @param objectId Id of the object itself
   * @param visualizationKey visualization id.
   * @param instanceId Id of the created instance
   * @return Contains info for visualization.
   *
   * @throws ErrorMessages.DOSSIER_HAS_CHANGED when dossier has changed.
   * @throws ErrorMessages.INVALID_VIZ_KEY_MESSAGE when dossier is not supported.
   */
  getUpdatedVisualizationInfo = async (
    projectId: string,
    objectId: string,
    visualizationKey: string,
    instanceId: string
  ): Promise<any> => {
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
      throw new Error(ErrorMessages.DOSSIER_HAS_CHANGED);
    } catch (error) {
      if (errorService.getErrorMessage(error) === ErrorMessages.DOSSIER_HAS_CHANGED) {
        throw new Error(ErrorMessages.DOSSIER_HAS_CHANGED);
      }
      throw new Error(ErrorMessages.INVALID_VIZ_KEY_MESSAGE);
    }
  };

  getVisualizationName = (
    operationData: OperationData,
    name: string,
    instanceDefinition: InstanceDefinition
  ): string => {
    const { objectEditedData, operationType } = operationData;

    if (
      operationType === OperationTypes.IMPORT_OPERATION ||
      (objectEditedData &&
        objectEditedData.visualizationInfo &&
        objectEditedData.visualizationInfo.nameAndFormatShouldUpdate)
    ) {
      name = instanceDefinition.mstrTable.name;
    }
    return name;
  };

  /**
   * Returns an error type based on error get from visualization importing.
   *
   * @param error
   * @return errorType
   */
  getVisualizationErrorType = (error: any): string | undefined => {
    if (!error) {
      return;
    }

    let errorType = error.type;
    if (
      (error.message && error.message.includes(IncomingErrorStrings.INVALID_VIZ_KEY)) ||
      (error.response &&
        error.response.body &&
        error.response.body.message &&
        error.response.body.message.includes(IncomingErrorStrings.INVALID_VIZ_KEY))
    ) {
      errorType = ErrorType.INVALID_VIZ_KEY;
    }

    return errorType;
  };
}

const dossierInstanceDefinition = new DossierInstanceDefinition();
export default dossierInstanceDefinition;
