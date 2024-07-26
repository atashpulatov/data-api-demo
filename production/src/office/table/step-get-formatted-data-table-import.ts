import { officeApiHelper } from '../api/office-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeTableCreate from './office-table-create';
import { ErrorType } from '../../error/constants';

class StepGetFormattedDataTableImport {
    /**
     * Creates an office table during import workflow. Similar to StepGetOfficeTableImport.getOfficeTableImport() step
     * except that redundant operations with the relation to formatted data table were eliminated.
     *
     * Communicates with object reducer and calls officeTableCreate.createFormattedDataOfficeTable.
     *
     * This function is subscribed as one of the operation steps with the key GET_FORMATTED_DATA_TABLE_IMPORT,
     * therefore should be called only via operation bus.
     *
     * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
     * @param operationData.instanceDefinition Object containing information about MSTR object
     * @param operationData.excelContext Reference to Excel Context used by Excel API functions
     * @param operationData.startCell Address of the cell in Excel spreadsheet
     * @param operationData.insertNewWorksheet Specify if new worksheet has to be created
     */
    async getFormattedDataTableImport(objectData: ObjectData, operationData: OperationData): Promise<void> {
        try {
            console.time('Create formatted data table - import');
            const {
                objectWorkingId,
                excelContext,
                instanceDefinition,
                startCell: selectedCell,
                insertNewWorksheet,
                formattedData: { dimensions: rangeDimensions },
            } = operationData;

            const { officeTable, bindId, tableName, worksheet, startCell, groupData, dimensions } =
                await officeTableCreate.createFormattedDataOfficeTable({
                    excelContext,
                    instanceDefinition,
                    startCell: selectedCell,
                    rangeDimensions,
                    insertNewWorksheet,
                    pageByData: objectData.pageByData,
                    objectData,
                    operationData,
                });

            instanceDefinition.rows = dimensions.rows;
            instanceDefinition.columns = dimensions.columns;

            const updatedOperation = {
                objectWorkingId,
                officeTable,
                shouldFormat: true,
                tableChanged: false,
                instanceDefinition,
                startCell,
            };

            const updatedObject: Partial<ObjectData> = {
                objectWorkingId,
                tableName,
                bindId,
                startCell,
                worksheet,
                groupData,
                importType: objectData.importType,
            };

            operationStepDispatcher.updateOperation(updatedOperation);
            operationStepDispatcher.updateObject(updatedObject);
            operationStepDispatcher.completeGetFormattedDataTableImport(objectWorkingId);
        } catch (error) {
            if (error.type !== ErrorType.OVERLAPPING_TABLES_ERR) {
                try {
                    const { excelContext, formattedData } = operationData;
                    const sourceWorksheet = officeApiHelper.getExcelSheetById(excelContext, formattedData?.sourceWorksheetId);

                    // Remove exported worksheet from current workbook on error
                    if (sourceWorksheet) {
                        sourceWorksheet.delete();
                        await operationData.excelContext.sync();
                    }
                } catch (ignoredError) {
                    // Ignore the 'ignoredError' error and handle the original 'error' below
                    console.error(ignoredError)
                }

            }
            console.error(error);
            operationErrorHandler.handleOperationError(objectData, operationData, error);
        } finally {
            console.timeEnd('Create formatted data table - import');
        }
    }
}

const stepGetFormattedDataTableImport = new StepGetFormattedDataTableImport();
export default stepGetFormattedDataTableImport;
