import { officeShapeApiHelper } from './office-shape-api-helper';
import { officeApiHelper } from '../api/office-api-helper';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { convertImageToBase64, convertPointsToPixels } from '../../helpers/visualization-image-utils';
import {
  DUPLICATE_OPERATION,
  EDIT_OPERATION,
  IMPORT_OPERATION,
  REFRESH_OPERATION
} from '../../operation/operation-type-names';

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
   * @param {Object} objectData.shapePosition Reference to shape position created by Excel
   * @param {Object} operationData Reference to the operation data required for error handling
   *
   */
  refreshVisualizationImage = async (objectData, operationData) => {
    console.time('Refresh Visualization Image');
    try {
      const {
        bindId,
        objectWorkingId,
        shapeProps,
        projectId,
        objectId,
        visualizationInfo,
        bindIdToBeDuplicated
      } = objectData;
      const { instanceDefinition, operationType } = operationData;
      const { instanceId } = instanceDefinition;

      const excelContext = await officeApiHelper.getExcelContext();

      // retrieve the shape in the worksheet
      const shapeInWorksheet = bindId && await officeShapeApiHelper.getShape(excelContext, bindId);

      // retrieve the dimensions of the shape to be duplicated for DUPLICATE OPERATION
      const shapeDimensionsForDuplicateOp = bindIdToBeDuplicated
        && await this.getDuplicatedShapeDimensions(bindIdToBeDuplicated, excelContext);

      // Get the dimensions retrieved via the ON_VIZ_SELECTION_CHANGED listener and cached in the object state
      const { vizDimensions, visualizationKey } = visualizationInfo;

      // Get the position of the selected range
      const selectedRangePos = await officeApiHelper.getSelectedRangePosition(excelContext);

      let imageWidth;
      let imageHeight;
      let imageTop;
      let imageLeft;
      let sheet = officeApiHelper.getCurrentExcelSheet(excelContext);

      /**
       * IMPORT_OPERATION & DEFAULT
       * Use the cached viz dimensions to generate the image and the
       * range selected by the user to position the image.
       *
       * EDIT_OPERATION
       * Use the dimensions of the shape in the worksheet to generate the image.If the shape
       * has been deleted then use the cached viz dimensions to generate the image.Use the range
       * selected by the user to position the image.
       *
       * REFRESH_OPERATION
       * If the REFRESH operation is part of a VIEW_DATA user action then use the cached shape
       * dimensions and position cached during the CLEAR_DATA operation to generate and position
       * the image respectively
       * If the REFRESH operation is triggered by a straight forward refresh action then shapeProps
       * will be undefined and we will use the dimensions and position of the shape in the worksheet
       * If the shape in the worksheet has been deleted then use the cached viz dimensions to generate
       * the image and selected user range to position the image.
       *
       * DUPLICATE_OPERATION
       * Use the dimensions of the shape to be duplicated to generate the image.If the shape
       * has been deleted then use the viz dimensions to generate the image.Use the selected range to
       * position the image.
       */
      switch (operationType) {
        case EDIT_OPERATION:
          imageWidth = shapeInWorksheet?.width || vizDimensions.width;
          imageHeight = shapeInWorksheet?.height || vizDimensions.height;
          imageTop = shapeInWorksheet?.top || selectedRangePos?.top;
          imageLeft = shapeInWorksheet?.left || selectedRangePos?.left;
          break;
        case REFRESH_OPERATION:
          imageWidth = shapeProps?.width || shapeInWorksheet?.width || vizDimensions.width;
          imageHeight = shapeProps?.height || shapeInWorksheet?.height || vizDimensions.height;
          imageTop = shapeProps?.top || shapeInWorksheet?.top || selectedRangePos?.top;
          imageLeft = shapeProps?.top || shapeInWorksheet?.left || selectedRangePos?.left;
          sheet = shapeProps?.worksheetId ? excelContext.workbook.worksheets.getItem(shapeProps?.worksheetId) : sheet;
          break;
        case DUPLICATE_OPERATION:
          imageWidth = shapeDimensionsForDuplicateOp?.width || vizDimensions.width;
          imageHeight = shapeDimensionsForDuplicateOp?.height || vizDimensions.height;
          imageTop = selectedRangePos?.top;
          imageLeft = selectedRangePos?.left;
          break;
        case IMPORT_OPERATION:
        default:
          imageWidth = vizDimensions.width;
          imageHeight = vizDimensions.height;
          imageTop = selectedRangePos?.top;
          imageLeft = selectedRangePos?.left;
          break;
      }

      // Generate the visualization image to be added to the worksheet
      const imageStream = await mstrObjectRestService.getVisualizationImage(
        objectId,
        projectId,
        instanceId,
        visualizationKey,
        {
          width: convertPointsToPixels(imageWidth),
          height: convertPointsToPixels(imageHeight)
        }
      );

      // convert image stream response to base64 image
      const base64Image = await convertImageToBase64(imageStream);

      // Add the image to the worksheet
      const imageShapeId = await officeShapeApiHelper.addImage(
        excelContext,
        base64Image,
        imageTop,
        imageLeft,
        sheet
      );

      // Delete the shape already present in the workbook
      if (shapeInWorksheet) {
        shapeInWorksheet.delete();
        await excelContext.sync();
      }

      const updatedObject = {
        objectWorkingId,
        bindId: imageShapeId,
        shapeProps: undefined, // reset the shape props after adding image
        bindIdToBeDuplicated: undefined, // reset the bindIdToBeDuplicated after adding image
        instanceId: undefined // reset the instanceId after adding image
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

  /**
   * Get the dimensions of the shape to be duplicated.
   *
   * @param {Object} bindIdToBeDuplicated Unique id of the Office shape to be duplicated.
   * @param {Object} excelContex Excel context.
   *
   * @returns {Object} Dimensions of the shape to be duplicated.
   */
  getDuplicatedShapeDimensions = async (bindIdToBeDuplicated, excelContext) => {
    const shapeToBeDuplicated = await officeShapeApiHelper.getShape(excelContext, bindIdToBeDuplicated);
    const { height, width } = shapeToBeDuplicated || {};
    return { height, width };
  };
}

const stepRefreshVisualizationImage = new StepRefreshVisualizationImage();
export default stepRefreshVisualizationImage;
