import { officeApiHelper } from '../office/api/office-api-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';

const workbookBase64StartIndentationLength = 7;

class StepImportExportEngineWorkbook {
  /**
   * Fetches the excel workbook as blob data from export engine and inserts the extracted
   * worksheet into current functional workbook.
   *
   * This function is subscribed as one of the operation steps with the key IMPORT_EXPORT_ENGINE_WORKBOOK,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.objectId Id of the MSTR object being currently processed
   * @param objectData.visualizationInfo Information about location of visualization in dossier
   * @param objectData.projectId Id of the MSTR project from which we fetch data
   * @param operationData.instanceDefinition Object containing information about MSTR object
   */
  importExportEngineWorkbook = async (objectData: ObjectData, operationData: OperationData): Promise<void> => {
    console.group('Importing export engine workbook');
    console.time('Total');

    try {
      const { instanceDefinition } = operationData;

      const { objectWorkingId, objectId, visualizationInfo, projectId } = objectData;

      const excelContext = await officeApiHelper.getExcelContext();

      // @ts-expect-error
      const { visualizationKey } = visualizationInfo;
      const response = await mstrObjectRestService.getWorksheetBinary(
        {
          dossierId: objectId,
          dossierInstanceId: instanceDefinition.instanceId,
          visualizationKey,
          projectId
        }
      );
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

  /**
   * Inserts the blob as worksheet into current functional workbook and sets the active worksheet to the inserted worksheet.
   *
   * @param blob Worksheet blob exported by export engine
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  private async loadExportEngineWorksheet(blob: any, excelContext: Excel.RequestContext): Promise<any> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const fileData = reader.result.toString();

        try {
          const activeWorksheet = officeApiHelper.getCurrentExcelSheet(excelContext);

          const externalWorkbookBase64 = fileData.substring(fileData.indexOf('base64,') + workbookBase64StartIndentationLength);
          const insertedWorksheets = officeApiHelper.inserExcelWorksheets(externalWorkbookBase64, excelContext);

          activeWorksheet.activate();
          await excelContext.sync();

          const exportEngineWorksheet = officeApiHelper.hideExcelWorksheet(insertedWorksheets.value[0], excelContext);

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