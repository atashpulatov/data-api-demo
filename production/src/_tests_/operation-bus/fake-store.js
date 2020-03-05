class FakeStore {
  constructor() {
    this.state = { operationReducer: { operations: [], } };
  }

  getState = () => this.state

  subscribe = (listener) => {
    this.listener = listener;
  }

  simulateStepChange = (stepName) => {
    const subscribedOperation = { stepsQueue: [stepName], };
    this.state.operationReducer.operations = [subscribedOperation];
    this.listener();
  }
}

export const fakeStore = new FakeStore();
