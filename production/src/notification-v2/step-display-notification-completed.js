import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepDisplayNotificationCompleted {
  displayNotificationCompleted = (objectData, operationData) => {
    operationStepDispatcher.displaySuccessNotification(objectData.objectWorkingId);
    operationStepDispatcher.completeDisplaySuccessNotification(objectData.objectWorkingId);
  }
}

const stepDisplayNotificationCompleted = new StepDisplayNotificationCompleted();
export default stepDisplayNotificationCompleted;
