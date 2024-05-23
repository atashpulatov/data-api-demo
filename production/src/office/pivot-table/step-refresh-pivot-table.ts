import { pivotTableHelper } from './pivot-table-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepRefreshPivotTable {
  /**
   * Refresh Excel pivot table
   *
   * This function is subscribed as one of the operation steps with the key GET_OFFICE_TABLE_IMPORT,
   * therefore should be called only via operation bus.
   *
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param objectData.pivotTableId Unique Id of the pivot table object
   */
  refreshPivotTable = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    console.group('Refreshing pivot table');

    try {
      const { pivotTableId, objectWorkingId, isCrosstab } = objectData;
      const { excelContext, instanceDefinition: { mstrTable } = {} } = operationData;

      const pivotTable = await pivotTableHelper.getPivotTable(excelContext, pivotTableId);

      if (!pivotTable.isNullObject) {
        pivotTable.refresh();
        await excelContext.sync();
        if (!isCrosstab) {
          await pivotTableHelper.populatePivotTable(pivotTable, mstrTable, excelContext);
        }
      }

      operationStepDispatcher.completeRefreshPivotTable(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.groupEnd();
    }
  };
}

const stepRefreshPivotTable = new StepRefreshPivotTable();
export default stepRefreshPivotTable;
