import officeTableRefresh from './office-table-refresh';
import getOfficeTableHelper from './get-office-table-helper';
import officeTableCreate from './office-table-create';
import officeTableUpdate from './office-table-update';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepGetOfficeTableEditRefresh {
  /**
   * Creates an office table if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definition range is not empty, we keep the original table.
   * If the number of columns stays the same number of rows in table might be modified to contain all of the data.
   *
   * This function is subscribed as one of the operation steps with the key GET_OFFICE_TABLE_EDIT_REFRESH,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.oldBindId Id of the Office table created on import used for referencing the Excel table
   * @param {Number} objectData.tableName Name of Excel table created on import
   * @param {Object} objectData.previousTableDimensions Contains dimensions of Excel table created on import
   * @param {Object} [objectData.visualizationInfo] Contains information about location of visualization in dossier
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {String} operationData.instanceDefinition Object containing information about MSTR object
   */
  getOfficeTableEditRefresh = async (objectData, operationData) => {
    console.time('Create or get table - edit or refresh');

    try {
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
      const { tableColumnsChanged, prevOfficeTable, startCell, } = await officeTableRefresh.getExistingOfficeTableData(
        excelContext,
        oldBindId,
        instanceDefinition,
        previousTableDimensions,
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
    }

    console.timeEnd('Create or get table - edit or refresh');
  };
}

const stepGetOfficeTableEditRefresh = new StepGetOfficeTableEditRefresh();
export default stepGetOfficeTableEditRefresh;
