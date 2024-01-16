import { officeShapeApiHelper } from './office-shape-api-helper';
import { officeApiHelper } from '../api/office-api-helper';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { convertImageToBase64 } from '../../helpers/visualization-image-utils';

class StepRefreshVisualizationImage {
  /**
   * Generates the image of the selected visualization, converts it into a base64 image
   * and insert it into the worksheet. It will also save the shapeId of the inserted image
   * into the object state
   *
   * This function is subscribed as one of the operation steps with the key REFRESH_VISUALIZATION_IMAGE,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Unique id of the Office shape used for referencing the viz image in Excel
   * @param {Office} objectData.shapePosition Reference to shape position created by Excel
   */
  refreshVisualizationImage = async (objectData, operationData) => {
    console.time('Refresh Visualization Image');
    try {
      const {
        bindId,
        objectWorkingId,
        shapePosition,
        projectId,
        objectId,
        preparedInstanceId,
        visualizationInfo
      } = objectData;
      const excelContext = await officeApiHelper.getExcelContext();

      const shapeInWorksheet = bindId && await officeShapeApiHelper.getShape(excelContext, bindId);

      const { visualizationKey, vizDimensions } = visualizationInfo;

      // if shape is already present in the workbook we will use the dimensions of the existing shape
      // otherwise we will use the dimensions from the object state to generate the image
      const width = (shapeInWorksheet && shapeInWorksheet.width) || vizDimensions.width;
      const height = (shapeInWorksheet && shapeInWorksheet.height) || vizDimensions.height;
      const imageStream = await mstrObjectRestService.getVisualizationImage(
        objectId,
        projectId,
        preparedInstanceId,
        visualizationKey,
        { width, height }
      );

      // convert to base64 image
      const base64Image = await convertImageToBase64(imageStream);

      // Delete the shape if already present in the workbook
      if (shapeInWorksheet) {
        shapeInWorksheet.delete();
        await excelContext.sync();
      }

      // Get the position of the selected range and the cached position in the object state
      const selectedRangePos = await officeApiHelper.getSelectedRangePosition(excelContext);
      const { top, left } = shapePosition || {};

      // if shape is already present in the workbook we will use the position of the existing shape
      // otherwise we will use the position from the object state to add the image
      const imageTop = (shapeInWorksheet && shapeInWorksheet.top) || top || selectedRangePos.top;
      const imageLeft = (shapeInWorksheet && shapeInWorksheet.left) || left || selectedRangePos.left;
      const imageShapeId = await officeShapeApiHelper.addImage(excelContext, base64Image, imageTop, imageLeft);

      const updatedObject = {
        objectWorkingId,
        bindId: imageShapeId,
        shapePosition: undefined // reset the shape position after adding image
      };
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeRefreshVisualizationImage(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Refresh Visualization Image');
    }
  };
}

const stepRefreshVisualizationImage = new StepRefreshVisualizationImage();
export default stepRefreshVisualizationImage;
