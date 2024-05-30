import { read } from 'xlsx';

import { officeApiHelper } from '../office/api/office-api-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, VisualizationInfo } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import mstrObjectEnum from './mstr-object-type-enum';

class StepExportExcelWorkBook {
    /**
     * Fetches the excel workbook as blob data from export engine.
     *
     * This function is subscribed as one of the operation steps with the key EXPORT_EXCEL_WORKBOOK,
     * therefore should be called only via operation bus.
     *
     * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
     * @param objectData.objectId Id of the MSTR object being currently processed
     * @param objectData.visualizationInfo Information about location of visualization in dossier
     * @param objectData.projectId Id of the MSTR project from which we fetch data
     * @param objectData.mstrObjectType Information about MSTR object type
     * @param operationData.instanceDefinition Object containing information about MSTR object
     */
    exportExcelWorkBook = async (
        objectData: ObjectData,
        operationData: OperationData
    ): Promise<void> => {
        console.group('Export excel workbook');
        console.time('Total');

        try {
            const { instanceDefinition } = operationData;
            const { objectWorkingId, objectId, visualizationInfo, projectId, mstrObjectType } =
                objectData;
            const excelContext = await officeApiHelper.getExcelContext();

            let response: Response;
            if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
                const { visualizationKey } = visualizationInfo as VisualizationInfo;
                response = await mstrObjectRestService.exportDossierToExcel({
                    dossierId: objectId,
                    dossierInstanceId: instanceDefinition.instanceId,
                    visualizationKey,
                    projectId,
                });
            } else {
                // mstrObjectType is a report type
                response = await mstrObjectRestService.exportReportToExcel({
                    reportId: objectId,
                    reportInstanceId: instanceDefinition.instanceId,
                    projectId,
                });
            }

            const excelBlob = await response.blob();

            const exportedWorksheetTableRange = await this.getExportedWorksheetTableRange(excelBlob, excelContext);

            operationData.formattedData = {
                excelBlob,
                tableRange: exportedWorksheetTableRange
            };

            operationStepDispatcher.updateOperation(operationData);
            operationStepDispatcher.completeExportToCurrentWorkbook(objectWorkingId);
        } catch (error) {
            console.error(error);
            operationErrorHandler.handleOperationError(objectData, operationData, error);
        } finally {
            console.timeEnd('Total');
            console.groupEnd();
        }
    };

    /**
     * Retrieves the range of a table from exported worksheet.
     *
     * @param blob Worksheet blob exported by export engine
     * @param excelContext Reference to Excel Context used by Excel API functions
     */
    private async getExportedWorksheetTableRange(blob: any, excelContext: Excel.RequestContext): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const workbook = read(reader.result, { type: 'binary' });

                    const sheets = excelContext.workbook.worksheets;
                    sheets.load("items/name");

                    await excelContext.sync();

                    const exportedWorksheet = Object.values(workbook.Sheets)[0];
                    const exportedWorksheetTableRange = exportedWorksheet['!ref'];

                    resolve(exportedWorksheetTableRange);
                } catch (err) {
                    reject(err);
                }

            };
            reader.readAsBinaryString(blob);
        });
    }
}

const stepExportExcelWorkBook = new StepExportExcelWorkBook();
export default stepExportExcelWorkBook;
