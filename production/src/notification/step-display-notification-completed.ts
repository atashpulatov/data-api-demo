import { ObjectData } from '../redux-reducer/object-reducer/object-reducer-types';
import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';

import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepDisplayNotificationCompleted {
  displayNotificationCompleted(objectData: ObjectData, _operationData: OperationData): void {
    setTimeout(() => {
      operationStepDispatcher.displaySuccessNotification(objectData.objectWorkingId);
      operationStepDispatcher.completeDisplaySuccessNotification(objectData.objectWorkingId);
    }, 500);
  }
}

const stepDisplayNotificationCompleted = new StepDisplayNotificationCompleted();
export default stepDisplayNotificationCompleted;
