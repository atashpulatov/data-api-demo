import { officeApiHelper } from '../api/office-api-helper';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepAddVisualizationPlaceholder {
  /**
   * Adds the visualization placeholder in the worksheet, when the data is cleared from the sidepanel.
   *
   * This function is subscribed as one of the operation steps with the key ADD_VISUALIZATION_PLACEHOLDER,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Object} objectData.shapeProps Properties of the viz image imported into worksheet
   * @param {String} objectData.name Name of the visualization image
   * @param {Object} operationData Reference to the operation data required for error handling
   */
  addVisualizationPlaceholder = async (objectData, operationData) => {
    try {
      const {
        objectWorkingId,
        shapeProps,
        name: visualizationName,
      } = objectData;
      const excelContext = await officeApiHelper.getExcelContext();

      const shape = await officeApiHelper.addGeometricShape(excelContext, shapeProps, visualizationName);

      const updatedObject = {
        objectWorkingId,
        bindId: shape.id,
      };
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeAddVisualizationPlaceholder(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Add Visualization Placeholder');
    }
  };
}

const stepAddVisualizationPlaceholder = new StepAddVisualizationPlaceholder();
export default stepAddVisualizationPlaceholder;
