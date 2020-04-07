import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepNotificationInProgress {
  moveNotificationToInProgress = (objectData, operationData) => {
    operationStepDispatcher.moveNotificationToInProgress(objectData.objectWorkingId);
    operationStepDispatcher.completeMoveNotificationToInProgress(objectData.objectWorkingId);
  }
}

const stepNoficicationInProgress = new StepNotificationInProgress();
export default stepNoficicationInProgress;
