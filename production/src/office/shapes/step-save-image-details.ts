import { officeApiHelper } from '../api/office-api-helper';
import { officeShapeApiHelper } from './office-shape-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { ErrorMessages } from '../../error/constants';

class StepSaveImageDetails {
  /**
   * Saves the position (top, left) and dimension (height, width) of the shape object
   * representing the visualization image on the worksheet.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.bindId Unique id of the Office shape used for referencing the viz image in Excel
   * @param operationData Reference to the operation data required for error handling
   */
  async saveImageDetails(objectData: ObjectData, operationData: OperationData): Promise<void> {
    console.time('Save Image Details');
    try {
      const { objectWorkingId, bindId } = objectData;
      const excelContext = await officeApiHelper.getExcelContext();

      const shapeInWorksheet =
        bindId && (await officeShapeApiHelper.getShape(excelContext, bindId));

      if (!shapeInWorksheet) {
        throw new Error(ErrorMessages.VISUALIZATION_REMOVED_FROM_EXCEL);
      }

      if (shapeInWorksheet) {
        // @ts-expect-error
        const { top, left, width, height, worksheetId } = shapeInWorksheet;
        operationStepDispatcher.updateObject({
          objectWorkingId,
          shapeProps: {
            top,
            left,
            width,
            height,
            worksheetId,
          },
        });
      }

      operationStepDispatcher.completeSaveImageDetails(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Save Image Details');
    }
  }
}

const stepSaveImageDetails = new StepSaveImageDetails();
export default stepSaveImageDetails;
