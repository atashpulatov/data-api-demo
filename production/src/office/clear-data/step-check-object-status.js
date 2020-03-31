import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from '../remove/office-remove-helper';


class StepCheckObjectStatus {
  checkObjectStatus = async (objectData, operationData) => {
    const { objectWorkingId } = objectData;
    console.log('objectWorkingId:', objectWorkingId);
    const excelContext = await officeApiHelper.getExcelContext();

    await officeRemoveHelper.checkIfObjectExist(objectData, excelContext);

    const updatedOperation = { objectWorkingId, excelContext };

    operationStepDispatcher.updateOperation(updatedOperation);
    console.log('updatedOperation:', updatedOperation);
    operationStepDispatcher.completeCheckObjectStatus(objectWorkingId);
  };
}

const stepCheckObjectStatus = new StepCheckObjectStatus();
export default stepCheckObjectStatus;
