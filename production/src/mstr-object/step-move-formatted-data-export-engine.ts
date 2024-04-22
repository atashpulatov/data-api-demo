import { officeApiHelper } from '../office/api/office-api-helper';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import mstrObjectEnum from './mstr-object-type-enum';

class StepMoveFormattedDataExportEngine {
  /**
   * Moves formatted table from export engine worksheet to current active worksheet.
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
  moveFormattedDataFromExportEngine = async (objectData: ObjectData, operationData: OperationData): Promise<void> => {
    console.group('Moving exported formatted data to the selected worksheet');
    console.time('Total');

    try {
      const { startCell, instanceDefinition, sourceWorksheetId, excelContext } = operationData;
      const { objectWorkingId, mstrObjectType } = objectData;

      const isDossier = mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;

      const { rows, columns } = instanceDefinition;
      const sourceTableRange = officeApiHelper.getRange(columns, isDossier ? 'A3' : 'A1', rows);
      const targetTableRange = officeApiHelper.getRange(columns, startCell, rows);

      const targetWorksheet = officeApiHelper.getExcelSheetById(
        excelContext,
        objectData.worksheet.id
      );

      const sourceWorksheet = officeApiHelper.getExcelSheetById(
        excelContext,
        sourceWorksheetId
      );

      await officeApiHelper.copyRangeFromSourceWorksheet(
        {
          sourceTableRange,
          sourceWorksheet,
          targetTableRange,
          targetWorksheet
        }, excelContext);

      sourceWorksheet.delete();
      await excelContext.sync();

      operationStepDispatcher.completeMoveFormattedDataExportEngine(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  }
}

const stepMoveFormattedDataExportEngine = new StepMoveFormattedDataExportEngine();
export default stepMoveFormattedDataExportEngine;