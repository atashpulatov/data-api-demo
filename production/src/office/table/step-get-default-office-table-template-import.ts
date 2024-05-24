import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeTableCreate from './office-table-create';

class StepGetDefaultOfficeTableTemplateImport {
    /**
     * Creates default Excel table template during import workflow
     *
     * Communicates with object reducer and calls officeTableCreate.createDefaultOfficeTable.
     *
     * This function is subscribed as one of the operation steps with the key GET_DEFAULT_OFFICE_TABLE_TEMPLATE_IMPORT,
     * therefore should be called only via operation bus.
     *
     * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
     * @param operationData.instanceDefinition Object containing information about MSTR object
     * @param operationData.excelContext Reference to Excel Context used by Excel API functions
     * @param operationData.startCell Address of the cell in Excel spreadsheet
     * @param operationData.insertNewWorksheet Specify if new worksheet has to be created
     */
    async getDefaultOfficeTableTemplateImport(objectData: ObjectData, operationData: OperationData): Promise<void> {
        try {
            console.time('Create default table template - import');
            const {
                objectWorkingId,
                excelContext,
                instanceDefinition,
                startCell: selectedCell,
                insertNewWorksheet,
            } = operationData;

            const { officeTable, bindId, tableName, worksheet, startCell, groupData } =
                await officeTableCreate.createDefaultOfficeTable({
                    excelContext,
                    instanceDefinition,
                    startCell: selectedCell,
                    insertNewWorksheet,
                    pageByData: objectData.pageByData,
                    objectData,
                });

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
            operationStepDispatcher.completeGetDefaultOfficeTableTemplateImport(objectWorkingId);
        } catch (error) {
            console.error(error);
            operationErrorHandler.handleOperationError(objectData, operationData, error);
        } finally {
            console.timeEnd('Create default table template - import');
        }
    }
}

const stepGetDefaultOfficeTableTemplateImport = new StepGetDefaultOfficeTableTemplateImport();
export default stepGetDefaultOfficeTableTemplateImport;
