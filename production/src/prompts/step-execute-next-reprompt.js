import operationErrorHandler from "../operation/operation-error-handler";
import operationStepDispatcher from "../operation/operation-step-dispatcher";
import { executeNextRepromptTask } from "../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions";

class StepExecuteNextReprompt {
  init = reduxStore => {
    this.reduxStore = reduxStore;
  };

  /**
   * Triggers execution of next reprompt in queue if any.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Object} operationData.instanceDefinition Object containing information about MSTR object
   */
  executeNextReprompt = async (objectData, operationData) => {
    console.group('Execute next reprompt step');
    console.time('Total');

    try {
      // Proceed with triggering next reprompt task if any in queue.
      // Nothing will happen if there is no task in queue.
      this.reduxStore.dispatch(executeNextRepromptTask());
      operationStepDispatcher.completeExecuteNextReprompt(objectData.objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };
}

const stepExecuteNextReprompt = new StepExecuteNextReprompt();
export default stepExecuteNextReprompt;