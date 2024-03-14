import { authenticationHelper } from '../../authentication/authentication-helper';
import { ObjectExecutionStatus } from '../../helpers/prompts-handling-helper';
import { officeApiCrosstabHelper } from '../../office/api/office-api-crosstab-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { mstrObjectRestService } from '../mstr-object-rest-service';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { GET_OFFICE_TABLE_IMPORT } from '../../operation/operation-steps';
import mstrObjectEnum from '../mstr-object-type-enum';
import dossierInstanceDefinition from './dossier-instance-definition';
import { ErrorMessages } from '../../error/constants';
import { importOperationStepDict, objectImportType } from '../constants';

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
   * @param {Array} operationData.stepsQueue Queue of steps in current operation
   */
  getInstanceDefinition = async (objectData, operationData) => {
    console.group('Getting Instance definition');
    console.time('Total');

    try {
      const futureStep = operationData.stepsQueue[2];

      const {
        objectWorkingId,
        insertNewWorksheet,
        crosstabHeaderDimensions,
        subtotalsInfo = false,
        bindId,
        mstrObjectType,
        isPrompted,
        definition,
        importType,
      } = objectData;
      let { visualizationInfo, body, name } = objectData;

      const excelContext = await officeApiHelper.getExcelContext();

      this.setupBodyTemplate(body);

      let startCell;
      let instanceDefinition;
      let shouldRenameExcelWorksheet = false;

      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
        ({ body, visualizationInfo, instanceDefinition } =
          await dossierInstanceDefinition.getDossierInstanceDefinition({
            ...objectData,
            visualizationInfo,
          }));

        name = dossierInstanceDefinition.getVisualizationName(
          operationData,
          name,
          instanceDefinition
        );
      } else {
        instanceDefinition = await mstrObjectRestService.createInstance(objectData);
      }

      // TODO check if dossierData is still needed
      instanceDefinition = await this.modifyInstanceWithPrompt({
        instanceDefinition,
        ...objectData,
      });

      this.savePreviousObjectData(
        instanceDefinition,
        crosstabHeaderDimensions,
        subtotalsInfo.subtotalsAddresses,
        futureStep,
        importType
      );

      // FIXME: below flow should not be part of this step
      if (futureStep in importOperationStepDict) {
        startCell = await officeApiWorksheetHelper.getStartCell(
          insertNewWorksheet,
          excelContext,
          name
        );
      }
      if (insertNewWorksheet) {
        delete objectData.insertNewWorksheet;
      } else {
        shouldRenameExcelWorksheet =
          await officeApiWorksheetHelper.isActiveWorksheetEmpty(excelContext);
      }

      const { mstrTable } = instanceDefinition;
      const updatedObject = {
        objectWorkingId,
        envUrl: authenticationHelper.getCurrentMstrContext(),
        body,
        visualizationInfo: visualizationInfo || false,
        name: name || mstrTable.name,
        manipulationsXML: instanceDefinition.manipulationsXML || false,
        definition: {
          ...definition,
          attributes: mstrTable.attributes,
          metrics: mstrTable.metrics,
        },
      };

      const updatedOperation = {
        objectWorkingId,
        instanceDefinition,
        excelContext,
        shouldRenameExcelWorksheet,
      };

      if (importType === objectImportType.TABLE) {
        // update table specific props
        updatedObject.crosstabHeaderDimensions = mstrTable.crosstabHeaderDimensions;
        updatedObject.isCrosstab = mstrTable.isCrosstab;
        updatedObject.subtotalsInfo = subtotalsInfo;
        updatedOperation.startCell = startCell;
        updatedOperation.oldBindId = bindId;
        updatedOperation.totalRows = instanceDefinition.rows;
      }

      if (mstrTable.rows.length === 0) {
        throw new Error(
          isPrompted ? ErrorMessages.ALL_DATA_FILTERED_OUT : ErrorMessages.NO_DATA_RETURNED
        );
      }

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetInstanceDefinition(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };

  /**
   * Setups body.template to be equal body.requestedObject.
   *
   * Deletes body.requestedObject when no attributes and metrics defined.
   *
   * @param {Object} body to modify template and requestedObject
   */
  setupBodyTemplate = body => {
    if (body && body.requestedObjects) {
      if (
        body.requestedObjects.attributes.length === 0 &&
        body.requestedObjects.metrics.length === 0
      ) {
        delete body.requestedObjects;
      }
      body.template = body.requestedObjects;
    }
  };

  /**
   * Answers prompts and modify instance of the object.
   *
   * @param {Object} instanceDefinition Object containing information about MSTR object
   * @param {String} objectId Id object neing currentrly imported
   * @param {String} projectId Id of the Mstr project which object is part of
   * @param {Object} promptsAnswers Stored prompt answers
   * @param {Object} dossierData
   * @param {Object} body Contains requested objects and filters.
   */
  modifyInstanceWithPrompt = async ({
    instanceDefinition,
    objectId,
    projectId,
    promptsAnswers,
    dossierData,
    body,
    displayAttrFormNames,
  }) => {
    // Status 2 = report has open prompts to be answered before data can be returned
    if (instanceDefinition.status !== ObjectExecutionStatus.PROMPTED) {
      return instanceDefinition;
    }

    try {
      let count = 0;

      while (
        instanceDefinition.status === ObjectExecutionStatus.PROMPTED &&
        count < promptsAnswers.length
      ) {
        const config = {
          objectId,
          projectId,
          instanceId: instanceDefinition.instanceId,
          promptsAnswers: promptsAnswers[count],
        };

        await mstrObjectRestService.answerPrompts(config);

        const configInstance = {
          ...config,
          dossierData,
          body,
          displayAttrFormNames,
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

  /**
   * Answers prompts and modify instance of the object.
   *
   * @param {Object} instanceDefinition Object containing information about MSTR object
   * @param {Object} crosstabHeaderDimensions Contains information about crosstab headers dimensions
   * @param {Object[]} subtotalsAddresses Contains adresses of subtotals from first import
   * @param {String} futureStep Specifies which step wuill be used to create Excel table
   */
  savePreviousObjectData = (
    instanceDefinition,
    crosstabHeaderDimensions,
    subtotalsAddresses,
    futureStep,
    importType = objectImportType.TABLE
  ) => {
    // We do not need to set prevCrosstabDimensions, crosstabHeaderDimensions and subtotalsInfo for images
    if (importType === objectImportType.IMAGE) {
      return;
    }
    const { mstrTable } = instanceDefinition;

    if (crosstabHeaderDimensions && futureStep !== GET_OFFICE_TABLE_IMPORT) {
      mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions;
    } else {
      mstrTable.prevCrosstabDimensions = false;
    }
    mstrTable.crosstabHeaderDimensions = mstrTable.isCrosstab
      ? officeApiCrosstabHelper.getCrosstabHeaderDimensions(instanceDefinition)
      : false;
    mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
  };
}

const stepGetInstanceDefinition = new StepGetInstanceDefinition();
export default stepGetInstanceDefinition;
