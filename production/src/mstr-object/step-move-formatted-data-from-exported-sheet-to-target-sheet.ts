import { officeApiHelper } from '../office/api/office-api-helper';
import { getShapeCollection } from './formatted-data-helper'

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import { TITLE_EXCLUDED_DEFAULT_CELL_POSITION } from './constants';

class StepMoveFormattedDataFromExportedSheetToTargetSheet {
  /**
   * Moves formatted data(table) from export engine worksheet to current active worksheet.
   * Ultimately deletes the source worksheet(export engine worksheet) after copying 
   * the table range from source worksheet to target. 
   *
   * This function is subscribed as one of the operation steps with the key MOVE_FORMATTED_DATA_FROM_EXPORT_ENGINE,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.mstrObjectType Information about MSTR object type
   * @param operationData.startCell Address of the cell in Excel spreadsheet
   * @param operationData.instanceDefinition Object containing information about MSTR object
   * @param operationData.sourceWorksheetId Source worksheet id to copy the range from
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  moveFormattedDataFromExportedSheetToTargetSheet = async (objectData: ObjectData, operationData: OperationData): Promise<void> => {
    console.group('Moving exported formatted data to the selected worksheet');
    console.time('Total');

    try {
      const { startCell, instanceDefinition, sourceWorksheetId, excelContext } = operationData;
      const { isCrosstab, crosstabHeaderDimensions, objectWorkingId, worksheet } = objectData;

      let { rows, columns } = instanceDefinition;

      if (isCrosstab) {
        const { rowsX, rowsY, columnsX, columnsY } = crosstabHeaderDimensions;
        rows = columnsY + rowsY;
        columns = columnsX + rowsX;
      }

      // Get range starting from 'A3', to exclude the visualization title 
      const sourceTableRange = officeApiHelper.getRange(columns, TITLE_EXCLUDED_DEFAULT_CELL_POSITION, rows);
      const targetTableRange = officeApiHelper.getRange(columns, startCell, rows);

      const targetWorksheet = officeApiHelper.getExcelSheetById(
        excelContext,
        worksheet.id
      );

      const sourceWorksheet = officeApiHelper.getExcelSheetById(
        excelContext,
        sourceWorksheetId
      );

      const previousShapeCollection = await getShapeCollection(targetWorksheet, excelContext);
      const tableShapesStartIndex = previousShapeCollection?.items?.length;

      await officeApiHelper.copyRangeFromSourceWorksheet(
        {
          sourceTableRange,
          sourceWorksheet,
          targetTableRange,
          targetWorksheet
        }, excelContext);

      sourceWorksheet.delete();
      await excelContext.sync();

      const currentShapeCollection = await getShapeCollection(targetWorksheet, excelContext);

      if (currentShapeCollection?.items?.length > 0) {
        // Group the shape collection of imported table
        const shapeGroup = this.groupShapeCollection(currentShapeCollection, targetWorksheet, tableShapesStartIndex);

        shapeGroup.load('id');
        await excelContext.sync();

        // Link the shape group to imported table 
        objectData.shapeGroupId = shapeGroup.id;
      }

      operationStepDispatcher.updateObject(objectData);
      operationStepDispatcher.completeMoveFormattedDataFromExportedSheetToTargetSheet(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  }

  /**
   * Groupes the shape collection of imported table into one shape group and links it to imported table.
   *
   * @param shapeCollection Shape collection of imported table
   * @param worksheet Excel worksheet, where the object has been imported
   */
  private groupShapeCollection(currentShapeCollection: Excel.ShapeCollection, worksheet: Excel.Worksheet, tableShapesStartIndex: number): Excel.Shape {
    const { items } = currentShapeCollection;

    const shapeCollectionCount = items.length;

    // Crop the shape collection of recently imported table
    const currentTableShapes = items.slice(tableShapesStartIndex, shapeCollectionCount);

    // Group the shape collection of imported table
    const shapeGroup = currentShapeCollection.addGroup(currentTableShapes);

    return shapeGroup;
  }
}

const stepMoveFormattedDataFromExportedSheetToTargetSheet = new StepMoveFormattedDataFromExportedSheetToTargetSheet();
export default stepMoveFormattedDataFromExportedSheetToTargetSheet;