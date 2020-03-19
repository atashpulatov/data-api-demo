import officeTableRefresh from './office-table-refresh';
import getOfficeTableHelper from './get-office-table-helper';
import officeTableCreate from './office-table-create';
import officeTableUpdate from './office-table-update';
import { GET_OFFICE_TABLE_EDIT_REFRESH } from '../../operation/operation-steps';
import { markStepCompleted, updateOperation } from '../../operation/operation-actions';
import { updateObject } from '../../operation/object-actions';

class StepGetOfficeTableEditRefresh {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {boolean} isRefresh
   * @param {Object} excelContext
   * @param {string} bindingId
   * @param {Object} instanceDefinition
   * @param {string} startCell  Top left corner cell
   *
   */
  getOfficeTableEditRefresh = async (objectData, operationData) => {
    try {
      console.time('Create or get table - edit or refresh');
      const {
        bindingId,
        tableName,
        previousTableDimensions,
        visualizationInfo,
        objectWorkingId,
      } = objectData;
      const { excelContext, instanceDefinition, } = operationData;
      const { mstrTable } = instanceDefinition;

      const newOfficeTableName = tableName;
      let shouldFormat;
      let newBindingId = bindingId;
      let officeTable;

      getOfficeTableHelper.checkReportTypeChange(mstrTable);
      const { tableColumnsChanged, prevOfficeTable, startCell } = await officeTableRefresh.getExistingOfficeTableData(
        excelContext,
        bindingId,
        instanceDefinition,
        previousTableDimensions
      );

      if (tableColumnsChanged) {
        console.log('Instance definition changed, creating new table');

        ({ officeTable, newBindingId } = await officeTableCreate.createOfficeTable(
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
        newBindingId,
      };

      this.reduxStore.dispatch(updateOperation(updatedOperation));
      this.reduxStore.dispatch(updateObject(updatedObject));
      this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OFFICE_TABLE_EDIT_REFRESH));
    } catch (error) {
      console.log('error:', error);
    } finally {
      console.timeEnd('Create or get table - edit or refresh');
    }
  };
}

const stepGetOfficeTableEditRefresh = new StepGetOfficeTableEditRefresh();
export default stepGetOfficeTableEditRefresh;
