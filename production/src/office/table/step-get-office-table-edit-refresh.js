import officeTableRefresh from './office-table-refresh';
import getOfficeTableHelper from './get-office-table-helper';
import officeTableCreate from './office-table-create';
import officeTableUpdate from './office-table-update';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepGetOfficeTableEditRefresh {
  /**
   * Creates an office table if the number of columns of an existing table changes.
   *
   * On refreshing a table, when the new definition range is not empty, original table is kept.
   *
   * If the number of columns stays the same, number of rows in table might be modified to contain all of the data.
   *
   * This function is subscribed as one of the operation steps with the key GET_OFFICE_TABLE_EDIT_REFRESH,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.tableName Name of Excel table created on import
   * @param {Object} objectData.previousTableDimensions Contains dimensions of Excel table created on import
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {String} operationData.instanceDefinition Object containing information about MSTR object
   * @param {Number} operationData.oldBindId Id of the Office table created on import
   * @param {Object} [operationData.objectEditedData] Contains information modifications to object data
   * @param {Boolean} [operationData.insertNewWorksheet] Specify if new worksheet has to be created
   */
  getOfficeTableEditRefresh = async (objectData, operationData) => {
    try {
      console.time('Create or get table - edit or refresh');
      const { tableName, previousTableDimensions, objectWorkingId } = objectData;
      const {
        excelContext,
        instanceDefinition,
        oldBindId,
        objectEditedData,
        insertNewWorksheet,
      } = operationData;
      let { tableChanged, startCell } = operationData;

      const { mstrTable } = instanceDefinition;
      const isRepeatStep = !!startCell; // If we have startCell on refresh it means that we are repeating step

      let shouldFormat = true;
      let bindId = oldBindId;
      let officeTable;

      getOfficeTableHelper.checkReportTypeChange(mstrTable);
      const prevOfficeTable = await officeTableRefresh.getPreviousOfficeTable(excelContext, oldBindId);

      if (!isRepeatStep) {
        ({ tableChanged, startCell } = await officeTableRefresh.getExistingOfficeTableData(
          excelContext,
          instanceDefinition,
          prevOfficeTable,
          previousTableDimensions,
        ));
      }

      if (tableChanged) {
        console.log('Instance definition changed, creating new table');

        ({ officeTable, bindId } = await officeTableCreate.createOfficeTable(
          {
            instanceDefinition,
            excelContext,
            startCell,
            tableName,
            prevOfficeTable,
            tableChanged,
            isRepeatStep,
            insertNewWorksheet
          }
        ));
      } else {
        shouldFormat = (objectEditedData
          && objectEditedData.visualizationInfo
          && objectEditedData.visualizationInfo.nameAndFormatShouldUpdate) || false;

        officeTable = await officeTableUpdate.updateOfficeTable(
          instanceDefinition,
          excelContext,
          startCell,
          prevOfficeTable,
        );
      }

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat,
        tableChanged,
        instanceDefinition,
        startCell,
        isTotalsRowVisible: prevOfficeTable.showTotals,
      };

      startCell = officeTableRefresh.getCrosstabStartCell(startCell, instanceDefinition, tableChanged);

      officeTable.worksheet.load(['id', 'name']);
      await excelContext.sync();

      const { id, name } = officeTable.worksheet;

      const updatedObject = {
        objectWorkingId,
        bindId,
        startCell,
        worksheet: { id, name }
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetOfficeTableEditRefresh(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Create or get table - edit or refresh');
    }
  };
}

const stepGetOfficeTableEditRefresh = new StepGetOfficeTableEditRefresh();
export default stepGetOfficeTableEditRefresh;
