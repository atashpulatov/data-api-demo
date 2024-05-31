import { officeApiHelper } from '../office/api/office-api-helper';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';

const base64BlobFileDataSubstring = 'base64,';

class StepImportExportedWorksheetToCurrentWorkBook {
  /**
   * Imports the extracted worksheet from the excel blob workbook into current functional workbook.
   *
   * This function is subscribed as one of the operation steps with the key IMPORT_EXPORTED_WORKSHEET_TO_CURRENT_WORKBOOK,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.formattedData Object containing information about MSTR object
   */
  importExportedWorksheetToCurrentWorkBook = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    console.group('Import worksheet to current workbook');
    console.time('Total');

    try {
      const { formattedData: { excelBlob } } = operationData;
      const { objectWorkingId } = objectData;

      const excelContext = await officeApiHelper.getExcelContext();

      // DE294780: temporarily pause event handling to prevent onAdded event from being triggered
      // and causing unintentional side effects (updating objects to the wrong sheet, etc.)
      excelContext.runtime.enableEvents = false;
      await excelContext.sync();

      const exportEngineWorksheet = await this.insertExcelWorksheet(excelBlob, excelContext);
      operationData.sourceWorksheetId = exportEngineWorksheet.id;

      operationStepDispatcher.updateOperation(operationData);
      operationStepDispatcher.completeImportWorksheetToCurrentWorkBook(objectWorkingId);
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
  private async insertExcelWorksheet(blob: any, excelContext: Excel.RequestContext): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        const fileData = reader.result.toString();

        try {
          const activeWorksheet = officeApiHelper.getCurrentExcelSheet(excelContext);

          // slice the actual worbook encoded in base 64 from file data starting the last index of 'base64,' substring indicator
          const externalWorkbookBase64 = fileData.substring(
            fileData.indexOf(base64BlobFileDataSubstring) + base64BlobFileDataSubstring.length
          );
          const insertedWorksheets = officeApiHelper.insertExcelWorksheets(
            externalWorkbookBase64,
            excelContext
          );

          activeWorksheet.activate();
          await excelContext.sync();

          const exportEngineWorksheet = officeApiHelper.hideExcelWorksheet(
            insertedWorksheets.value[0],
            excelContext
          );

          resolve(exportEngineWorksheet);
        } catch (err) {
          reject(err);
        }
      };

      reader.readAsDataURL(blob);
    });
  }
}

const stepImportExportedWorksheetToCurrentWorkBook = new StepImportExportedWorksheetToCurrentWorkBook();
export default stepImportExportedWorksheetToCurrentWorkBook;
