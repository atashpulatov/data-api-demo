
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
    if (!this.previousOperation || !currentOperation
      || this.previousOperation.stepsQueue[0] === currentOperation.stepsQueue[0]) {
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

export const operationBus = new OperationBus();
