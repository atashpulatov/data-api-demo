import officeReducerHelper from '../office/store/office-reducer-helper';

import { reduxStore } from '../store';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationStepDispatcher from '../operation/operation-step-dispatcher';
import { executeNextRepromptTask } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';

class StepDisplayNotificationCompleted {
  displayNotificationCompleted(objectData: ObjectData, _operationData: OperationData): void {
    setTimeout(() => {
      operationStepDispatcher.displaySuccessNotification(objectData.objectWorkingId);
      operationStepDispatcher.completeDisplaySuccessNotification(objectData.objectWorkingId);

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
