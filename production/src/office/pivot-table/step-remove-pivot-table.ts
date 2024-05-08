import { officeApiHelper } from '../api/office-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepRemovePivotTable {
  /**
   * Remove Excel pivot table and it's binding
   *
   * This function is subscribed as one of the operation steps with the key GET_OFFICE_TABLE_IMPORT,
   * therefore should be called only via operation bus.
   *
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.pivotTableId Id of the pivot table
   */
  removePivotTable = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    console.group('Removing pivot table');

    try {
      const { objectWorkingId } = operationData;
      const { pivotTableId } = objectData;
      const excelContext = await officeApiHelper.getExcelContext();

      const pivotTable = await officeApiHelper.getPivotTable(excelContext, pivotTableId);

      if (!pivotTable.isNullObject) {
        pivotTable.delete();
        await excelContext.sync();

        const officeContext = await officeApiHelper.getOfficeContext();
        officeContext.document.bindings.releaseByIdAsync(pivotTableId);
      }

      operationStepDispatcher.completeRemovePivotTable(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.groupEnd();
    }
  };
}

const stepRemovePivotTable = new StepRemovePivotTable();
export default stepRemovePivotTable;
