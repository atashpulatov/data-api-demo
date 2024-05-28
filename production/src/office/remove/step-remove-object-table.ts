import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from './office-remove-helper';

import {
  MstrTable,
  OperationData,
} from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { ObjectImportType } from '../../mstr-object/constants';

class StepRemoveObjectTable {
  /**
   * Removes an imported object from Object reducer in Redux Store and Excel settings.
   *
   * Communicates with object reducer and calls officeRemoveHelper.removeExcelTable.
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_OBJECT_TABLE,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.bindId Id of the Office table created on import used for referencing the Excel table
   * @param objectData.isCrosstab Specify if object is a crosstab
   * @param objectData.crosstabHeaderDimensions Contains information about crosstab headers dimensions
   */
  async removeObjectTable(objectData: ObjectData, operationData: OperationData): Promise<void> {
    const {
      objectWorkingId,
      bindId,
      isCrosstab = false,
      crosstabHeaderDimensions = {},
      importType,
    } = objectData;

    let excelContext;
    let objectExist;

    try {
      excelContext = await officeApiHelper.getExcelContext();
      objectExist = await officeRemoveHelper.checkIfObjectExist(objectData, excelContext);

      if (!objectExist) {
        operationStepDispatcher.completeRemoveObjectTable(objectWorkingId);
      } else {
        const officeTable = excelContext.workbook.tables.getItem(bindId);

        if (importType === ObjectImportType.PIVOT_TABLE) {
          const { worksheet } = officeTable;
          worksheet.visibility = Excel.SheetVisibility.hidden;
          worksheet.delete();
          await excelContext.sync();
        } else {
          // Move crosstab logic to separete step
          const { validColumnsY, validRowsX } =
            await officeApiCrosstabHelper.getCrosstabHeadersSafely(
              crosstabHeaderDimensions,
              officeTable,
              excelContext
            );

          const validCrosstabHeaderDimnesions = {
            ...crosstabHeaderDimensions,
            columnsY: validColumnsY,
            rowsX: validRowsX,
          };

          await officeApiCrosstabHelper.clearCrosstabRange(
            officeTable,
            {
              crosstabHeaderDimensions: {},
              isCrosstab,
              prevCrosstabDimensions: validCrosstabHeaderDimnesions,
            } as MstrTable,
            excelContext,
            false
          );

          await officeRemoveHelper.removeExcelTable(officeTable, excelContext, objectData, false);
        }

        operationStepDispatcher.completeRemoveObjectTable(objectWorkingId);
      }
    } catch (error) {
      if (objectExist) {
        operationErrorHandler.handleOperationError(objectData, operationData, error);
      } else {
        console.error(error);
        operationStepDispatcher.completeRemoveObjectTable(objectWorkingId);
      }
    }
  }
}

const stepRemoveObjectTable = new StepRemoveObjectTable();
export default stepRemoveObjectTable;
