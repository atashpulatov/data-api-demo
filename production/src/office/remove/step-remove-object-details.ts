import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from './office-remove-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepRemoveObjectDetails {
  /**
   * Removes imported object details from Excel sheet.
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_OBJECT_DETAILS,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.bindId Id of the Office table created on import used for referencing the Excel table
   * @param objectData.isCrosstab Specify if object is a crosstab
   * @param objectData.crosstabHeaderDimensions Contains information about crosstab headers dimensions
   * @param objectData.objectSettings Contains information about object settings
   * @param objectData.startCell Starting cell of the object/table
   * @param operationData Contains information about the operation
   */
  async removeObjectDetails(objectData: ObjectData, operationData: OperationData): Promise<void> {
    const {
      objectWorkingId,
      bindId,
      isCrosstab = false,
      crosstabHeaderDimensions = {},
      objectSettings,
      startCell,
    } = objectData;

    let excelContext;
    let objectExist;

    try {
      excelContext = await officeApiHelper.getExcelContext();
      objectExist = await officeRemoveHelper.checkIfObjectExist(objectData, excelContext);

      const objectDetailsSize = objectSettings?.objectDetailsSize ?? 0;

      if (objectExist && objectDetailsSize > 0) {
        const officeTable = excelContext.workbook.tables.getItem(bindId);

        const { validColumnsY, validRowsX } =
          await officeApiCrosstabHelper.getCrosstabHeadersSafely(
            crosstabHeaderDimensions,
            officeTable,
            excelContext
          );

        // get starting header cell of the table
        const rowCellPosition = isCrosstab ? -validRowsX - 1 : 0;
        const columnCellPosition = isCrosstab ? -validColumnsY + 1 : 0;

        const headerCell = officeTable.getRange().getCell(rowCellPosition, columnCellPosition);
        excelContext.trackedObjects.add(headerCell);

        headerCell.load('address');
        await excelContext.sync();

        const currentCell = officeApiHelper.getStartCellOfRange(headerCell.address);

        // delete the object details only if the table is not moved
        if (currentCell === startCell) {
          headerCell.getRowsAbove(objectDetailsSize + 2).clear('Contents');
        }

        await excelContext.sync();
      }

      operationStepDispatcher.completeRemoveObjectDetails(objectWorkingId);
    } catch (error) {
      if (objectExist) {
        operationErrorHandler.handleOperationError(objectData, operationData, error);
      } else {
        console.error(error);
        operationStepDispatcher.completeRemoveObjectDetails(objectWorkingId);
      }
    }
  }
}

const stepRemoveObjectDetails = new StepRemoveObjectDetails();
export default stepRemoveObjectDetails;
