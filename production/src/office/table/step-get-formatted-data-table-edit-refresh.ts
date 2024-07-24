import { officeApiHelper } from '../api/office-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeTableCreate from './office-table-create';
import officeTableRefresh from './office-table-refresh';

class StepGetFormattedDataTableEditRefresh {
  /**
   * Creates an office table and removes the previous existing office table on every refresh or edit.
   * Similar to StepGetOfficeTableEditRefresh.getOfficeTableEditRefresh() step, except that redundant operations 
   * with the relation to formatted data table were eliminated.
   *
   * This function is subscribed as one of the operation steps with the key GET_FORMATTED_DATA_TABLE_EDIT_REFRESH,
   * therefore should be called only via operation bus.
   *
   * @param objectData.tableName Name of Excel table created on import
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param operationData.instanceDefinition Object containing information about MSTR object
   * @param operationData.oldBindId Id of the Office table created on import
   * @param operationData.insertNewWorksheet Specify if new worksheet has to be created
   * @param operationData.startCell Address of the cell in Excel spreadsheet
   */
  async getFormattedDataTableEditRefresh(
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> {
    try {
      console.time('Create formatted data table - edit or refresh');
      const {
        tableName,
        objectWorkingId,
        pageByData,
        importType,
      } = objectData;
      const { excelContext, instanceDefinition, oldBindId, insertNewWorksheet, formattedData: { dimensions: rangeDimensions } } =
        operationData;
      const isRepeatStep = !!operationData.startCell; // If we have startCell on refresh it means that we are repeating step

      const prevOfficeTable = await officeTableRefresh.getPreviousOfficeTable(
        excelContext,
        oldBindId
      );

      const { officeTable, bindId, startCell, dimensions } = await officeTableCreate.createFormattedDataOfficeTable({
        instanceDefinition,
        excelContext,
        startCell: isRepeatStep ? operationData.startCell : objectData.startCell,
        rangeDimensions,
        tableName,
        prevOfficeTable,
        isRepeatStep,
        insertNewWorksheet,
        pageByData,
        objectData,
        operationData,
      });

      instanceDefinition.rows = dimensions.rows;
      instanceDefinition.columns = dimensions.columns;

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat: true,
        tableChanged: true,
        instanceDefinition,
        startCell,
        isTotalsRowVisible: prevOfficeTable.showTotals,
      };

      officeTable.worksheet.load(['id', 'name', 'position']);
      await excelContext.sync();

      const { id, name, position } = officeTable.worksheet;

      const updatedObject: Partial<ObjectData> = {
        objectWorkingId,
        bindId,
        startCell,
        importType,
        worksheet: { id, name, index: position },
        groupData: {
          key: id,
          title: name,
          index: position,
        },
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetDefaultOfficeTableTemplateEditRefresh(objectWorkingId);
    } catch (error) {
      try {
        const { excelContext, formattedData } = operationData;
        const sourceWorksheet = officeApiHelper.getExcelSheetById(excelContext, formattedData?.sourceWorksheetId);

        // Remove exported worksheet from current workbook on error
        if (sourceWorksheet) {
          sourceWorksheet.delete();
          await operationData.excelContext.sync();
        }
      } catch (ignoredError) {
        // Ignore the 'ignoredError' error and handle the original 'error' below
        console.error(ignoredError)
      }

      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Create formatted data table - edit or refresh');
    }
  }
}

const stepGetFormattedDataTableEditRefresh = new StepGetFormattedDataTableEditRefresh();
export default stepGetFormattedDataTableEditRefresh;
