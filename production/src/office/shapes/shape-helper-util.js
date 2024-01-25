import {
  DUPLICATE_OPERATION,
  EDIT_OPERATION,
  IMPORT_OPERATION,
  REFRESH_OPERATION
} from '../../operation/operation-type-names';
import { officeApiHelper } from '../api/office-api-helper';

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
  *
  * @param {String} operationType Type of operation
  * @param {Object} shapeProps Shape properties saved as part of CLEAR DATA operation
  * @param {Object} shapeInWorksheet Shape present in worksheet
  * @param {Object} shapeDimensionsForDuplicateOp Dimensions of the shape to be duplicated
  * @param {Object} vizDimensions Dimensions of the visualization saved in redux store
  * @param {Object} selectedRangePos Position of the range selected by user
  * @param {Object} excelContext Excel context
  *
  * @return {Object} Image properties to be added to the workbook
  */
export const determineImagePropsToBeAddedToBook = ({
  operationType,
  shapeProps,
  shapeInWorksheet,
  shapeDimensionsForDuplicateOp,
  vizDimensions,
  selectedRangePos,
  excelContext
}) => {
  let imageWidth;
  let imageHeight;
  let imageTop;
  let imageLeft;
  let sheet = officeApiHelper.getCurrentExcelSheet(excelContext);

  /**
   * Get the first valid number dimension from the array of dimensions.
   *
   * @param {Array} values Array of dimensions
   *
   * @returns {Number} First valid number dimension
   */
  const getValidDimension = (dimensions = []) => {
    for (const dim of dimensions) {
      if (typeof dim === 'number') {
        return dim;
      }
    }
    return 0;
  };

  switch (operationType) {
    case EDIT_OPERATION:
      imageWidth = getValidDimension([shapeInWorksheet?.width, vizDimensions.width]);
      imageHeight = getValidDimension([shapeInWorksheet?.height, vizDimensions.height]);
      imageTop = getValidDimension([shapeInWorksheet?.top, selectedRangePos?.top]);
      imageLeft = getValidDimension([shapeInWorksheet?.left, selectedRangePos?.left]);
      break;
    case REFRESH_OPERATION:
      imageWidth = getValidDimension([shapeProps?.width, shapeInWorksheet?.width, vizDimensions.width]);
      imageHeight = getValidDimension([shapeProps?.height, shapeInWorksheet?.height, vizDimensions.height]);
      imageTop = getValidDimension([shapeProps?.top, shapeInWorksheet?.top, selectedRangePos?.top]);
      imageLeft = getValidDimension([shapeProps?.left, shapeInWorksheet?.left, selectedRangePos?.left]);
      sheet = shapeProps?.worksheetId ? excelContext.workbook.worksheets.getItem(shapeProps?.worksheetId) : sheet;
      break;
    case DUPLICATE_OPERATION:
      imageWidth = getValidDimension([shapeDimensionsForDuplicateOp?.width, vizDimensions.width]);
      imageHeight = getValidDimension([shapeDimensionsForDuplicateOp?.height, vizDimensions.height]);
      imageTop = selectedRangePos?.top || 0;
      imageLeft = selectedRangePos?.left || 0;
      break;
    case IMPORT_OPERATION:
    default:
      imageWidth = vizDimensions.width;
      imageHeight = vizDimensions.height;
      imageTop = selectedRangePos?.top || 0;
      imageLeft = selectedRangePos?.left || 0;
      break;
  }

  return {
    imageTop,
    imageLeft,
    imageWidth,
    imageHeight,
    sheet
  };
};
