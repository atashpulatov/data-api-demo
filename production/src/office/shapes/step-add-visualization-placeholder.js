import { officeShapeApiHelper } from './office-shape-api-helper';
import { officeApiHelper } from '../api/office-api-helper';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';
import officeStoreObject from '../store/office-store-object';
import { CLEAR_DATA_OPERATION } from '../../operation/operation-type-names';

class StepAddVisualizationPlaceholder {
  /**
   * Adds the visualization placeholder in the worksheet
   *
   * This function is subscribed as one of the operation steps with the key ADD_VISUALIZATION_PLACEHOLDER,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} objectData.shapeProps Properties of the viz image imported into worksheet
   * @param {String} objectData.name Name of the visualization image
   * @param {Object} operationData Reference to the operation data required for error handling
   */
  addVisualizationPlaceholder = async (objectData, operationData) => {
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
      shapeFill.transparency = 0.1;
      shapeFill.foregroundColor = 'white';

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
