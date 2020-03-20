import officeTableCreate from './office-table-create';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepGetOfficeTableImport {
  /**
   * Function responsible for communication with object reducer and calling officeTableCreate.createOfficeTable
   * in order to create Excel table during import workflow.
   *
   * This function is subscribed as one of the operation steps with key GET_OFFICE_TABLE_IMPORT,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing as to reference specific object
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {String} operationData.startCell Adress of the cell in Excel spreadsheet
   */
  getOfficeTableImport = async (objectData, operationData) => {
    console.time('Create or get table - import');

    try {
      const { objectWorkingId, } = objectData;
      const { excelContext, instanceDefinition, startCell, } = operationData;

      const { officeTable, bindId, newOfficeTableName, } = await officeTableCreate.createOfficeTable(
        { excelContext, instanceDefinition, startCell, }
      );

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat: true,
        tableColumnsChanged: false,
        instanceDefinition,
        startCell,
      };

      const updatedObject = {
        objectWorkingId,
        newOfficeTableName,
        bindId,
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetOfficeTableImport(objectWorkingId);
    } catch (error) {
      console.log('error:', error);
    }

    console.timeEnd('Create or get table - import');
  };
}

const stepGetOfficeTableImport = new StepGetOfficeTableImport();
export default stepGetOfficeTableImport;
