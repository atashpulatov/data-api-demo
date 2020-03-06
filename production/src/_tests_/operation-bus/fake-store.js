class FakeStore {
  constructor() {
    this.resetState();
  }

  getState = () => this.state

  subscribe = (listener) => {
    this.listener = listener;
  }

  resetState = () => {
    this.state = { operationReducer: { operations: [{ stepsQueue: [], }], } };
    this.listener && this.listener();
  }

  addStep = (stepName) => {
    const operation = this.state.operationReducer.operations[0];
    operation.stepsQueue = [...operation.stepsQueue, stepName];
    console.log(JSON.stringify(this.state));

    this.listener();
  }

  removeFirstStep = () => {
    const operation = this.state.operationReducer.operations[0];
    operation.stepsQueue.shift();
    this.listener();
  }
}

export const fakeStore = new FakeStore();
