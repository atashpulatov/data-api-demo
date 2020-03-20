import officeTableCreate from './office-table-create';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepGetOfficeTableImport {
  /**
   * Creates an office table for a new import.
   *
   * @param objectData
   * @param operationData
   * @returns {Promise<void>}
   *
   */
  getOfficeTableImport = async (objectData, operationData) => {
    console.time('Create or get table - import');

    try {
      const { tableName, objectWorkingId, } = objectData;
      const { excelContext, instanceDefinition, startCell, } = operationData;

      const {
        officeTable,
        bindId,
        newOfficeTableName,
      } = await officeTableCreate.createOfficeTable(
        {
          excelContext,
          instanceDefinition,
          tableName,
          startCell,
        }
      );

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat: true,
        tableColumnsChanged: false,
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
      operationStepDispatcher.completeGetOfficeTableImport(objectWorkingId);
    } catch (error) {
      console.log('error:', error);
    }

    console.timeEnd('Create or get table - import');
  };
}

const stepGetOfficeTableImport = new StepGetOfficeTableImport();
export default stepGetOfficeTableImport;
