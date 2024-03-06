import operationStepDispatcher from "../operation/operation-step-dispatcher";

class StepNotificationInProgress {
  moveNotificationToInProgress = (objectData, _operationData) => {
    operationStepDispatcher.moveNotificationToInProgress(
      objectData.objectWorkingId,
    );
    operationStepDispatcher.completeMoveNotificationToInProgress(
      objectData.objectWorkingId,
    );
  };
}

const stepNotificationInProgress = new StepNotificationInProgress();
export default stepNotificationInProgress;
