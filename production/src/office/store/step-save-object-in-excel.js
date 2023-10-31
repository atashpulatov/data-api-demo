import officeStoreObject from './office-store-object';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';
import { executeNextRepromptTask, clearRepromptTask } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';

class StepSaveObjectInExcel {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Saves information about object in Excel settings and modifies object.
   *
   * Prepares object data to save.
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

      prepareObjectData(objectData, instanceDefinition);

      await officeStoreObject.saveObjectsInExcelStore();
      await officeStoreObject.saveAnswersInExcelStore();
      operationStepDispatcher.completeSaveObjectInExcel(objectData.objectWorkingId);

      // Proceed with triggering next reprompt task if any in queue.
      // Nothing will happen if there is no task in queue.
      this.reduxStore.dispatch(executeNextRepromptTask());
    } catch (error) {
      // Clear reprompt task queue if any error occurs.
      this.reduxStore.dispatch(clearRepromptTask());

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

/**
 * Adds refreshDate field to object.
 * Adds previousTableDimensions field to object.
 * Adds excelTableSize field to object's details.
 * Removes preparedInstanceId field from object.
 *
 * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
 * @param {Object} instanceDefinition Object containing information about MSTR object
 */
function prepareObjectData(objectData, instanceDefinition) {
  objectData.previousTableDimensions = { rows: instanceDefinition.rows, columns: instanceDefinition.columns };
  objectData.details.excelTableSize = {
    rows: objectData.previousTableDimensions.rows + 1,
    columns: objectData.previousTableDimensions.columns,
  };
  if (instanceDefinition.mstrTable.crosstabHeaderDimensions) {
    const { details: { excelTableSize } } = objectData;
    const { mstrTable: { crosstabHeaderDimensions: { columnsY, rowsX } } } = instanceDefinition;
    excelTableSize.rows += columnsY;
    excelTableSize.columns += rowsX;
  }
  objectData.refreshDate = Date.now();
  delete objectData.preparedInstanceId;
}
