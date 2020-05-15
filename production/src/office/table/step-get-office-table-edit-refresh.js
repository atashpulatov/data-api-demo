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
   */
  getOfficeTableEditRefresh = async (objectData, operationData) => {
    try {
      console.time('Create or get table - edit or refresh');
      const {
        tableName,
        previousTableDimensions,
        objectWorkingId,
      } = objectData;
      const {
        excelContext, instanceDefinition, oldBindId, objectEditedData
      } = operationData;
      const { mstrTable } = instanceDefinition;

      let shouldFormat;
      let bindId = oldBindId;
      let officeTable;

      getOfficeTableHelper.checkReportTypeChange(mstrTable);
      const { tableChanged, prevOfficeTable, startCell, } = await officeTableRefresh.getExistingOfficeTableData(
        excelContext,
        oldBindId,
        instanceDefinition,
        previousTableDimensions,
      );

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
      };

      const updatedObject = {
        objectWorkingId,
        bindId,
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
