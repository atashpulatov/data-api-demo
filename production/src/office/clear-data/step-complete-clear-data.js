import officeReducerHelper from '../store/office-reducer-helper';
import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepCompleteClearData {
  completeClearData = async (objectData, operationData) => {
    const { objectWorkingId } = operationData;
    try {
      const operationsList = officeReducerHelper.getOperationsListFromOperationReducer();
      const objectList = officeReducerHelper.getObjectsListFromObjectReducer();
      const nextOperation = operationsList[1];

      operationStepDispatcher.completeClearData(objectWorkingId, nextOperation, objectList);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData);
    }
  }
}

const stepCompleteClearData = new StepCompleteClearData();
export default stepCompleteClearData;
