import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepNotificationInProgress {
  moveNotificationToInProgress(objectData: ObjectData, _operationData: OperationData): void {
    operationStepDispatcher.moveNotificationToInProgress(objectData.objectWorkingId);
    operationStepDispatcher.completeMoveNotificationToInProgress(objectData.objectWorkingId);
  }
}

const stepNotificationInProgress = new StepNotificationInProgress();
export default stepNotificationInProgress;
