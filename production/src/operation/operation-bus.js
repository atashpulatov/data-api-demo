
class OperationBus {
  init = (store) => {
    this.store = store;
    this.subscribedCallbacksMap = {};
    // eslint-disable-next-line prefer-destructuring
    this.previousOperation = this.store.getState().operationReducer
      && this.store.getState().operationReducer.operations[0];
    this.store.subscribe(this.listener);
  }

  listener = () => {
    const currentOperation = this.store.getState().operationReducer
      && this.store.getState().operationReducer.operations[0];
    if (!didOperationChange(this.previousOperation, currentOperation)) {
      return;
    }
    const nextStep = currentOperation.stepsQueue[0];
    const subscribedCallback = this.subscribedCallbacksMap[nextStep];
    subscribedCallback && subscribedCallback();
    this.previousOperation = currentOperation;
  }

  subscribe = (stepName, callback) => {
    this.subscribedCallbacksMap[stepName] = callback;
  }
}

const didOperationChange = (previousOperation, currentOperation) => {
  if (!currentOperation) {
    return false;
  }
  if (previousOperation
    && previousOperation.stepsQueue[0] === currentOperation.stepsQueue[0]) {
    return false;
  }
  return true;
};

export const operationBus = new OperationBus();
