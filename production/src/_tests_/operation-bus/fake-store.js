class FakeStore {
  constructor() {
    this.state = { operationReducer: { operations: [], } };
  }

  getState = () => this.state

  subscribe = (listener) => {
    this.listener = listener;
  }

  simulateActionChange = (actionName) => {
    const subscribedOperation = { actionsQueue: [actionName], };
    this.state.operationReducer.operations = [subscribedOperation];
    this.listener();
  }
}

export const fakeStore = new FakeStore();
