import { mstrObjectRestService } from './mstr-object-rest-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import operationErrorHandler from '../operation/operation-error-handler';
import {authenticationHelper} from '../authentication/authentication-helper';

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

      const {
        ancestors, certifiedInfo, dateModified, owner,
      } = await mstrObjectRestService.getObjectInfo(objectId, projectId, mstrObjectType);

      const prompts = await getObjectPrompts(objectData, objectId, projectId, operationData);

      const details = populateDetails(ancestors, certifiedInfo, dateModified, owner);
      const definition = populateDefinition(objectData, prompts);

      const updatedObject = {
        ...objectData,
        details,
        definition,
      };

      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetObjectDetails(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const getObjectPrompts = async (objectData, objectId, projectId, operationData) => {
  if (objectData.promptsAnswers) {
    return (await mstrObjectRestService
      .getObjectPrompts(objectId, projectId, operationData.instanceDefinition.instanceId))
      .map((prompt) => promptAnswerFunctionsMap[prompt.type](prompt));
  }
};

const promptAnswerFunctionsMap = {
  OBJECTS: (prompt) => prompt.answers.map(answer => answer.name),
  LEVEL: (prompt) => prompt.answers.units.map(unit => unit.name),
  EXPRESSION: (prompt) => prompt.answers.content,
  ELEMENTS: (prompt) => prompt.answers.map(answer => answer.name),
  VALUE: (prompt) => prompt.answers,
};

const populateDefinition = (objectData, prompts) => {
  if (prompts) {
    return {
      ...objectData.definition,
      prompts,
    };
  }
  return { ...objectData.definition };
};

const populateDetails = (ancestors, certifiedInfo, dateModified, owner) => ({
  ancestors,
  certified: certifiedInfo,
  modifiedDate: dateModified,
  owner,
  importedBy: authenticationHelper.getCurrentMstrUserFullName(),
});

const stepGetObjectDetails = new StepGetObjectDetails();
export default stepGetObjectDetails;
