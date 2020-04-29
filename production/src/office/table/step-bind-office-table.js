import { officeApiHelper } from '../api/office-api-helper';
import officeApiDataLoader from '../api/office-api-data-loader';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';
import { DUPLICATE_OPERATION, IMPORT_OPERATION } from '../../operation/operation-type-names';

class StepBindOfficeTable {
  /**
   * Creates binding between Excel table and list of objects stored by Excel.
   *
   * Binding is created based on the Id of the table.
   *
   * This function is subscribed as one of the operation steps with the key BIND_OFFICE_TABLE,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Unique id of the Office table used for referencing the table in Excel
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {Boolean} operationData.tableColumnsChanged Determines if columns number in Excel table has been changed
   */
  bindOfficeTable = async (objectData, operationData) => {
    try {
      const { bindId, objectWorkingId } = objectData;
      const {
        excelContext, officeTable, operationType, tableColumnsChanged
      } = operationData;

      if (tableColumnsChanged || operationType === DUPLICATE_OPERATION || operationType === IMPORT_OPERATION) {
        const tableName = await officeApiDataLoader.loadSingleExcelData(excelContext, officeTable, 'name');

        await officeApiHelper.bindNamedItem(tableName, bindId);
      }

      operationStepDispatcher.completeBindOfficeTable(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepBindOfficeTable = new StepBindOfficeTable();
export default stepBindOfficeTable;
