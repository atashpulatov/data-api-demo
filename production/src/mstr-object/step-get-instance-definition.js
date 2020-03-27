import { mstrObjectRestService } from './mstr-object-rest-service';
import mstrObjectEnum from './mstr-object-type-enum';
import { IMPORT_OPERATION } from '../operation/operation-steps';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { officeApiCrosstabHelper } from '../office/api/office-api-crosstab-helper';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import dossierInstanceDefinition from './dossier-instance-definition';

class StepGetInstanceDefinition {
  /**
   * Creates Instance definition object which contains data about MSTR object needed in next steps.
   *
   * If instance of an object does not exist, new one will be created.
   * All additional manipulations like prompts answers or body will be applied.
   *
   * This function is subscribed as one of the operation steps with the key GET_INSTANCE_DEFINITION,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.displayAttrFormNames The style in which attribute form will be displayed
   * @param {Boolean} objectData.insertNewWorksheet Determines if the object will be displayed in a new spreadsheet
   * @param {Object} objectData.subtotalsInfo Determines if subtotals will be displayed and stores subtotal addresses
   * @param {String} objectData.bindId Unique Id of the Office table used for referencing the table in Excel
   * @param {Object} objectData.visualizationInfo Contains information about location of visualization in dossier
   * @param {Office} operationData.operationType The type of the operation that called this function
   */
  getInstanceDefinition = async (objectData, { operationType }) => {
    console.group('Importing data performance');
    console.time('Total');

    const {
      objectWorkingId,
      insertNewWorksheet,
      crosstabHeaderDimensions,
      subtotalsInfo: { subtotalsAddresses } = false,
      bindId,
      mstrObjectType,
    } = objectData;
    let { visualizationInfo, body } = objectData;

    const excelContext = await officeApiHelper.getExcelContext();

    this.setupBodyTemplate(body);

    let instanceDefinition;
    if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
      ({ body, visualizationInfo, instanceDefinition } = await dossierInstanceDefinition.getDossierInstanceDefinition(
        { ...objectData, visualizationInfo }
      ));
    } else {
      instanceDefinition = await mstrObjectRestService.createInstance(objectData);
    }

    instanceDefinition = await this.modifyInstanceWithPrompt({ instanceDefinition, ...objectData });

    this.savePreviousObjectData(instanceDefinition, crosstabHeaderDimensions, subtotalsAddresses);

    const startCell = await this.getStartCell(insertNewWorksheet, excelContext, operationType);

    const { mstrTable } = instanceDefinition;
    const updatedObject = {
      objectWorkingId,
      envUrl: officeApiHelper.getCurrentMstrContext(),
      body,
      visualizationInfo: visualizationInfo || false,
      oldBindId: bindId,
      name: mstrTable.name,
      crosstabHeaderDimensions: mstrTable.crosstabHeaderDimensions,
      isCrosstab: mstrTable.isCrosstab,
    };

    const updatedOperation = {
      objectWorkingId,
      instanceDefinition,
      startCell,
      excelContext,
      totalRows: instanceDefinition.rows,
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
   * Setups body.template to be equal body.requestedObject.
   *
   * Deletes body.requestedObject when no attributes and metrics defined.
   *
   * @param {Object} body to modify template and requestedObject
   */
  setupBodyTemplate = (body) => {
    if (body && body.requestedObjects) {
      if (body.requestedObjects.attributes.length === 0 && body.requestedObjects.metrics.length === 0) {
        delete body.requestedObjects;
      }
      body.template = body.requestedObjects;
    }
  };

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

    // Status 2 = report has open prompts to be answered before data can be returned
    if (instanceDefinition.status !== 2) {
      return instanceDefinition;
    }

    try {
      let count = 0;

      while (instanceDefinition.status === 2 && count < promptsAnswers.length) {
        const config = {
          objectId,
          projectId,
          instanceId: instanceDefinition.instanceId,
          promptsAnswers: promptsAnswers[count]
        };

        await mstrObjectRestService.answerPrompts(config);

        const configInstance = {
          ...config,
          dossierData,
          body,
          displayAttrFormNames
        };

        if (count === promptsAnswers.length - 1) {
          instanceDefinition = await mstrObjectRestService.modifyInstance(configInstance);
        }

        count += 1;
      }

      return instanceDefinition;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  savePreviousObjectData = (instanceDefinition, crosstabHeaderDimensions, subtotalsAddresses) => {
    const { mstrTable } = instanceDefinition;
    mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions || false;
    mstrTable.crosstabHeaderDimensions = mstrTable.isCrosstab
      ? officeApiCrosstabHelper.getCrosstabHeaderDimensions(instanceDefinition)
      : false;
    mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
  };

  getStartCell = async (insertNewWorksheet, excelContext, operationType) => {
    if (insertNewWorksheet) {
      await officeApiWorksheetHelper.createAndActivateNewWorksheet(excelContext);
    }

    return operationType !== IMPORT_OPERATION || officeApiHelper.getSelectedCell(excelContext);
  };
}

const stepGetInstanceDefinition = new StepGetInstanceDefinition();
export default stepGetInstanceDefinition;
