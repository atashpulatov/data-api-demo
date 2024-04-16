import { officeApiHelper } from '../office/api/office-api-helper';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import mstrObjectEnum from './mstr-object-type-enum';

class StepMoveFormattedDataExportEngine {
  moveFormattedDataFromExportEngine = async (objectData: ObjectData, operationData: OperationData): Promise<void> => {
    console.group('Moving exported formatted data to the selected worksheet');
    console.time('Total');

    try {
      const { startCell, instanceDefinition, targetWorksheetId, sourceWorksheetId } = operationData;
      const { objectWorkingId, mstrObjectType } = objectData;

      const isDossier = mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;

      const { rows, columns } = instanceDefinition;
      const tableRange = officeApiHelper.getRange(columns, isDossier ? 'A3' : 'A1', rows);
      const targetTableRange = officeApiHelper.getRange(columns, startCell, rows);

      const excelContext = await officeApiHelper.getExcelContext();
      const finalWorksheet = excelContext.workbook.worksheets.getItemOrNullObject(targetWorksheetId);
      finalWorksheet.load('id, name, position');

      const orginalWorksheet = excelContext.workbook.worksheets.getItemOrNullObject(sourceWorksheetId);
      orginalWorksheet.load('id, name, position');

      finalWorksheet.getRange(targetTableRange).copyFrom(orginalWorksheet.getRange(tableRange));
      await excelContext.sync();

      orginalWorksheet.delete();
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