import { officeShapeApiHelper } from './office-shape-api-helper';
import { officeApiHelper } from '../api/office-api-helper';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';
import officeStoreObject from '../store/office-store-object';
import { CLEAR_DATA_OPERATION } from '../../operation/operation-type-names';

class StepRemoveVisualizationImage {
  /**
   * Deletes the visualization image from the worksheet
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_VISUALIZATION_IMAGE,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Unique id of the Office shape used for referencing the viz image in Excel
   * @param {Object} operationData Reference to the operation data required for error handling
   */
  removeVisualizationImage = async (objectData, operationData) => {
    console.time('Remove Visualization Image');
    try {
      const { objectWorkingId, bindId } = objectData;
      const { operationType } = operationData;
      const excelContext = await officeApiHelper.getExcelContext();

      await officeShapeApiHelper.deleteImage(excelContext, bindId);

      operationStepDispatcher.completeRemoveVisualizationImage(objectWorkingId);

      // If the operation is not CLEAR_DATA_OPERATION, remove the object from the store
      // We preserve the objects in the store for CLEAR_OPERATION to be restored to the workbook
      // in the event of a VIEW_DATA operation
      if (operationType !== CLEAR_DATA_OPERATION) {
        operationStepDispatcher.updateObject({ objectWorkingId, doNotPersist: true });
        officeStoreObject.removeObjectInExcelStore(objectWorkingId);
      }
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Remove Visualization Image');
    }
  };
}

const stepRemoveVisualizationImage = new StepRemoveVisualizationImage();
export default stepRemoveVisualizationImage;
