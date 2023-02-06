import operationStepDispatcher from '../operation/operation-step-dispatcher';
import operationErrorHandler from '../operation/operation-error-handler';
import { officeApiWorksheetHelper } from './api/office-api-worksheet-helper';

class StepRenameExcelWorksheet {
  /**
   * Renames Excel worksheet if it was empty before adding object
   *
   * This function is subscribed as one of the operation steps with the key RENAME_EXCEL_WORKSHEET,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.name Name of the added object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {Boolean} operationData.shouldRenameExcelWorksheet Flag indicating whether worksheet name should be changed
   */
  renameExcelWorksheet = async (objectData, operationData) => {
    try {
      const { objectWorkingId, name } = objectData;
      const { excelContext, shouldRenameExcelWorksheet } = operationData;

      if (shouldRenameExcelWorksheet) {
        await officeApiWorksheetHelper.renameExistingWorksheet(excelContext, name);
      }

      operationStepDispatcher.completeRenameExcelWorksheet(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepRenameExcelWorksheet = new StepRenameExcelWorksheet();
export default stepRenameExcelWorksheet;
