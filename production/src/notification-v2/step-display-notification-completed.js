import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepDisplayNotificationCompleted {
  displayNotificationCompleted = (objectData, operationData) => {
    setTimeout(() => {
      operationStepDispatcher.displaySuccessNotification(objectData.objectWorkingId);
      operationStepDispatcher.completeDisplaySuccessNotification(objectData.objectWorkingId);
    }, 500);
  }
}

const stepDisplayNotificationCompleted = new StepDisplayNotificationCompleted();
export default stepDisplayNotificationCompleted;
