import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import operationErrorHandler from '../../operation/operation-error-handler';


class StepCheckObjectStatus {
  checkObjectStatus = async (objectData, operationData) => {
    const { objectWorkingId } = objectData;
    try {
      const excelContext = await officeApiHelper.getExcelContext();

      const objectExist = await officeRemoveHelper.checkIfObjectExist(objectData, excelContext);

      const updatedOperation = { objectWorkingId, excelContext, objectExist };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.completeCheckObjectStatus(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepCheckObjectStatus = new StepCheckObjectStatus();
export default stepCheckObjectStatus;
