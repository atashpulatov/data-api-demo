import { officeShapeApiHelper } from './office-shape-api-helper';
import { officeApiHelper } from '../api/office-api-helper';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepSaveImageDetails {
  /**
   * Saves the position (top, left) and dimension (height, width) of the shape object
   * representing the visualization image on the worksheet.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Unique id of the Office shape used for referencing the viz image in Excel
   * @param {Object} operationData Reference to the operation data required for error handling
   */
  saveImageDetails = async (objectData, operationData) => {
    console.time('Save Image Details');
    try {
      const { objectWorkingId, bindId } = objectData;
      const excelContext = await officeApiHelper.getExcelContext();

      const shapeInWorksheet = bindId && await officeShapeApiHelper.getShape(excelContext, bindId);

      if (shapeInWorksheet) {
        const {
          top,
          left,
          width,
          height,
          worksheetId
        } = shapeInWorksheet;
        operationStepDispatcher.updateObject({
          objectWorkingId,
          shapeProps: {
            top,
            left,
            width,
            height,
            worksheetId
          }
        });
      }

      operationStepDispatcher.completeSaveImageDetails(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Save Image Details');
    }
  };
}

const stepSaveImageDetails = new StepSaveImageDetails();
export default stepSaveImageDetails;
