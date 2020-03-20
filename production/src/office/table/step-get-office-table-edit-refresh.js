import officeTableRefresh from './office-table-refresh';
import getOfficeTableHelper from './get-office-table-helper';
import officeTableCreate from './office-table-create';
import officeTableUpdate from './office-table-update';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepGetOfficeTableEditRefresh {
  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {boolean} isRefresh
   * @param {Object} excelContext
   * @param {string} bindId
   * @param {Object} instanceDefinition
   * @param {string} startCell  Top left corner cell
   *
   */
  getOfficeTableEditRefresh = async (objectData, operationData) => {
    try {
      console.time('Create or get table - edit or refresh');
      const {
        oldBindId,
        tableName,
        previousTableDimensions,
        visualizationInfo,
        objectWorkingId,
      } = objectData;
      const { excelContext, instanceDefinition, } = operationData;
      const { mstrTable } = instanceDefinition;

      const newOfficeTableName = tableName;
      let shouldFormat;
      let bindId = oldBindId;
      let officeTable;

      getOfficeTableHelper.checkReportTypeChange(mstrTable);
      const { tableColumnsChanged, prevOfficeTable, startCell } = await officeTableRefresh.getExistingOfficeTableData(
        excelContext,
        oldBindId,
        instanceDefinition,
        previousTableDimensions
      );

      if (tableColumnsChanged) {
        console.log('Instance definition changed, creating new table');

        ({ officeTable, bindId } = await officeTableCreate.createOfficeTable(
          {
            instanceDefinition,
            excelContext,
            startCell,
            tableName,
            prevOfficeTable,
            tableColumnsChanged,
          }
        ));
      } else {
        shouldFormat = visualizationInfo.formatShouldUpdate || false;

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
        tableColumnsChanged,
        instanceDefinition,
        startCell,
      };
      const updatedObject = {
        objectWorkingId,
        newOfficeTableName,
        bindId,
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetOfficeTableEditRefresh(objectWorkingId);
    } catch (error) {
      console.log('error:', error);
    } finally {
      console.timeEnd('Create or get table - edit or refresh');
    }
  };
}

const stepGetOfficeTableEditRefresh = new StepGetOfficeTableEditRefresh();
export default stepGetOfficeTableEditRefresh;
