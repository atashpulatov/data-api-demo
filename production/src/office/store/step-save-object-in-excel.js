import officeStoreObject from './office-store-object';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepSaveObjectInExcel {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  // TODO add jsdoc after integration
  saveObject = async (objectData, operationData) => {
    try {
      const { instanceDefinition } = operationData;
      objectData.previousTableDimensions = { columns: instanceDefinition.columns };
      objectData.refreshDate = Date.now();
      await officeStoreObject.saveObjectsInExcelStore();
      operationStepDispatcher.completeSaveObjectInExcel(objectData.objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };
}

const stepSaveObjectInExcel = new StepSaveObjectInExcel();
export default stepSaveObjectInExcel;
