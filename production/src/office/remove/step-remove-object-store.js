import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeStoreService } from '../store/office-store-service';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepRemoveObjectStore {
  /**
   * Removes an imported object from Object reducer in Redux Store and Excel settings.
   *
   * Communicates with object reducer and calls officeStoreService.removeObjectFromStore.
   *
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_OBJECT_STORE,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Id of the Office table created on import used for referencing the Excel table
   */
  removeObjectStore = async (objectData, operationData) => {
    const { objectWorkingId } = objectData;

    try {
      officeStoreService.removeObjectFromStore(objectWorkingId);
      operationStepDispatcher.completeRemoveObjectStore(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData);
    }
  };
}

const stepRemoveObjectStore = new StepRemoveObjectStore();
export default stepRemoveObjectStore;
