
class OperationBus {
  init = (store) => {
    this.store = store;
    this.subscribedCallbacksMap = {};

    const currentOperation = this.store.getState().operationReducer
    && this.store.getState().operationReducer.operations
      && this.store.getState().operationReducer.operations[0];
    this.previousOperationCopy = this.copyOperationInfo(currentOperation);
    this.store.subscribe(this.listener);
  }

  listener = () => {
    const currentOperation = this.store.getState().operationReducer
    && this.store.getState().operationReducer.operations
    && this.store.getState().operationReducer.operations[0];

    if (!currentOperation) {
      this.previousOperationCopy = null;
      return;
    }

    if (this.didOperationNotChange(this.previousOperationCopy, currentOperation)) {
      return;
    }

    const nextStep = currentOperation.stepsQueue[0];
    this.previousOperationCopy = this.copyOperationInfo(currentOperation);
    const subscribedCallback = this.subscribedCallbacksMap[nextStep];
    if (subscribedCallback) {
      const currentObject = this.getCurrentObject(currentOperation.objectWorkingId);
      subscribedCallback(currentObject, currentOperation.response);
    }
  }

  subscribe = (stepName, callback) => {
    this.subscribedCallbacksMap[stepName] = callback;
  }

  getCurrentObject = (objectWorkingId) => {
    const { objects } = this.store.getState().objectReducer;
    return objects.find(object => object.objectWorkingId === objectWorkingId);
  }

  copyOperationInfo =(currentOperation) => {
    if (currentOperation) {
      const stepsQueue = JSON.stringify(currentOperation.stepsQueue);
      return {
        operationType: currentOperation.operationType,
        objectWorkingId: currentOperation.objectWorkingId,
        stepsQueue,
      };
    }
    return undefined;
  }

  didOperationNotChange = (previousOperationCopy, currentOperation) => {
    if (previousOperationCopy) {
      const currentOperationToCompare = this.copyOperationInfo(currentOperation);
      return previousOperationCopy.operationType === currentOperationToCompare.operationType
       && previousOperationCopy.objectWorkingId === currentOperationToCompare.objectWorkingId
       && previousOperationCopy.stepsQueue === currentOperationToCompare.stepsQueue;
    }
    return false;
  }
}


export const operationBus = new OperationBus();
