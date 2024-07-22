import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiService } from '../office/api/office-api-service';
import { formattedDataHelper } from './formatted-data-helper';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import { OFFICE_TABLE_EXTA_ROW, TITLE_EXCLUDED_DEFAULT_START_CELL_POSITION } from './constants';

class StepMoveFormattedDataFromExportedToTargetWorkSheet {
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
   * @param operationData.formattedData.sourceWorksheetId Source worksheet id to copy the range from
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  moveFormattedDataFromExportedToTargetWorkSheet = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    console.group('Moving exported formatted data to the selected worksheet');
    console.time('Total');

    let sourceWorksheet: Excel.Worksheet;

    try {
      const {
        startCell,
        instanceDefinition,
        formattedData: { sourceWorksheetId },
        excelContext,
      } = operationData;
      const { isCrosstab, objectWorkingId, worksheet } = objectData;

      const { rows, columns } = instanceDefinition;
      let sourceTableRows = rows;

      if (isCrosstab) {
        sourceTableRows = rows - OFFICE_TABLE_EXTA_ROW;
      }

      // Remove one row from source table rows, as getRange() utlimately adds an additional
      // row to source table range.
      // Note: Get range starting from 'A3', to exclude the visualization title
      const sourceTableRange = officeApiService.getRange(
        columns,
        TITLE_EXCLUDED_DEFAULT_START_CELL_POSITION,
        sourceTableRows - OFFICE_TABLE_EXTA_ROW
      );
      const targetTableRange = officeApiService.getRange(
        columns,
        startCell,
        rows - OFFICE_TABLE_EXTA_ROW
      );

      const targetWorksheet = officeApiHelper.getExcelSheetById(excelContext, worksheet.id);

      sourceWorksheet = officeApiHelper.getExcelSheetById(excelContext, sourceWorksheetId);

      const previousShapeCollection = await formattedDataHelper.getShapeCollection(targetWorksheet, excelContext);
      const tableShapesStartIndex = previousShapeCollection?.items?.length || 0;

      await officeApiService.copyRangeFromSourceWorksheet(
        {
          sourceTableRange,
          sourceWorksheet,
          targetTableRange,
          targetWorksheet,
        },
        excelContext
      );

      // Remove source worksheet, once formatted data migration from source to target worksheet has completed
      if (sourceWorksheet) {
        sourceWorksheet.delete();
        await excelContext.sync();
      }

      const currentShapeCollection = await formattedDataHelper.getShapeCollection(targetWorksheet, excelContext);
      const tableShapesEndIndex = currentShapeCollection?.items?.length || 0;

      if (tableShapesEndIndex > 0 && tableShapesEndIndex > tableShapesStartIndex) {
        // Group the shape collection of imported table
        const shapeGroup = this.groupShapeCollection(
          currentShapeCollection,
          targetWorksheet,
          tableShapesStartIndex
        );

        shapeGroup.load('id');
        await excelContext.sync();

        // Link the shape group to imported table
        objectData.shapeGroupId = shapeGroup.id;
      }

      operationStepDispatcher.updateObject(objectData);
      operationStepDispatcher.completeMoveFormattedDataFromExportedToTargetWorkSheet(
        objectWorkingId
      );
    } catch (error) {
      // Remove exported worksheet from current workbook on error
      if (sourceWorksheet) {
        sourceWorksheet.delete();
        await operationData.excelContext.sync();
      }

      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };

  /**
   * Groupes the shape collection of imported table into one shape group and links it to imported table.
   *
   * @param shapeCollection Shape collection of imported table
   * @param worksheet Excel worksheet, where the object has been imported
   */
  private groupShapeCollection(
    currentShapeCollection: Excel.ShapeCollection,
    worksheet: Excel.Worksheet,
    tableShapesStartIndex: number
  ): Excel.Shape {
    const { items } = currentShapeCollection;

    const shapeCollectionCount = items.length;

    // Crop the shape collection of recently imported table
    const currentTableShapes = items.slice(tableShapesStartIndex, shapeCollectionCount);

    // Group the shape collection of imported table
    const shapeGroup = currentShapeCollection.addGroup(currentTableShapes);

    return shapeGroup;
  }
}

const stepMoveFormattedDataFromExportedToTargetWorkSheet =
  new StepMoveFormattedDataFromExportedToTargetWorkSheet();
export default stepMoveFormattedDataFromExportedToTargetWorkSheet;
