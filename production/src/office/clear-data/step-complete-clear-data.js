import officeReducerHelper from '../store/office-reducer-helper';
import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepCompleteClearData {
  /**
   * Completes clear data action by changing flag in redux
   * if the current operation is the last one of the clear Data operations
   *
   * This function is subscribed as one of the operation steps with the key COMPLETE_CLEAR_DATA,
   * therefore should be called only via operation bus.
   *
   * @param {Object} objectData Contaisn data about object on which operation was called
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   */
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
