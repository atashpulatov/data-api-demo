import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepClearTableData {
  /**
   * Removes the data inserted into Excel Table while keeping formatting applied to Excel cells
   *
   * If the Excel Table no longer exist the step will be skipped
   *
   * This function is subscribed as one of the operation steps with the key CLEAR_TABLE_DATA,
   * therefore should be called only via operation bus.
   *
   * @param {Object} objectData Contaisn data about object on which operation was called
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {Boolean} operationData.objectExist Specify if the object existed when operation was started
   */
  clearTableData = async (objectData, operationData) => {
    const { objectWorkingId, excelContext, objectExist } = operationData;
    try {
      if (objectExist) {
        await officeRemoveHelper.removeOfficeTableBody(excelContext, objectData, true);
      }

      operationStepDispatcher.completeClearTableData(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepClearTableData = new StepClearTableData();
export default stepClearTableData;
