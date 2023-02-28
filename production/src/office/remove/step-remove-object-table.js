import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from './office-remove-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepRemoveObjectTable {
  /**
   * Removes an imported object from Object reducer in Redux Store and Excel settings.
   *
   * Communicates with object reducer and calls officeRemoveHelper.removeExcelTable.
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_OBJECT_STORE,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Id of the Office table created on import used for referencing the Excel table
   * @param {Boolean} objectData.isCrosstab Specify if object is a crosstab
   * @param {Object} objectData.crosstabHeaderDimensions Contains information about crosstab headers dimensions
   */
  removeObjectTable = async (objectData, operationData) => {
    const {
      objectWorkingId,
      bindId,
      isCrosstab = false,
      crosstabHeaderDimensions = {},
    } = objectData;

    let excelContext;
    let objectExist;
    let clearEmptyCrosstabRowError;

    try {
      excelContext = await officeApiHelper.getExcelContext();
      objectExist = await officeRemoveHelper.checkIfObjectExist(objectData, excelContext);

      if (!objectExist) {
        operationStepDispatcher.completeRemoveObjectTable(objectWorkingId);
      } else {
        const officeTable = excelContext.workbook.tables.getItem(bindId);

        const { validColumnsY, validRowsX } = await officeApiCrosstabHelper.getCrosstabHeadersSafely(
          crosstabHeaderDimensions,
          officeTable,
          excelContext
        );

        const validCrosstabHeaderDimnesions = {
          ...crosstabHeaderDimensions,
          columnsY: validColumnsY - 1,
          rowsX: validRowsX
        };

        await officeRemoveHelper.removeExcelTable(officeTable, excelContext, isCrosstab, validCrosstabHeaderDimnesions);

        operationStepDispatcher.completeRemoveObjectTable(objectWorkingId);
      }
    } catch (error) {
      const errorToHandle = clearEmptyCrosstabRowError || error;
      if (objectExist) {
        operationErrorHandler.handleOperationError(objectData, operationData, errorToHandle);
      } else {
        console.error(errorToHandle);
        operationStepDispatcher.completeRemoveObjectTable(objectWorkingId);
      }
    }
  };
}

const stepRemoveObjectTable = new StepRemoveObjectTable();
export default stepRemoveObjectTable;
