import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from '../remove/office-remove-helper';


class StepCheckObjectStatus {
  checkObjectStatus = async (objectData, operationData) => {
    const { objectWorkingId } = objectData;

    const excelContext = await officeApiHelper.getExcelContext();

    const objectExist = await officeRemoveHelper.checkIfObjectExist(objectData, excelContext);

    const updatedOperation = { objectWorkingId, excelContext, objectExist };

    operationStepDispatcher.updateOperation(updatedOperation);
    operationStepDispatcher.completeCheckObjectStatus(objectWorkingId);
  };
}

const stepCheckObjectStatus = new StepCheckObjectStatus();
export default stepCheckObjectStatus;
