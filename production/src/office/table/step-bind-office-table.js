import { officeApiHelper } from '../api/office-api-helper';
import officeApiDataLoader from '../api/office-api-data-loader';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

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
   */
  bindOfficeTable = async (objectData, operationData) => {
    const { bindId, objectWorkingId } = objectData;
    const { excelContext, officeTable } = operationData;

    const tableName = await officeApiDataLoader.loadExcelDataSingle(excelContext, officeTable, 'name');

    await officeApiHelper.bindNamedItem(tableName, bindId);

    operationStepDispatcher.completeBindOfficeTable(objectWorkingId);
  };
}

const stepBindOfficeTable = new StepBindOfficeTable();
export default stepBindOfficeTable;
