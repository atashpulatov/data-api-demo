
class OperationBus {
  init = (store) => {
    this.store = store;
    this.subscribedCallbacksMap = {};
    // eslint-disable-next-line prefer-destructuring
    const currentOperation = this.store.getState().operationReducer
      && this.store.getState().operationReducer.operations[0];
    this.previousOperationCopy = currentOperation && JSON.stringify(currentOperation);
    this.store.subscribe(this.listener);
  }

  listener = () => {
    const currentOperation = this.store.getState().operationReducer
      && this.store.getState().operationReducer.operations[0];
    if (!currentOperation) {
      this.previousOperationCopy = null;
      return;
    }
    if (!didOperationChange(this.previousOperationCopy, currentOperation)) {
      return;
    }
    const nextStep = currentOperation.stepsQueue[0];
    const subscribedCallback = this.subscribedCallbacksMap[nextStep];
    subscribedCallback && subscribedCallback();
    this.previousOperationCopy = JSON.stringify(currentOperation);
  }

  subscribe = (stepName, callback) => {
    this.subscribedCallbacksMap[stepName] = callback;
  }
}

const didOperationChange = (previousOperationCopy, currentOperation) => !previousOperationCopy
    || previousOperationCopy !== JSON.stringify(currentOperation);

export const operationBus = new OperationBus();
