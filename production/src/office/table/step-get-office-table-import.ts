import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeTableCreate from './office-table-create';
import { ObjectImportType } from '../../mstr-object/constants';

class StepGetOfficeTableImport {
  /**
   * Creates Excel table during import workflow
   *
   * Communicates with object reducer and calls officeTableCreate.createOfficeTable.
   *
   * This function is subscribed as one of the operation steps with the key GET_OFFICE_TABLE_IMPORT,
   * therefore should be called only via operation bus.
   *
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.officeTable Reference to Table created by Excel
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param operationData.startCell Address of the cell in Excel spreadsheet
   */
  async getOfficeTableImport(objectData: ObjectData, operationData: OperationData): Promise<void> {
    try {
      console.time('Create or get table - import');
      const {
        objectWorkingId,
        excelContext,
        instanceDefinition,
        startCell: selectedCell,
        insertNewWorksheet,
      } = operationData;

      const { officeTable, bindId, tableName, worksheet, startCell, groupData, objectDetailsSize } =
        await officeTableCreate.createOfficeTable({
          excelContext,
          instanceDefinition,
          startCell: selectedCell,
          insertNewWorksheet,
          pageByData: objectData.pageByData,
          objectData,
        });

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat: objectDetailsSize === 0,
        tableChanged: false,
        instanceDefinition,
        startCell,
      };

      let updatedObject: Partial<ObjectData> = {
        objectWorkingId,
        tableName,
        bindId,
        startCell,
        objectDetailsSize,
      };

      if (objectData.importType !== ObjectImportType.PIVOT_TABLE) {
        updatedObject = {
          ...updatedObject,
          worksheet,
          groupData,
        };
      }

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetOfficeTableImport(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Create or get table - import');
    }
  }
}

const stepGetOfficeTableImport = new StepGetOfficeTableImport();
export default stepGetOfficeTableImport;
