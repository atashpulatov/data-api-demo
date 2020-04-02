import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import { officeStoreService } from '../store/office-store-service';

class StepClearTableData {
  clearTableData = async (objectData, operationData) => {
    const { objectWorkingId } = objectData;
    const { excelContext } = operationData;
    const operationsList = officeStoreService.getOperationsListFromOperationReducer();
    const nextOperation = operationsList[1];


    await officeRemoveHelper.removeOfficeTableBody(excelContext, objectData, true);


    operationStepDispatcher.completeClearTableData(objectWorkingId, nextOperation);
  };
}

const stepClearTableData = new StepClearTableData();
export default stepClearTableData;
