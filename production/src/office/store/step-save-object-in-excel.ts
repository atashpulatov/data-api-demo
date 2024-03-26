import { ReduxStore } from '../../store';
import officeStoreObject from './office-store-object';

import {
  InstanceDefinition,
  OperationData,
} from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import {
  clearRepromptTask,
  executeNextRepromptTask,
} from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import { ObjectImportType } from '../../mstr-object/constants';

class StepSaveObjectInExcel {
  reduxStore: ReduxStore;

  init(reduxStore: ReduxStore): void {
    this.reduxStore = reduxStore;
  }

  /**
   * Adds refreshDate field to object.
   * Adds previousTableDimensions field to object.
   * Adds excelTableSize field to object's details.
   * Removes preparedInstanceId field from object.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param instanceDefinition Object containing information about MSTR object
   */
  prepareObjectData(objectData: ObjectData, instanceDefinition: InstanceDefinition): void {
    if (objectData.importType === ObjectImportType.TABLE) {
      const { rows, columns, mstrTable } = instanceDefinition;
      const { crosstabHeaderDimensions } = mstrTable;

      objectData.previousTableDimensions = { rows, columns };
      objectData.details.excelTableSize = { rows: rows + 1, columns };

      if (crosstabHeaderDimensions) {
        const { columnsY, rowsX } = crosstabHeaderDimensions;
        const {
          details: { excelTableSize },
        } = objectData;

        // -1 because table header and first row of column headers occupy the same row
        excelTableSize.rows += columnsY - 1;
        excelTableSize.columns += rowsX;
      }
    }
    objectData.refreshDate = Date.now();
    delete objectData.preparedInstanceId;
  }

  /**
   * Saves information about object in Excel settings and modifies object.
   *
   * Prepares object data to save.
   *
   * This function is subscribed as one of the operation steps with the key SAVE_OBJECT_IN_EXCEL,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.instanceDefinition Object containing information about MSTR object
   */
  saveObject = async (objectData: ObjectData, operationData: OperationData): Promise<void> => {
    console.group('Save object in Excel');
    console.time('Total');
    try {
      const { instanceDefinition } = operationData;

      this.prepareObjectData(objectData, instanceDefinition);

      await officeStoreObject.saveObjectsInExcelStore();
      await officeStoreObject.saveAnswersInExcelStore();
      operationStepDispatcher.completeSaveObjectInExcel(objectData.objectWorkingId);

      // Proceed with triggering next reprompt task if any in queue.
      // Nothing will happen if there is no task in queue.
      // @ts-expect-error
      this.reduxStore.dispatch(executeNextRepromptTask());
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);

      // Clear reprompt task queue if any error occurs.
      // @ts-expect-error
      this.reduxStore.dispatch(clearRepromptTask());
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };
}

const stepSaveObjectInExcel = new StepSaveObjectInExcel();
export default stepSaveObjectInExcel;
