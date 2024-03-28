import { OperationSteps } from '../src/operation/operation-steps';

class FakeStore {
  private state: any;

  private listener: any;

  constructor() {
    this.resetState();
  }

  getState = (): any => this.state;

  subscribe = (listener: any): void => {
    this.listener = listener;
  };

  resetState = (): void => {
    this.state = {
      operationReducer: { operations: [{ stepsQueue: [] }] },
      objectReducer: { objects: [] },
    };
    this.listener && this.listener();
  };

  addStep = (stepName: OperationSteps): void => {
    const operation = this.state.operationReducer.operations[0];
    operation.stepsQueue = [...operation.stepsQueue, stepName];

    this.listener();
  };

  removeFirstStep = (): void => {
    const operation = this.state.operationReducer.operations[0];
    operation.stepsQueue.shift();
    this.listener();
  };
}

export const fakeStore = new FakeStore();
