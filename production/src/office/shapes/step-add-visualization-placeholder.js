import { officeShapeApiHelper } from './office-shape-api-helper';
import { officeApiHelper } from '../api/office-api-helper';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';
import officeStoreObject from '../store/office-store-object';
import { CLEAR_DATA_OPERATION } from '../../operation/operation-type-names';

class StepAddVisualizationPlaceholder {
  /**
   * Deletes the visualization image from the worksheet
   *
   * This function is subscribed as one of the operation steps with the key REMOVE_VISUALIZATION_IMAGE,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.bindId Unique id of the Office shape used for referencing the viz image in Excel
   * @param {Object} operationData Reference to the operation data required for error handling
   */
  addVisualizationPlaceholder = async (objectData, operationData) => {
    console.log('operationData', operationData);
    try {
      const {
        objectWorkingId,
        shapeProps,
        name: visualizationName,
      } = objectData;
      const excelContext = await officeApiHelper.getExcelContext();

      const sheet = excelContext.workbook.worksheets.getItem(shapeProps?.worksheetId);

      const shape = sheet.shapes.addGeometricShape(Excel.GeometricShapeType.rectangle);

      const shapeFill = shape.fill;
      shapeFill.foregroundColor = 'white';
      shape.textFrame.textRange.text = visualizationName;
      shape.textFrame.textRange.font.color = 'green';
      shape.textFrame.horizontalAlignment = Excel.ShapeTextHorizontalAlignment.center;
      shape.textFrame.verticalAlignment = Excel.ShapeTextVerticalAlignment.middle;

      shape.left = shapeProps?.left;
      shape.top = shapeProps?.top;
      shape.height = shapeProps?.height;
      shape.width = shapeProps?.width;
      shape.name = visualizationName;

      shape.load(['id']);

      await excelContext.sync();

      const updatedObject = {
        objectWorkingId,
        bindId: shape.id,
        worksheet: undefined,
        shapeProps: undefined, // reset the shape props after adding image
        bindIdToBeDuplicated: undefined, // reset the bindIdToBeDuplicated after adding image
        instanceId: undefined, // reset the instanceId after adding image
        dataCleared: undefined, // reset dataCleared after adding image
      };
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeAddVisualizationPlaceholder(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Add Visualization Placeholder');
    }
  };
}

const stepAddVisualizationPlaceholder = new StepAddVisualizationPlaceholder();
export default stepAddVisualizationPlaceholder;
