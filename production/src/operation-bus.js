
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
      || this.previousOperation.actionsQueue[0] === currentOperation.actionsQueue[0]) {
      return;
    }
    const nextAction = currentOperation.actionsQueue[0];
    const subscribedCallback = this.subscribedCallbacksMap[nextAction];
    subscribedCallback && subscribedCallback();
    this.previousOperation = currentOperation;
  }

  subscribe = (actionName, callback) => {
    this.subscribedCallbacksMap[actionName] = callback;
  }
}

export const operationBus = new OperationBus();
