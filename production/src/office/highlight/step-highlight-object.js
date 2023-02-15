import { officeApiHelper } from '../api/office-api-helper';
import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepHighlightObject {
  /**
  * Handles the highlighting of object.
  * Gets object from reducer based on objectWorkingId and
  * calls officeApiHelper.onBindingObjectClick to highlight object on Excel worksheet
  *
  * @param {Object} objectData Contaisn data about object on which operation was called
  * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
  */
  highlightObject = async (objectData, operationData) => {
    try {
      await officeApiHelper.onBindingObjectClick(objectData);
      operationStepDispatcher.completeHighlightObject(objectData.objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepHighlightObject = new StepHighlightObject();
export default stepHighlightObject;
