import { officeApiHelper } from '../office/api/office-api-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';

const workbookBase64StartIndentationLength = 7;

class StepImportExportEngineWorkbook {
  importExportEngineWorkbook = async (objectData: ObjectData, operationData: OperationData): Promise<void> => {
    console.group('Importing export engine workbook');
    console.time('Total');

    try {
      const { instanceDefinition } = operationData;

      const { objectWorkingId, objectId, visualizationInfo, projectId } = objectData;

      const excelContext = await officeApiHelper.getExcelContext();

      // @ts-expect-error
      const response = await mstrObjectRestService.getWorksheetBinary(objectId, instanceDefinition.instanceId, visualizationInfo.visualizationKey, projectId);
      const excelBlob = await response.blob();

      const exportEngineWorksheet = await this.loadExportEngineWorksheet(excelBlob, excelContext);
      operationData.sourceWorksheetId = exportEngineWorksheet.id;

      operationStepDispatcher.updateOperation(operationData);
      operationStepDispatcher.completeImportExportEngineWorkbook(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };

  private async loadExportEngineWorksheet(blob: any, excelContext: Excel.RequestContext): Promise<any> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const fileData = reader.result.toString();

        try {
          const activeWorksheet = officeApiHelper.getCurrentExcelSheet(excelContext);

          const externalWorkbook = fileData.substring(fileData.indexOf('base64,') + workbookBase64StartIndentationLength);
          const newSheetsIds = excelContext.workbook.insertWorksheetsFromBase64(externalWorkbook);

          activeWorksheet.activate();
          await excelContext.sync();

          // grab the worksheet object
          const exportEngineWorksheet = excelContext.workbook.worksheets.getItem(newSheetsIds.value[0]);
          exportEngineWorksheet.visibility = Excel.SheetVisibility.hidden;

          await excelContext.sync();

          resolve(exportEngineWorksheet);
        } catch (err) {
          reject(err);
        }
      };

      reader.readAsDataURL(blob);
    });
  }

}

const stepImportExportEngineWorkbook = new StepImportExportEngineWorkbook();
export default stepImportExportEngineWorkbook;