import { officeShapeApiHelper } from './office-shape-api-helper';
import { officeApiHelper } from '../api/office-api-helper';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { convertImageToBase64, convertPointsToPixels } from '../../helpers/visualization-image-utils';
import { determineImagePropsToBeAddedToBook } from './shape-helper-util';
import { errorMessages } from '../../error/constants';
import { DUPLICATE_OPERATION, REFRESH_OPERATION, EDIT_OPERATION } from '../../operation/operation-type-names';

class StepManipulateVisualizationImage {
  /**
   * Generates the image of the selected visualization, converts it into a base64 image
   * and insert it into the worksheet. It will also save the shapeId of the inserted image
   * into the object state
   *
   * This function is subscribed as one of the operation steps with the key MANIPULATE_VISUALIZATION_IMAGE,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Unique id of the Office shape used for referencing the viz image in Excel
   * @param {Object} objectData.shapePosition Reference to shape position created by Excel
   * @param {Object} operationData Reference to the operation data required for error handling
   *
   */
  manipulateVisualizationImage = async (objectData, operationData) => {
    console.time('Refresh Visualization Image');
    try {
      const {
        bindId,
        objectWorkingId,
        shapeProps,
        projectId,
        objectId,
        name: visualizationName,
        visualizationInfo,
        bindIdToBeDuplicated
      } = objectData;
      const { instanceDefinition, operationType } = operationData;
      const { instanceId } = instanceDefinition;

      const excelContext = await officeApiHelper.getExcelContext();

      // retrieve the shape in the worksheet
      const shapeInWorksheet = bindId && await officeShapeApiHelper.getShape(excelContext, bindId);

      // validate if the shape still exists in the excel worksheet
      this.validateShapePresenceInWorksheet(operationType, shapeInWorksheet, bindIdToBeDuplicated);

      // retrieve the dimensions of the shape to be duplicated for DUPLICATE OPERATION
      const shapeDimensionsForDuplicateOp = bindIdToBeDuplicated
        && await this.getDuplicatedShapeDimensions(bindIdToBeDuplicated, excelContext);

      // Get the dimensions retrieved via the ON_VIZ_SELECTION_CHANGED listener and cached in the object state
      const { vizDimensions, visualizationKey } = visualizationInfo;

      // Get the position of the selected range
      const selectedRangePos = await officeApiHelper.getSelectedRangePosition(excelContext);

      // Get the properties of image and the sheet where it needs to be inserted
      const {
        top,
        left,
        width,
        height,
        sheet
      } = determineImagePropsToBeAddedToBook({
        operationType,
        shapeProps,
        shapeInWorksheet,
        shapeDimensionsForDuplicateOp,
        vizDimensions,
        selectedRangePos,
        excelContext
      });

      // Generate the visualization image to be added to the worksheet
      const imageStream = await mstrObjectRestService.getVisualizationImage(
        objectId,
        projectId,
        instanceId,
        visualizationKey,
        {
          width: convertPointsToPixels(width),
          height: convertPointsToPixels(height)
        }
      );

      // convert image stream response to base64 image
      const base64Image = await convertImageToBase64(imageStream);

      // Add the image to the worksheet
      const imageShapeId = await officeShapeApiHelper.addImage(
        excelContext,
        base64Image,
        visualizationName,
        { top, left },
        { width, height },
        sheet
      );

      // Delete the shape already present in the workbook
      if (shapeInWorksheet) {
        shapeInWorksheet.delete();
      }

      sheet.load(['id', 'name']);
      await excelContext.sync();

      const { id, name } = sheet;

      const updatedObject = {
        objectWorkingId,
        bindId: imageShapeId,
        worksheet: { id, name },
        shapeProps: undefined, // reset the shape props after adding image
        bindIdToBeDuplicated: undefined, // reset the bindIdToBeDuplicated after adding image
        instanceId: undefined // reset the instanceId after adding image
      };
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeManipulateVisualizationImage(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Refresh Visualization Image');
    }
  };

  /**
   * Checks whether the Edit, Refresh Or Duplicate operations are valid and throws an error
   * for the following conditions
   *
   *  EDIT & REFRESH OPERATION - if the shape being edited or refreshed is not defined
   *  DUPLICATE OPERATION - if the shape being duplicated is not defined
   *
   * @param {String} operationType Type of operation.
   * @param {Object} shapeInWorksheet Shape present in worksheet
   * @param {Object} bindIdToBeDuplicated Unique id of the Office shape to be duplicated.
   * @param {Object} excelContext Excel context.
   * @throws {Error} VISUALIZATION_REMOVED_FROM_EXCEL error if the image was manually removed from sheet
   */
  validateShapePresenceInWorksheet = async (
    operationType,
    shapeInWorksheet,
    bindIdToBeDuplicated,
  ) => {
    let isInValidOperation;

    switch (operationType) {
      case REFRESH_OPERATION:
      case EDIT_OPERATION:
        isInValidOperation = !shapeInWorksheet;
        break;
      case DUPLICATE_OPERATION:
        {
          const excelContext = await officeApiHelper.getExcelContext();
          // For duplicate operation use bindIdToBeDuplicated to retieve the shape from worksheet for validation purpose
          const shapeToBeDuplicated = bindIdToBeDuplicated && await officeShapeApiHelper.getShape(
            excelContext,
            bindIdToBeDuplicated
          );
          isInValidOperation = !shapeToBeDuplicated;
        }
        break;
      default:
        isInValidOperation = false;
    }

    // Throw an error and block the invalid operation, if shape(visualization image)
    // was removed manually from worksheet.
    if (isInValidOperation) {
      throw new Error(errorMessages.VISUALIZATION_REMOVED_FROM_EXCEL);
    }
  };

  /**
   * Get the dimensions of the shape to be duplicated.
   *
   * @param {Object} bindIdToBeDuplicated Unique id of the Office shape to be duplicated.
   * @param {Object} excelContext Excel context.
   *
   * @returns {Object} Dimensions of the shape to be duplicated.
   */
  getDuplicatedShapeDimensions = async (bindIdToBeDuplicated, excelContext) => {
    const shapeToBeDuplicated = await officeShapeApiHelper.getShape(excelContext, bindIdToBeDuplicated);
    const { height, width } = shapeToBeDuplicated || {};
    return { height, width };
  };
}

const stepManipulateVisualizationImage = new StepManipulateVisualizationImage();
export default stepManipulateVisualizationImage;
