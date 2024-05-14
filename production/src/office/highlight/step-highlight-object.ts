import { officeApiHelper } from '../api/office-api-helper';
import { pivotTableHelper } from '../pivot-table/pivot-table-helper';
import { officeShapeApiHelper } from '../shapes/office-shape-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { ObjectImportType } from '../../mstr-object/constants';

class StepHighlightObject {
  /**
   * Handles the highlighting of object.
   * Gets object from reducer based on objectWorkingId and
   * calls officeApiHelper.onBindingObjectClick to highlight object on Excel worksheet
   *
   * @param objectData Contains data about object on which operation was called
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   */
  async highlightObject(objectData: ObjectData, operationData: OperationData): Promise<void> {
    try {
      // Highlight operation is not supported for images and pivot tables as Excel API does not support shape and pivot table object selection and as of now
      const { importType, pivotTableId, bindId } = objectData;

      if (
        importType === ObjectImportType.TABLE ||
        importType === ObjectImportType.FORMATTED_TABLE
      ) {
        await officeApiHelper.onBindingObjectClick(objectData);
      } else {
        const excelContext = await officeApiHelper.getExcelContext();

        let worksheet;

        if (importType === ObjectImportType.PIVOT_TABLE) {
          const pivotTable = await pivotTableHelper.getPivotTable(excelContext, pivotTableId);

          // Omit the highlight operation, if the pivot table was removed manually from the worksheet.
          if (pivotTable.isNullObject) {
            operationStepDispatcher.completeHighlightObject(objectData.objectWorkingId);
            return;
          }

          worksheet = pivotTable.worksheet;
        }

        if (importType === ObjectImportType.IMAGE) {
          const shapeInWorksheet: any =
            bindId && (await officeShapeApiHelper.getShape(excelContext, bindId));

          // Omit the highlight operation, if shape(visualization image) was removed manually from the worksheet.
          if (!shapeInWorksheet) {
            operationStepDispatcher.completeHighlightObject(objectData.objectWorkingId);
            return;
          }

          worksheet = excelContext.workbook.worksheets.getItem(shapeInWorksheet?.worksheetId);
        }

        worksheet.activate();
        await excelContext.sync();
      }

      operationStepDispatcher.completeHighlightObject(objectData.objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  }
}

const stepHighlightObject = new StepHighlightObject();
export default stepHighlightObject;
