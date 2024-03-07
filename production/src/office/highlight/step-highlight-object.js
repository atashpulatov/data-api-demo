import { sidePanelService } from '../../right-side-panel/side-panel-service';
import { officeApiHelper } from '../api/office-api-helper';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { objectImportType } from '../../mstr-object/constants';

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
      // Highlight operation is not supported for images as Excel API does not support shape selection as of now
      if (objectData?.importType === objectImportType.IMAGE) {
        sidePanelService.highlightImageObject(objectData);
      } else {
        await officeApiHelper.onBindingObjectClick(objectData);
      }

      operationStepDispatcher.completeHighlightObject(objectData.objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepHighlightObject = new StepHighlightObject();
export default stepHighlightObject;
