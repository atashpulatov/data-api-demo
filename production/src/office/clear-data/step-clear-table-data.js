import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import { officeStoreService } from '../store/office-store-service';

class StepClearTableData {
  clearTableData = async (objectData, operationData) => {
    const { excelContext, objectWorkingId, objectExist } = operationData;
    const operationsList = officeStoreService.getOperationsListFromOperationReducer();
    const nextOperation = operationsList[1];
    if (objectExist) {
      await officeRemoveHelper.removeOfficeTableBody(excelContext, objectData, true);
    }


    operationStepDispatcher.completeClearTableData(objectWorkingId, nextOperation);
  };
}

const stepClearTableData = new StepClearTableData();
export default stepClearTableData;
