import { PopupTypeEnum } from '../home/popup-type-enum';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import { popupController } from '../popup/popup-controller';
import { reduxStore } from '../store';

class StepDisplayNotificationCompleted {
  displayNotificationCompleted = (objectData, operationData) => {
    setTimeout(() => {
      operationStepDispatcher.displaySuccessNotification(objectData.objectWorkingId);
      operationStepDispatcher.completeDisplaySuccessNotification(objectData.objectWorkingId);
      const { objects } = reduxStore.getState().objectReducer;
      const { notifications } = reduxStore.getState().notificationReducer;

      popupController.sendMessageToDialog(
        JSON.stringify({ popupType: PopupTypeEnum.importedDataOverview, objects, notifications })
      );
    }, 500);
  };
}

const stepDisplayNotificationCompleted = new StepDisplayNotificationCompleted();
export default stepDisplayNotificationCompleted;
