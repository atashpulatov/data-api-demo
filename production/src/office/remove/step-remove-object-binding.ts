import { officeApiHelper } from '../api/office-api-helper';

import officeStoreObject from '../store/office-store-object';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepRemoveObjectBinding {
  /**
   * Removes an imported object from Office Bindings list.
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_OBJECT_BINDING,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.bindId Id of the Office table created on import used for referencing the Excel table
   */
  async removeObjectBinding(objectData: ObjectData, _operationData: OperationData): Promise<void> {
    const { bindId, objectWorkingId } = objectData;

    const officeContext = await officeApiHelper.getOfficeContext();

    try {
      await officeContext.document.bindings.releaseByIdAsync(bindId);
    } catch (error) {
      console.error(error);
    }
    operationStepDispatcher.completeRemoveObjectBinding(objectWorkingId);
    operationStepDispatcher.updateObject({
      objectWorkingId,
      doNotPersist: true,
    });
    officeStoreObject.removeObjectInExcelStore(objectWorkingId);
  }
}

const stepRemoveObjectBinding = new StepRemoveObjectBinding();
export default stepRemoveObjectBinding;