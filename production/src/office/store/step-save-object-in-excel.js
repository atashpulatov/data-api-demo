import { officeStoreService } from './office-store-service';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepSaveObjectInExcel {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  // TODO add jsdoc after integration
  saveObject = async (objectData, operationData) => {
    const { instanceDefinition } = operationData;
    objectData.previousTableDimensions = { columns: instanceDefinition.columns };
    await officeStoreService.saveObjectsInExcelStore();
    operationStepDispatcher.completeSaveObjectInExcel(objectData.objectWorkingId);

    console.timeEnd('Total');
    console.groupEnd();
  };
}

const stepSaveObjectInExcel = new StepSaveObjectInExcel();
export default stepSaveObjectInExcel;
