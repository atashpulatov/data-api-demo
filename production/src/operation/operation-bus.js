/**
 * This class suits as an event bus for operations.
 *
 * Client services/classes subscribe for certain steps with method subscribe.
 * Thus callbacks that they provide are stored and called
 * when their step is next in the queue.
 *
 * @class OperationBus
 */
class OperationBus {
  init = (store) => {
    this.store = store;
    this.subscribedCallbacksMap = {};

    const { operationReducer } = this.store.getState();
    const currentOperation = operationReducer
      && operationReducer.operations
      && operationReducer.operations[0];
    this.previousOperationCopy = copyOperationInfo(currentOperation);
    this.store.subscribe(this.listener);
  }

  listener = () => {
    const { operationReducer } = this.store.getState();
    const currentOperation = operationReducer
      && operationReducer.operations
      && operationReducer.operations[0];

    if (!currentOperation) {
      this.previousOperationCopy = null;
      return;
    }

    if (didOperationNotChange(this.previousOperationCopy, currentOperation)) {
      return;
    }
    currentOperation.repeatStep = false;

    const nextStep = currentOperation.stepsQueue[0];
    this.previousOperationCopy = copyOperationInfo(currentOperation);
    const subscribedCallback = this.subscribedCallbacksMap[nextStep];
    if (subscribedCallback) {
      const currentObject = this.getCurrentObject(currentOperation.objectWorkingId);
      subscribedCallback(currentObject, currentOperation);
    }
  }

  /**
   * Subscribes for a certain step from the operation's steps queue.
   * When this step is next in the queue, provided callback is going to be called.
   *
   * @param {String} stepName Name of the operation step to be listened for.
   * @param {Function} callback Function to be called when the subscribed step is next.
   *
   * @memberof OperationBus
   */
  subscribe = (stepName, callback) => {
    this.subscribedCallbacksMap[stepName] = callback;
  }

  /**
   * Returns the object related to certain objectWorkingId.
   *
   * @param {String} objectWorkingId Local id of the object.
   *
   * @memberof OperationBus
   */
  getCurrentObject = (objectWorkingId) => {
    const { objects } = this.store.getState().objectReducer;
    return objects.find(object => object.objectWorkingId === objectWorkingId);
  }
}

const copyOperationInfo = (currentOperation) => {
  if (currentOperation) {
    const stepsQueue = JSON.stringify(currentOperation.stepsQueue);
    return {
      operationType: currentOperation.operationType,
      objectWorkingId: currentOperation.objectWorkingId,
      stepsQueue,
    };
  }
};

const didOperationNotChange = (previousOperationCopy, currentOperation) => {
  if (previousOperationCopy && !currentOperation.repeatStep) {
    const currentOperationToCompare = copyOperationInfo(currentOperation);
    return previousOperationCopy.operationType === currentOperationToCompare.operationType
      && previousOperationCopy.objectWorkingId === currentOperationToCompare.objectWorkingId
      && previousOperationCopy.stepsQueue === currentOperationToCompare.stepsQueue;
  }
  return false;
};

export const operationBus = new OperationBus();
