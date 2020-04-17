import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import operationErrorHandler from '../../operation/operation-error-handler';


class StepCheckObjectStatus {
  /**
   * Check if the Excel table of imported object exists in worksheet.
   * If the Excel Table no longer exist the object will be removed from reducer.
   *
   * This function is subscribed as one of the operation steps with the key CHECK_OBJECT_STATUS,
   * therefore should be called only via operation bus.
   *
   * @param {Object} objectData Contaisn data about object on which operation was called
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   */
  checkObjectStatus = async (objectData, operationData) => {
    const { objectWorkingId } = operationData;
    try {
      const excelContext = await officeApiHelper.getExcelContext();

      const objectExist = await officeRemoveHelper.checkIfObjectExist(objectData, excelContext);

      const updatedOperation = { objectWorkingId, excelContext, objectExist };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.completeCheckObjectStatus(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepCheckObjectStatus = new StepCheckObjectStatus();
export default stepCheckObjectStatus;
