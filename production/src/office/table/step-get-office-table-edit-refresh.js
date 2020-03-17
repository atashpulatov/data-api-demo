import officeTableRefresh from './office-table-refresh';
import getOfficeTableHelper from './get-office-table-helper';
import officeTableCreate from './office-table-create';
import officeTableUpdate from './office-table-update';
import { GET_OFFICE_TABLE_EDIT_REFRESH } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';
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
  getOfficeTableEditRefresh = async (objectData) => {
    try {
      console.time('Create or get table - edit or refresh');
      const {
        excelContext,
        bindingId,
        instanceDefinition,
        tableName,
        previousTableDimensions,
        visualizationInfo,
        objectWorkingId,
      } = objectData;

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


      const updatedObject = {
        objectWorkingId,
        officeTable,
        newOfficeTableName,
        shouldFormat,
        tableColumnsChanged,
        newBindingId,
        instanceDefinition,
        startCell,
      };

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
