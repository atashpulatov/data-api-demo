
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from './office-remove-helper';
import { officeApiHelper } from '../api/office-api-helper';

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

    const excelContext = await officeApiHelper.getExcelContext();
    const officeTable = excelContext.workbook.tables.getItem(bindId);
    officeRemoveHelper.removeExcelTable(officeTable, excelContext, isCrosstab, crosstabHeaderDimensions);
    await excelContext.sync();

    operationStepDispatcher.completeRemoveObjectTable(objectWorkingId);
  }
}

const stepRemoveObjectTable = new StepRemoveObjectTable();
export default stepRemoveObjectTable;
