import officeTableCreate from './office-table-create';

import { GET_OFFICE_TABLE_IMPORT } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';
import { updateObject } from '../../operation/object-actions';
import getOfficeTableHelper from './get-office-table-helper';

class StepGetOfficeTableImport {
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
  getOfficeTableImport = async (objectData) => {
    try {
      console.time('Create or get table - import');
      const {
        excelContext,
        instanceDefinition,
        tableName,
        objectWorkingId,
        startCell,
      } = objectData;

      const { mstrTable } = instanceDefinition;

      const newOfficeTableName = getOfficeTableHelper.createTableName(mstrTable, tableName);

      getOfficeTableHelper.checkReportTypeChange(mstrTable);

      const {
        officeTable,
        newBindingId
      } = await officeTableCreate.createOfficeTable(
        {
          instanceDefinition,
          excelContext,
          startCell,
          newOfficeTableName
        }
      );
      console.timeEnd('Create or get table - import');

      const updatedObject = {
        objectWorkingId,
        officeTable,
        newOfficeTableName,
        shouldFormat: true,
        tableColumnsChanged: false,
        newBindingId,
        instanceDefinition,
        startCell,
      };

      this.reduxStore.dispatch(updateObject(updatedObject));
      this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OFFICE_TABLE_IMPORT));
    } catch (error) {
      console.log('error:', error);
    }
  };
}

const stepGetOfficeTableImport = new StepGetOfficeTableImport();
export default stepGetOfficeTableImport;
