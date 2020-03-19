import officeTableCreate from './office-table-create';
import { GET_OFFICE_TABLE_IMPORT } from '../../operation/operation-steps';
import { markStepCompleted, updateOperation } from '../../operation/operation-actions';
import { updateObject } from '../../operation/object-actions';

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
  getOfficeTableImport = async (objectData, operationData) => {
    console.log('operationData:', operationData);
    try {
      console.time('Create or get table - import');
      const { tableName, objectWorkingId } = objectData;
      const { excelContext, instanceDefinition, startCell, } = operationData;

      const {
        officeTable,
        newBindingId,
        newOfficeTableName,
      } = await officeTableCreate.createOfficeTable(
        {
          instanceDefinition,
          excelContext,
          startCell,
          tableName
        }
      );
      console.timeEnd('Create or get table - import');

      const updatedObject = {
        objectWorkingId,
        newOfficeTableName,
        newBindingId,
      };

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat: true,
        tableColumnsChanged: false,
        instanceDefinition,
        startCell,
      };


      this.reduxStore.dispatch(updateOperation(updatedOperation));
      this.reduxStore.dispatch(updateObject(updatedObject));
      this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OFFICE_TABLE_IMPORT));
    } catch (error) {
      console.log('error:', error);
    }
  };
}

const stepGetOfficeTableImport = new StepGetOfficeTableImport();
export default stepGetOfficeTableImport;
