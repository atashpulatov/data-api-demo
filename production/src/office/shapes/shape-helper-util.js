import {
  DUPLICATE_OPERATION,
  EDIT_OPERATION,
  IMPORT_OPERATION,
  REFRESH_OPERATION,
} from '../../operation/operation-type-names';
import { officeApiHelper } from '../api/office-api-helper';

/**
 * IMPORT_OPERATION & DEFAULT
 * Use the viz dimensions cached from ON_VIZ_SELECTION_CHANGED listener to generate the image and the
 * range selected by the user to position the image.
 *
 * EDIT_OPERATION
 * Use the dimensions of the shape in the worksheet to generate the image.If the shape
 * has been deleted then use the viz dimensions from ON_VIZ_SELECTION_CHANGED listener
 * to generate the image.Use the range selected by the user to position the image.
 *
 * REFRESH_OPERATION
 * If the REFRESH operation is part of a VIEW_DATA user action then use the cached shape
 * dimensions and position cached during the CLEAR_DATA operation to generate and position
 * the image respectively
 * If the REFRESH operation is triggered by a straight forward refresh action then shapeProps
 * will be undefined and we will use the dimensions and position of the shape in the worksheet
 * If the shape in the worksheet has been deleted then use the viz dimensions from ON_VIZ_SELECTION_CHANGED
 * listener to generate the imagee and selected user range to position the image.
 *
 * DUPLICATE_OPERATION
 * Use the dimensions of the shape to be duplicated to generate the image.If the shape
 * has been deleted then use the viz dimensions from ON_VIZ_SELECTION_CHANGED listener
 * to generate the image. Use the selected range to position the image.
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
  excelContext,
}) => {
  const sheet = officeApiHelper.getCurrentExcelSheet(excelContext);

  const defaultFallbackTop = selectedRangePos?.top || 0;
  const defaultFallbackLeft = selectedRangePos?.left || 0;

  const defaultImageProps = {
    width: vizDimensions.width,
    height: vizDimensions.height,
    top: defaultFallbackTop,
    left: defaultFallbackLeft,
    sheet,
  };

  const imageInWorkSheetProps = shapeInWorksheet && {
    width: shapeInWorksheet.width,
    height: shapeInWorksheet.height,
    top: shapeInWorksheet.top,
    left: shapeInWorksheet.left,
    sheet,
  };
  const cachedImageProps = shapeProps && {
    width: shapeProps.width,
    height: shapeProps.height,
    top: shapeProps.top,
    left: shapeProps.left,
    sheet: excelContext.workbook.worksheets.getItem(shapeProps?.worksheetId),
  };
  const imagePropsForDuplicateOp = shapeDimensionsForDuplicateOp && {
    ...shapeDimensionsForDuplicateOp,
    top: defaultFallbackTop,
    left: defaultFallbackLeft,
    sheet,
  };

  switch (operationType) {
    case EDIT_OPERATION:
      return imageInWorkSheetProps || defaultImageProps;
    case REFRESH_OPERATION:
      return cachedImageProps || imageInWorkSheetProps || defaultImageProps;
    case DUPLICATE_OPERATION:
      return imagePropsForDuplicateOp || defaultImageProps;
    case IMPORT_OPERATION:
    default:
      return defaultImageProps;
  }
};
