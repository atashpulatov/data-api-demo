import { officeApiHelper } from '../api/office-api-helper';
import officeApiDataLoader from '../api/office-api-data-loader';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepBindOfficeTable {
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
