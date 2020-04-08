import officeStoreObject from './office-store-object';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepSaveObjectInExcel {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  /**
   * Saves information about object in Exel settings
   * Add refreshDate and previousTable dimensions field to object.
   *
   * This function is subscribed as one of the operation steps with the key SAVE_OBJECT_IN_EXCEL,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Object} operationData.instanceDefinition Object containing information about MSTR object
   */
  saveObject = async (objectData, operationData) => {
    try {
      const { instanceDefinition } = operationData;
      objectData.previousTableDimensions = { columns: instanceDefinition.columns };
      objectData.refreshDate = Date.now();
      await officeStoreObject.saveObjectsInExcelStore();
      operationStepDispatcher.completeSaveObjectInExcel(objectData.objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };
}

const stepSaveObjectInExcel = new StepSaveObjectInExcel();
export default stepSaveObjectInExcel;
