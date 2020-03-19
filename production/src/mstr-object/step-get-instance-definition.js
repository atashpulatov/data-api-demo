import { mstrObjectRestService } from './mstr-object-rest-service';
import mstrObjectEnum from './mstr-object-type-enum';
import { incomingErrorStrings, errorTypes, INVALID_VIZ_KEY_MESSAGE } from '../error/constants';

import { IMPORT_OPERATION } from '../operation/operation-steps';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { officeApiCrosstabHelper } from '../office/api/office-api-crosstab-helper';
import operationStepDispatcher from '../operation/operation-step-dispatcher';


const {
  getVisualizationInfo,
  createInstance,
  answerPrompts,
  modifyInstance,
  createDossierInstance,
  fetchVisualizationDefinition,
} = mstrObjectRestService;

class StepGetInstanceDefinition {
  /**
   * Create Instance definition object which stores data neede to continue import.
   * If instance of object does not exist new one will be created
   *
   * @param {Object} [body] Contains requested objects and filters
   * @param {Object} mstrObjectType Contains objectId, projectId, dossierData, mstrObjectType used in request
   * @param {Object} [preparedInstanceId] Instance Id of the object
   * @param {String} projectId
   * @param {String} objectId
   * @param {Object} [dossierData]
   * @param {Object} [visualizationInfo]
   * @param {Object} [promptsAnswers]
   * @param {Object} [crosstabHeaderDimensions] Contains previous dimensions of crosstab headers.
   * @param {Array} [subtotalsAddresses] Contains previous subtotal addresses
   * @param {Boolean} subtotalsDefined Information if the report has subtotals
   * @param {Boolean} subtotalsVisible Information if the subtotals are visible
   * @returns {Object} Object containing officeTable and subtotalAddresses
   */
   getInstanceDefinition = async (objectData, { operationType }) => {
     const {
       objectWorkingId,
       displayAttrFormNames,
       insertNewWorksheet,
       crosstabHeaderDimensions,
       subtotalsInfo: { subtotalsAddresses } = false,
       newBindingId,
     } = objectData;
     let { visualizationInfo, startCell } = objectData;

     const connectionData = {
       objectId: objectData.objectId,
       projectId: objectData.projectId,
       dossierData: objectData.dossierData,
       mstrObjectType: objectData.mstrObjectType,
       body: objectData.body,
       preparedInstanceId: objectData.preparedInstanceId,
       manipulationsXML: objectData.manipulationsXML,
       promptsAnswers: objectData.promptsAnswers,
     };

     const excelContext = await officeApiHelper.getExcelContext();

     // Get excel context and initial cell
     console.group('Importing data performance');
     console.time('Total');
     startCell = await this.getStartCell(insertNewWorksheet, excelContext, operationType);

     let instanceDefinition;
     let { body } = connectionData;
     const { mstrObjectType } = connectionData;

     if (body && body.requestedObjects) {
       if (body.requestedObjects.attributes.length === 0 && body.requestedObjects.metrics.length === 0) {
         delete body.requestedObjects;
       }
       body.template = body.requestedObjects;
     }

     const config = {
       ...connectionData,
       displayAttrFormNames,
     };

     if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
       ({ body, visualizationInfo, instanceDefinition } = await this.getDossierInstanceDefinition(
         { ...config, visualizationInfo }
       ));
     } else {
       instanceDefinition = await createInstance(config);
     }


     // Status 2 = report has open prompts to be answered before data can be returned
     if (instanceDefinition.status === 2) {
       instanceDefinition = await this.modifyInstanceWithPrompt({ instanceDefinition, ...config });
     }

     this.savePreviousObjectData(instanceDefinition, crosstabHeaderDimensions, subtotalsAddresses);

     const updatedObject = {
       objectWorkingId,
       envUrl: officeApiHelper.getCurrentMstrContext(),
       body,
       visualizationInfo: visualizationInfo || false,
       bindingId: newBindingId,
     };

     const updatedOperation = {
       objectWorkingId,
       instanceDefinition,
       startCell,
       excelContext,
     };
     // TODO add when error handlind added
     // Check if instance returned data
     //  if (mstrTable.rows.length === 0) {
     //    return {
     //      type: 'warning',
     //      message: isPrompted ? ALL_DATA_FILTERED_OUT : NO_DATA_RETURNED,
     //    };
     //  }

     operationStepDispatcher.updateOperation(updatedOperation);
     operationStepDispatcher.updateObject(updatedObject);
     operationStepDispatcher.completeGetInstanceDefinition(objectWorkingId);
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
      instanceId = preparedInstanceId || (await createDossierInstance(projectId, objectId, body));
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier;
      throw error;
    }

    const updatedVisualizationInfo = await getVisualizationInfo(
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
      temporaryInstanceDefinition = await fetchVisualizationDefinition(config);
    } catch (error) {
      error.type = this.getVisualizationErrorType(error);
      throw error;
    }
    const instanceDefinition = {
      ...temporaryInstanceDefinition,
      instanceId
    };
    return { body, visualizationInfo, instanceDefinition };
  }

  /**
   * Answers prompts and modify instance of the object.
   *
   * @param {Object} instanceDefinition
   * @param {String} objectId
   * @param {String} projectId
   * @param {Object} promptsAnswers Stored prompt answers
   * @param {Object} dossierData
   * @param {Object} body Contains requested objects and filters.
   */
  modifyInstanceWithPrompt = async (
    {
      instanceDefinition,
      objectId,
      projectId,
      promptsAnswers,
      dossierData,
      body,
      displayAttrFormNames
    }) => {
    try {
      let count = 0;
      while (instanceDefinition.status === 2 && count < promptsAnswers.length) {
        const config = {
          objectId,
          projectId,
          instanceId: instanceDefinition.instanceId,
          promptsAnswers: promptsAnswers[count]
        };

        await answerPrompts(config);
        const configInstance = {
          ...config,
          dossierData,
          body,
          displayAttrFormNames
        };
        if (count === promptsAnswers.length - 1) {
          instanceDefinition = await modifyInstance(configInstance);
        }
        count += 1;
      }
      return instanceDefinition;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  savePreviousObjectData = (instanceDefinition, crosstabHeaderDimensions, subtotalsAddresses) => {
    const { mstrTable } = instanceDefinition;
    mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions || false;
    mstrTable.crosstabHeaderDimensions = mstrTable.isCrosstab
      ? officeApiCrosstabHelper.getCrosstabHeaderDimensions(instanceDefinition)
      : false;
    mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
  }

  getStartCell = async (insertNewWorksheet, excelContext, operationType) => {
    if (insertNewWorksheet) {
      await officeApiWorksheetHelper.createAndActivateNewWorksheet(excelContext);
    }
    return operationType !== IMPORT_OPERATION || officeApiHelper.getSelectedCell(excelContext);
  }
}

const stepGetInstanceDefinition = new StepGetInstanceDefinition();
export default stepGetInstanceDefinition;
