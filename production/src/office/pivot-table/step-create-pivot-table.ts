import { officeApiWorksheetHelper } from '../api/office-api-worksheet-helper';

import {
  MstrTable,
  OperationData,
} from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeApiDataLoader from '../api/office-api-data-loader';

class StepCreatePivotTable {
  /**
   * Creates Excel pivot table during import workflow
   *
   * This function is subscribed as one of the operation steps with the key CREATE_PIVOT_TABLE,
   * therefore should be called only via operation bus.
   *
   * @param objectData.name Name of the added object
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param operationData.officeTable Reference to Table created by Excel
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   */
  createPivotTable = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    console.group('Creating pivot table');

    try {
      const { excelContext, officeTable, objectWorkingId, instanceDefinition } = operationData;
      const { name: objectName } = objectData;

      const worksheet = await officeApiWorksheetHelper.createNewWorksheet({
        excelContext,
        worksheetName: objectName,
      });
      worksheet.activate();
      await excelContext.sync();

      // Imitate Excel behaviour when creating pivot table manually on new sheet - generate table from A3
      const pivotTableStartCell = worksheet.getRange('A3');
      const pivotTable = worksheet.pivotTables.add(objectName, officeTable, pivotTableStartCell);

      const { mstrTable } = instanceDefinition;
      this.populatePivotTableWithAttributes(pivotTable, mstrTable);
      this.populatePivotTableWithMetrics(pivotTable, mstrTable);
      
      const {
        name,
        id,
        position: index,
      } = await officeApiDataLoader.loadExcelData(excelContext, [
        { object: worksheet, key: 'name' },
        { object: worksheet, key: 'id' },
        { object: worksheet, key: 'position' },
      ]);

      operationStepDispatcher.updateObject({
        ...objectData,
        pivotTableId: pivotTable.id,
        worksheet: { id, name, index },
        groupData: { key: index, title: name },
      });

      operationStepDispatcher.completeCreatePivotTable(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.groupEnd();
    }
  };

  populatePivotTableWithAttributes = async (
    pivotTable: Excel.PivotTable,
    mstrTable: MstrTable,
  ): Promise<void> => {
    for (const { name } of mstrTable.attributes) {
      pivotTable.rowHierarchies.add(pivotTable.hierarchies.getItem(name));
    }
  };

  populatePivotTableWithMetrics = async (
    pivotTable: Excel.PivotTable,
    mstrTable: MstrTable,
  ): Promise<void> => {
    for (const { name } of mstrTable.metrics) {
      pivotTable.dataHierarchies.add(pivotTable.hierarchies.getItem(name));
    }
  };
}

const stepCreatePivotTable = new StepCreatePivotTable();
export default stepCreatePivotTable;
