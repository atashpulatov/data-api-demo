import officeTableRefresh from './office-table-refresh';

import { GET_OFFICE_TABLE_EDIT_REFRESH } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';
import { updateObject } from '../../operation/object-actions';
import getOfficeTableHelper from './get-office-table-helper';

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

      const newOfficeTableName = getOfficeTableHelper.createTableName(mstrTable, tableName);

      getOfficeTableHelper.checkReportTypeChange(mstrTable);

      const {
        tableColumnsChanged,
        startCell,
        officeTable,
        shouldFormat,
        newBindingId
      } = await officeTableRefresh.changeOfficeTableOnRefresh(
        {
          excelContext,
          bindingId,
          instanceDefinition,
          newOfficeTableName,
          shouldFormat,
          previousTableDimensions,
          visualizationInfo
        }
      );

      console.timeEnd('Create or get table - edit or refresh');

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
    }
  };
}

const stepGetOfficeTableEditRefresh = new StepGetOfficeTableEditRefresh();
export default stepGetOfficeTableEditRefresh;
