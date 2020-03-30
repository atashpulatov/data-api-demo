
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeStoreService } from '../store/office-store-service';

class StepRemoveObjectStore {
  /**
   * Remove object from the redux store, Excel settings, Excel bindings and then display message
   *
   * @param {Office} object
   * @param {Office} officeContext office context
   * @param {Object} t i18n translating function
   */
  removeObjectStore = async (objectData, operationData) => {
    const { bindId, objectWorkingId, } = objectData;

    officeStoreService.removeObjectFromStore(bindId, objectWorkingId);
    operationStepDispatcher.completeRemoveObjectStore(objectWorkingId);
  }
}

const stepRemoveObjectStore = new StepRemoveObjectStore();
export default stepRemoveObjectStore;
