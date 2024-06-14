import officeReducerHelper from '../office/store/office-reducer-helper';
import { notificationService } from './notification-service';

import { reduxStore } from '../store';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationStepDispatcher from '../operation/operation-step-dispatcher';
import { OperationTypes } from '../operation/operation-type-names';
import { displaySuccessNotification } from '../redux-reducer/notification-reducer/notification-action-creators';
import { executeNextRepromptTask } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';

class StepDisplayNotificationCompleted {
  displayNotificationCompleted(objectData: ObjectData, operationData: OperationData): void {
    const { objectWorkingId } = objectData;
    const { operationType } = operationData;

    // TODO: check if needed
    const dismissNotification = (): void => {
      if (operationType === OperationTypes.REMOVE_OPERATION) {
        notificationService.dismissSuccessfulRemoveNotification(objectWorkingId);
      } else {
        notificationService.dismissNotification(objectWorkingId);
      }
    };

    setTimeout(() => {
      reduxStore.dispatch(displaySuccessNotification(objectWorkingId, dismissNotification));
      operationStepDispatcher.completeDisplaySuccessNotification(objectWorkingId);

      // TODO: This should not be a part of this step
      // Proceed with triggering next reprompt task if any in queue.
      // Nothing will happen if there is no task in queue.
      if (officeReducerHelper.noOperationInProgress()) {
        reduxStore.dispatch(executeNextRepromptTask());
      }
    }, 500);
  }
}

const stepDisplayNotificationCompleted = new StepDisplayNotificationCompleted();
export default stepDisplayNotificationCompleted;
