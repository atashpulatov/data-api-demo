import { officeApiHelper } from '../api/office-api-helper';
import officeApiDataLoader from '../api/office-api-data-loader';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepBindOfficeTable {
  bindOfficeTable = async (objectData, operationData) => {
    const { newBindingId, objectWorkingId } = objectData;
    const { excelContext, officeTable } = operationData;

    const tableName = await officeApiDataLoader.loadExcelDataSingle(excelContext, officeTable, 'name');

    await officeApiHelper.bindNamedItem(tableName, newBindingId);

    operationStepDispatcher.completeBindOfficeTable(objectWorkingId);
  };
}

const stepBindOfficeTable = new StepBindOfficeTable();
export default stepBindOfficeTable;
