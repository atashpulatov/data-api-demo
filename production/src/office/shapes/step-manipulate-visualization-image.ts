import {
  convertImageToBase64,
  convertPointsToPixels,
} from '../../helpers/visualization-image-utils';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { officeApiHelper } from '../api/office-api-helper';
import { officeShapeApiHelper } from './office-shape-api-helper';
import { determineImagePropsToBeAddedToBook } from './shape-helper-util';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, VisualizationInfo } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { OperationTypes } from '../../operation/operation-type-names';
import { ErrorMessages } from '../../error/constants';
import { reduxStore } from '../../store';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { getShapCollection } from '../../mstr-object/formatted-data-helper';

class StepManipulateVisualizationImage {
  /**
   * Generates the image of the selected visualization, converts it into a base64 image
   * and insert it into the worksheet. It will also save the shapeId of the inserted image
   * into the object state
   *
   * This function is subscribed as one of the operation steps with the key MANIPULATE_VISUALIZATION_IMAGE,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.bindId Unique id of the Office shape used for referencing the viz image in Excel
   * @param objectData.shapePosition Reference to shape position created by Excel
   * @param operationData Reference to the operation data required for error handling
   *
   */
  manipulateVisualizationImage = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
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
        bindIdToBeDuplicated,
      } = objectData;
      const { instanceDefinition, operationType } = operationData;
      const { instanceId } = instanceDefinition;

      const excelContext = await officeApiHelper.getExcelContext();

      // retrieve the shape in the worksheet
      const shapeInWorksheet =
        bindId && (await officeShapeApiHelper.getShape(excelContext, bindId));

      // retrieve the shape to be duplicated if the operation is DUPLICATE
      const shapeToBeDuplicated =
        bindIdToBeDuplicated &&
        (await officeShapeApiHelper.getShape(excelContext, bindIdToBeDuplicated));

      // validate the operation and throw error if the operation is invalid
      this.validateOperation(shapeInWorksheet, shapeToBeDuplicated, operationType);

      // Get the dimensions retrieved via the ON_VIZ_SELECTION_CHANGED listener and cached in the object state

      const { vizDimensions, visualizationKey } = visualizationInfo as VisualizationInfo;

      // Get the position of the selected range
      const selectedRangePos = await officeApiHelper.getSelectedRangePosition(excelContext);

      // Get the properties of image and the sheet where it needs to be inserted
      const { top, left, width, height, sheet } = determineImagePropsToBeAddedToBook({
        operationType,
        shapeProps,
        shapeInWorksheet,
        shapeToBeDuplicated,
        vizDimensions,
        selectedRangePos,
        excelContext,
      });

      // Generate the visualization image to be added to the worksheet
      const imageStream = await mstrObjectRestService.getVisualizationImage(
        objectId,
        projectId,
        instanceId,
        visualizationKey,
        {
          width: convertPointsToPixels(width),
          height: convertPointsToPixels(height),
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

      sheet.load(['id', 'name', 'position']);
      await excelContext.sync();

      const { id, name, position } = sheet;

      const { items } = await getShapCollection(sheet, excelContext);

      reduxStore.dispatch(officeActions.setShapeCollectionCount(
        {
          worksheetId: id,
          shapeCollectionCount: items.length
        }
      ));

      const updatedObject = {
        objectWorkingId,
        bindId: imageShapeId,
        worksheet: { id, name, index: position },
        groupData: { key: id, title: name, index: position },
        shapeProps: undefined as any, // reset the shape props after adding image
        bindIdToBeDuplicated: undefined as string, // reset the bindIdToBeDuplicated after adding image
        instanceId: undefined as string, // reset the instanceId after adding image
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
   * EDIT OPERATION - if the shape being edited is not defined
   * REFRESH OPERATION - if the shape being refreshed is not defined and the data has not been cleared
   * DUPLICATE OPERATION - if the shape being duplicated is not defined
   *
   * @param shapeInWorksheet shape present in the worksheet being edited or refreshed
   * @param shapeToBeDuplicated shape present in the worksheet being duplicated
   * @param excelContext Excel context.
   * @param operationType Type of operation
   * @throws VISUALIZATION_REMOVED_FROM_EXCEL error if the image was manually removed from sheet
   */
  validateOperation = (
    shapeInWorksheet: any,
    shapeToBeDuplicated: any,
    operationType: OperationTypes
  ): void => {
    const isInValidEditOperation =
      operationType === OperationTypes.EDIT_OPERATION && !shapeInWorksheet;

    const isInValidRefreshOperation =
      operationType === OperationTypes.REFRESH_OPERATION && !shapeInWorksheet;

    const isInValidDuplicateOperation =
      operationType === OperationTypes.DUPLICATE_OPERATION && !shapeToBeDuplicated;

    if (isInValidDuplicateOperation || isInValidEditOperation || isInValidRefreshOperation) {
      throw new Error(ErrorMessages.VISUALIZATION_REMOVED_FROM_EXCEL);
    }
  };
}

const stepManipulateVisualizationImage = new StepManipulateVisualizationImage();
export default stepManipulateVisualizationImage;
