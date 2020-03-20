import officeTableCreate from './office-table-create';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepGetOfficeTableImport {
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
  getOfficeTableImport = async (objectData, operationData) => {
    console.log('operationData:', operationData);
    try {
      console.time('Create or get table - import');
      const { tableName, objectWorkingId } = objectData;
      const { excelContext, instanceDefinition, startCell, } = operationData;

      const {
        officeTable,
        bindId,
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
        bindId,
      };

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat: true,
        tableColumnsChanged: false,
        instanceDefinition,
        startCell,
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetOfficeTableImport(objectWorkingId);
    } catch (error) {
      console.log('error:', error);
    }
  };
}

const stepGetOfficeTableImport = new StepGetOfficeTableImport();
export default stepGetOfficeTableImport;
