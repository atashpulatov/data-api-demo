
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from './office-remove-helper';
import { officeApiHelper } from '../api/office-api-helper';

class StepRemoveObjectTable {
  /**
   * Remove object from the redux store, Excel settings, Excel bindings and then display message
   *
   * @param {Office} object
   * @param {Office} officeContext office context
   * @param {Object} t i18n translating function
   */
  removeObjectTable = async (objectData, operationData) => {
    const {
      bindId,
      isCrosstab = false,
      crosstabHeaderDimensions = {},
      objectWorkingId,
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
