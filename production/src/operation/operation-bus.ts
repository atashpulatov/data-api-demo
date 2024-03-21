/* eslint-disable @typescript-eslint/no-use-before-define */
import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';

import { OperationSteps } from './operation-steps';

/**
 * This class suits as an event bus for operations.
 *
 * Client services/classes subscribe for certain steps with method subscribe.
 * Thus callbacks that they provide are stored and called
 * when their step is next in the queue.
 *
 */
class OperationBus {
  store: any;

  subscribedCallbacksMap: any;

  previousOperationCopy: any;

  init(store: any): void {
    this.listener = this.listener.bind(this);
    this.store = store;
    this.subscribedCallbacksMap = {};

    const { operationReducer } = this.store.getState();
    const currentOperation: OperationData =
      operationReducer && operationReducer.operations && operationReducer.operations[0];
    this.previousOperationCopy = this.copyOperationInfo(currentOperation);
    this.store.subscribe(this.listener);
  }

  listener(): void {
    const { operationReducer } = this.store.getState();
    const currentOperation =
      operationReducer && operationReducer.operations && operationReducer.operations[0];

    if (!currentOperation) {
      this.previousOperationCopy = null;
      return;
    }

    if (this.didOperationNotChange(this.previousOperationCopy, currentOperation)) {
      return;
    }
    currentOperation.repeatStep = false;

    const nextStep = currentOperation.stepsQueue[0];
    this.previousOperationCopy = this.copyOperationInfo(currentOperation);

    const subscribedCallback = this.subscribedCallbacksMap[nextStep];
    if (subscribedCallback) {
      const currentObject = this.getCurrentObject(currentOperation.objectWorkingId);
      subscribedCallback(currentObject, currentOperation);
    }
  }

  /**
   * Subscribes for a certain step from the operation's steps queue.
   * When this step is next in the queue, provided callback is going to be called.
   *
   * @param stepName Name of the operation step to be listened for.
   * @param callback Function to be called when the subscribed step is next.
   *
   */
  subscribe(stepName: OperationSteps, callback: Function): void {
    this.subscribedCallbacksMap[stepName] = callback;
  }

  /**
   * Returns the object related to certain objectWorkingId.
   *
   * @param objectWorkingId Local id of the object.
   *
   */
  getCurrentObject(objectWorkingId: number): any {
    const { objects } = this.store.getState().objectReducer;
    return objects.find((object: any) => object.objectWorkingId === objectWorkingId);
  }

  private copyOperationInfo(currentOperation: any): any {
    if (currentOperation) {
      const stepsQueue = JSON.stringify(currentOperation.stepsQueue);
      return {
        operationType: currentOperation.operationType,
        objectWorkingId: currentOperation.objectWorkingId,
        stepsQueue,
      };
    }
  }

  private didOperationNotChange(previousOperationCopy: any, currentOperation: any): any {
    if (previousOperationCopy && !currentOperation.repeatStep) {
      const currentOperationToCompare = this.copyOperationInfo(currentOperation);
      return (
        previousOperationCopy.operationType === currentOperationToCompare.operationType &&
        previousOperationCopy.objectWorkingId === currentOperationToCompare.objectWorkingId &&
        previousOperationCopy.stepsQueue === currentOperationToCompare.stepsQueue
      );
    }
    return false;
  }
}

export const operationBus = new OperationBus();
