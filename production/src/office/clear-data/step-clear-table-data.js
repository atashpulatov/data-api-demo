import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeRemoveHelper } from '../remove/office-remove-helper';

class StepClearTableData {
  clearTableData = async (objectData, operationData) => {
    const { objectWorkingId } = objectData;
    const { excelContext } = operationData;

    await officeRemoveHelper.removeOfficeTableBody(excelContext, objectData, true);

    operationStepDispatcher.completeClearTableData(objectWorkingId);
  };
}

const stepClearTableData = new StepClearTableData();
export default stepClearTableData;
