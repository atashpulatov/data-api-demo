import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeStoreService } from '../store/office-store-service';

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
    const { bindId, objectWorkingId, } = objectData;

    officeStoreService.removeObjectFromStore(bindId, objectWorkingId);

    operationStepDispatcher.completeRemoveObjectStore(objectWorkingId);
  };
}

const stepRemoveObjectStore = new StepRemoveObjectStore();
export default stepRemoveObjectStore;
