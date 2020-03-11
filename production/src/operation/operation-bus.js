
class OperationBus {
  init = (store) => {
    this.store = store;
    this.subscribedCallbacksMap = {};

    const currentOperation = this.store.getState().operationReducer
    && this.store.getState().operationReducer.operations
      && this.store.getState().operationReducer.operations[0];
    this.previousOperationCopy = currentOperation && JSON.stringify(currentOperation);
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
    if (!didOperationChange(this.previousOperationCopy, currentOperation)) {
      return;
    }

    const nextStep = currentOperation.stepsQueue[0];
    this.previousOperationCopy = JSON.stringify(currentOperation);
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
  };
}


const didOperationChange = (previousOperationCopy, currentOperation) => !previousOperationCopy
      || previousOperationCopy !== JSON.stringify(currentOperation);

export const operationBus = new OperationBus();
