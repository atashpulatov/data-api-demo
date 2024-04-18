import { sidePanelHelper } from '../../right-side-panel/side-panel-services/side-panel-helper';
import { officeApiHelper } from '../api/office-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { ObjectImportType } from '../../mstr-object/constants';

class StepHighlightObject {
  /**
   * Handles the highlighting of object.
   * Gets object from reducer based on objectWorkingId and
   * calls officeApiHelper.onBindingObjectClick to highlight object on Excel worksheet
   *
   * @param objectData Contaisn data about object on which operation was called
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   */
  async highlightObject(objectData: ObjectData, operationData: OperationData): Promise<void> {
    try {
      // Highlight operation is not supported for images as Excel API does not support shape selection as of now
      if (objectData?.importType === ObjectImportType.IMAGE) {
        sidePanelHelper.highlightImageObject(objectData);
      } else {
        await officeApiHelper.onBindingObjectClick(objectData);
      }

      operationStepDispatcher.completeHighlightObject(objectData.objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  }
}

const stepHighlightObject = new StepHighlightObject();
export default stepHighlightObject;
