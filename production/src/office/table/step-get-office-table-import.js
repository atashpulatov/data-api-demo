import officeTableCreate from './office-table-create';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepGetOfficeTableImport {
  /**
   * Creates Excel table during import workflow
   *
   * Communicates with object reducer and calls officeTableCreate.createOfficeTable.
   *
   * This function is subscribed as one of the operation steps with the key GET_OFFICE_TABLE_IMPORT,
   * therefore should be called only via operation bus.
   *
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {String} operationData.startCell Address of the cell in Excel spreadsheet
   */
  getOfficeTableImport = async (objectData, operationData) => {
    try {
      console.time('Create or get table - import');
      const {
        objectWorkingId, excelContext, instanceDefinition, startCell, insertNewWorksheet
      } = operationData;

      const {
        officeTable, bindId, tableName, worksheet
      } = await officeTableCreate.createOfficeTable(
        {
          excelContext, instanceDefinition, startCell, insertNewWorksheet
        }
      );

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat: true,
        tableChanged: false,
        instanceDefinition,
        startCell,
      };

      const updatedObject = {
        objectWorkingId,
        tableName,
        bindId,
        worksheet,
        startCell
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetOfficeTableImport(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Create or get table - import');
    }
  };
}

const stepGetOfficeTableImport = new StepGetOfficeTableImport();
export default stepGetOfficeTableImport;
