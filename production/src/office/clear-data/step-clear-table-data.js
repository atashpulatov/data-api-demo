import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import { officeStoreService } from '../store/office-store-service';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepClearTableData {
  clearTableData = async (objectData, operationData) => {
    const { excelContext, objectWorkingId, objectExist } = operationData;
    try {
      const operationsList = officeStoreService.getOperationsListFromOperationReducer();
      const objectList = officeStoreService.getObjectsListFromObjectReducer();
      const nextOperation = operationsList[1];
      if (objectExist) {
        await officeRemoveHelper.removeOfficeTableBody(excelContext, objectData, true);
      }

      operationStepDispatcher.completeClearTableData(objectWorkingId, nextOperation, objectList);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData);
    }
  }
}

const stepClearTableData = new StepClearTableData();
export default stepClearTableData;
