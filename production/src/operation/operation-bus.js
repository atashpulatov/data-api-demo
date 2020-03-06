
class OperationBus {
  init = (store) => {
    this.store = store;
    this.subscribedCallbacksMap = {};
    // eslint-disable-next-line prefer-destructuring
    const currentOperation = this.store.getState().operationReducer
      && this.store.getState().operationReducer.operations[0];
    this.previousOperation = currentOperation && JSON.parse(JSON.stringify(currentOperation));
    this.store.subscribe(this.listener);
  }

  listener = () => {
    const currentOperation = this.store.getState().operationReducer
      && this.store.getState().operationReducer.operations[0];
    if (!currentOperation) {
      this.previousOperation = null;
      return;
    }
    if (!didOperationChange(this.previousOperation, currentOperation)) {
      return;
    }
    const nextStep = currentOperation.stepsQueue[0];
    const subscribedCallback = this.subscribedCallbacksMap[nextStep];
    subscribedCallback && subscribedCallback();
    this.previousOperation = JSON.parse(JSON.stringify(currentOperation));
  }

  subscribe = (stepName, callback) => {
    this.subscribedCallbacksMap[stepName] = callback;
  }
}

const didOperationChange = (previousOperation, currentOperation) => {
  if (previousOperation
    && previousOperation.stepsQueue[0] === currentOperation.stepsQueue[0]) {
    return false;
  }
  return true;
};

export const operationBus = new OperationBus();
