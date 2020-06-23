import { mstrObjectRestService } from './mstr-object-rest-service';
import mstrObjectEnum from './mstr-object-type-enum';
import { GET_OFFICE_TABLE_IMPORT } from '../operation/operation-steps';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { officeApiCrosstabHelper } from '../office/api/office-api-crosstab-helper';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import dossierInstanceDefinition from './dossier-instance-definition';
import operationErrorHandler from '../operation/operation-error-handler';
import { ALL_DATA_FILTERED_OUT, NO_DATA_RETURNED } from '../error/constants';

class StepGetObjectDetails {
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
  getObjectDetails = async (objectData, operationData) => {
    try {
      const {
        objectWorkingId,
        objectId,
        projectId,
        mstrObjectType,
      } = objectData;

      // console.log('objectData');
      // console.log(objectData);
      // console.log('operationData');
      // console.log(operationData);

      const objectInfo = await mstrObjectRestService.getObjectInfo(objectId, projectId, mstrObjectType);
      const {
        ancestors, certifiedInfo, dateModified, owner,
      } = objectInfo;

      const objectPrompts = objectData.promptsAnswers && (await mstrObjectRestService
        .getObjectPrompts(objectId, projectId, operationData.instanceDefinition.instanceId))
        .map(this.extractPromptAnswerName);


      // console.log('objectInfo');
      // console.log(objectInfo);

      // console.log('objectPrompts');
      // console.log(objectPrompts);

      const updatedObject = {
        ...objectData,
        details: {
          ancestors,
          certified: certifiedInfo,
          modifiedDate: dateModified,
          owner,
          importedBy: officeApiHelper.getCurrentMstrUserFullName(),
        },
        definition: {
          ...objectData.definition,
          prompts: objectPrompts || null
        },
      };

      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetObjectDetails(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };

  promptAnswerMapFunctions = {
    OBJECTS: (prompt) => prompt.answers.map(answer => answer.name),
    LEVEL: (prompt) => prompt.answers.units.map(unit => unit.name),
    EXPRESSION: (prompt) => prompt.answers.content,
    ELEMENTS: (prompt) => prompt.answers.map(answer => answer.name),
    VALUE: (prompt) => prompt.answers,
  };

  extractPromptAnswerName = (prompt) => this.promptAnswerMapFunctions[prompt.type](prompt);
}

const stepGetObjectDetails = new StepGetObjectDetails();
export default stepGetObjectDetails;
