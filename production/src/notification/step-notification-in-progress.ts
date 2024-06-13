import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepNotificationInProgress {
  moveNotificationToInProgress(objectData: ObjectData, operationData: OperationData): void {
    const { objectWorkingId } = objectData;
    const { operationId } = operationData;

    operationStepDispatcher.moveNotificationToInProgress(objectWorkingId, operationId);
    operationStepDispatcher.completeMoveNotificationToInProgress(objectWorkingId);
  }
}

const stepNotificationInProgress = new StepNotificationInProgress();
export default stepNotificationInProgress;
