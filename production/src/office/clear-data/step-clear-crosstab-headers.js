import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../api/office-api-helper';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepClearCrosstabHeaders {
  /**
   * Removes the data inserted into range taken by crosstab headers
   *
   * If the Excel Table no longer exist the step will be skipped
   *
   * This function is subscribed as one of the operation steps with the key CLEAR_CROSSTAB_HEADERS,
   * therefore should be called only via operation bus.
   *
   * @param {Object} objectData Contaisn data about object on which operation was called
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {Boolean} operationData.objectExist Specify if the object existed when operation was started
   */
  clearCrosstabHeaders = async (objectData, operationData) => {
    const { objectWorkingId, excelContext, objectExist } = operationData;

    try {
      if (objectExist) {
        const { isCrosstab, bindId } = objectData;
        if (isCrosstab) {
          const officeTable = await officeApiHelper.getTable(excelContext, bindId);
          await officeApiCrosstabHelper.clearEmptyCrosstabRow(officeTable, excelContext);
          officeTable.showHeaders = true;
          officeTable.showFilterButton = false;

          const headers = officeTable.getHeaderRowRange();
          headers.format.font.color = 'white';
          await excelContext.sync();
        }
      }

      operationStepDispatcher.completeClearCrosstabHeaders(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepClearCrosstabHeaders = new StepClearCrosstabHeaders();
export default stepClearCrosstabHeaders;
