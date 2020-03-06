class FakeStore {
  constructor() {
    this.resetState();
  }

  getState = () => this.state

  subscribe = (listener) => {
    this.listener = listener;
  }

  resetState = () => {
    this.state = { operationReducer: { operations: [], } };
    this.listener && this.listener();
  }

  simulateStepChange = (stepName) => {
    const subscribedOperation = { stepsQueue: [stepName], };
    this.state.operationReducer.operations = [subscribedOperation];
    this.listener();
  }
}

export const fakeStore = new FakeStore();
