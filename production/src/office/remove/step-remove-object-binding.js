
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../api/office-api-helper';

class StepRemoveObjectBinding {
  /**
   * Removes an imported object from Office Bindings list.
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_OBJECT_BINDING,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Id of the Office table created on import used for referencing the Excel table
   */
  removeObjectBinding = async (objectData, operationData) => {
    const { bindId, objectWorkingId } = objectData;
    console.log('bindId:', bindId);

    const officeContext = await officeApiHelper.getOfficeContext();
    await officeContext.document.bindings.releaseByIdAsync(bindId);


    operationStepDispatcher.completeRemoveObjectBinding(objectWorkingId);
  }
}

const stepRemoveObjectBinding = new StepRemoveObjectBinding();
export default stepRemoveObjectBinding;
