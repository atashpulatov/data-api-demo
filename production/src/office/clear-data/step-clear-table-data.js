import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import officeReducerHelper from '../store/office-reducer-helper';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepClearTableData {
  clearTableData = async (objectData, operationData) => {
    const { excelContext, objectWorkingId, objectExist } = operationData;
    try {
      if (objectExist) {
        await officeRemoveHelper.removeOfficeTableBody(excelContext, objectData, true);
      }

      operationStepDispatcher.completeClearTableData(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  }
}

const stepClearTableData = new StepClearTableData();
export default stepClearTableData;
