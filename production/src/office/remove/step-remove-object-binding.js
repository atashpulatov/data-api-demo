
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../api/office-api-helper';

class StepRemoveObjectBinding {
  /**
   * Remove object from the redux store, Excel settings, Excel bindings and then display message
   *
   * @param {Office} object
   * @param {Office} officeContext office context
   * @param {Object} t i18n translating function
   */
  removeObjectBinding = async (objectData, operationData) => {
    const { bindId, objectWorkingId } = objectData;

    const officeContext = await officeApiHelper.getOfficeContext();
    await officeContext.document.bindings.releaseByIdAsync(bindId);


    operationStepDispatcher.completeRemoveObjectBinding(objectWorkingId);
  }
}

const stepRemoveObjectBinding = new StepRemoveObjectBinding();
export default stepRemoveObjectBinding;
