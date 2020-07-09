import { mstrObjectRestService } from './mstr-object-rest-service';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import operationErrorHandler from '../operation/operation-error-handler';
import {
  getObjectPrompts, populateDetails, populateDefinition, getFilters
} from './get-object-details-methods';

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
        ancestors, certifiedInfo, dateModified, owner, name,
      } = await mstrObjectRestService.getObjectInfo(objectId, projectId, mstrObjectType);

      const prompts = await getObjectPrompts(objectData, objectId, projectId, operationData);

      const details = populateDetails(ancestors, certifiedInfo, dateModified, owner);
      const definition = populateDefinition(objectData, prompts, name);
      if (definition) {
        definition.filters = getFilters(operationData);
      }

      const updatedObject = {
        ...objectData,
        ...(details ? { details } : {}),
        ...(definition ? { definition } : {}),
      };

      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetObjectDetails(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepGetObjectDetails = new StepGetObjectDetails();
export default stepGetObjectDetails;
