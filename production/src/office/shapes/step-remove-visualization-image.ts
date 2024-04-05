import { officeApiHelper } from '../api/office-api-helper';
import { officeShapeApiHelper } from './office-shape-api-helper';

import officeStoreObject from '../store/office-store-object';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { OperationTypes } from '../../operation/operation-type-names';

class StepRemoveVisualizationImage {
  /**
   * Deletes the visualization image from the worksheet
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_VISUALIZATION_IMAGE,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.bindId Unique id of the Office shape used for referencing the viz image in Excel
   * @param operationData Reference to the operation data required for error handling
   */
  async removeVisualizationImage(
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> {
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
      if (operationType !== OperationTypes.CLEAR_DATA_OPERATION) {
        operationStepDispatcher.updateObject({
          objectWorkingId,
          doNotPersist: true,
        });
        officeStoreObject.removeObjectInExcelStore(objectWorkingId);
      }
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Remove Visualization Image');
    }
  }
}

const stepRemoveVisualizationImage = new StepRemoveVisualizationImage();
export default stepRemoveVisualizationImage;