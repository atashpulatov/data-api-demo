import { IncorrectInputTypeError } from './incorrect-input-type';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { globalDefinitions } from '../global-definitions';
import { OfficeError } from './office-error';
import { OfficeBindingError } from './office-error';
import { officeStoreService } from './store/office-store-service';

const separator = globalDefinitions.reportBindingIdSeparator;

const ALPHABET_RANGE_START = 1;
const ALPHABET_RANGE_END = 26;
const ASCII_CAPITAL_LETTER_INDEX = 65;

class OfficeApiHelper {

    getRange(headerCount, startCell) {
        if (!Number.isInteger(headerCount)) {
            throw new IncorrectInputTypeError();
        }
        let startCellArray = startCell.split(/(\d+)/);
        headerCount += parseInt(this.lettersToNumber(startCellArray[0]) - 1);
        let endRange = '';
        for (let firstNumber = ALPHABET_RANGE_START,
            secondNumber = ALPHABET_RANGE_END;
            (headerCount -= firstNumber) >= 0;
            firstNumber = secondNumber, secondNumber *= ALPHABET_RANGE_END) {
            endRange = String.fromCharCode(parseInt(
                (headerCount % secondNumber) / firstNumber)
                + ASCII_CAPITAL_LETTER_INDEX)
                + endRange;
        }
        return `${startCell}:${endRange}${startCellArray[1]}`;
    }

    handleOfficeApiException(error) {
        console.error('error: ' + error);
        if (error instanceof OfficeExtension.Error) {
            console.error('Debug info: ' + JSON.stringify(error.debugInfo));
        } else {
            throw error;
        }
    }

    lettersToNumber(letters) {
        if (!letters.match(/^[A-Z]*[A-Z]$/)) {
            throw new IncorrectInputTypeError();
        }
        return letters.split('').reduce((r, a) =>
            r * ALPHABET_RANGE_END + parseInt(a, 36) - 9, 0);
    }

    onBindingObjectClick = async (bindingId) => {
        const excelContext = await this.getExcelContext();
        const tableRange = this.getBindingRange(excelContext, bindingId);
        tableRange.select();
        return await excelContext.sync();
    };

    getBindingRange(context, bindingId) {
        return context.workbook.bindings
            .getItem(bindingId).getTable()
            .getRange();
    }

    async getExcelContext() {
        return await Excel.run(async (context) => {
            return context;
        });
    }

    async getOfficeContext() {
        return await Office.context;
    }

    async findAvailableOfficeTableId(reportName, context) {
        let nameExists = true;
        let tableIncrement = 0;
        const tableName = reportName.replace(new RegExp('[^a-zA-Z]', 'g'), 'X');
        const tableCollection = context.workbook.tables;
        tableCollection.load();
        await context.sync();
        while (nameExists) {
            let existingTable = await tableCollection.getItemOrNullObject(`${tableName}${tableIncrement}`);
            existingTable.load();
            await context.sync();
            if (!existingTable.isNull) {
                tableIncrement++;
            } else {
                nameExists = false;
            }
        }
        return tableName + tableIncrement;
    }

    loadExistingReportBindingsExcel = async () => {
        const reportArray = await officeStoreService._getReportProperties();
        reduxStore.dispatch({
            type: officeProperties.actions.loadAllReports,
            reportArray,
        });
    };

    getCurrentMstrContext() {
        const envUrl = reduxStore.getState().sessionReducer.envUrl;
        const projectId = reduxStore.getState().historyReducer.project.projectId;
        const username = reduxStore.getState().sessionReducer.username;
        return { envUrl, projectId, username };
    }

    formatTable(sheet) {
        if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
            sheet.getUsedRange().format.autofitColumns();
            sheet.getUsedRange().format.autofitRows();
        } else {
            message.warning(`Unable to format table.`);
        }
    }

    async getSelectedCell(context) {
        // TODO: handle more than one cell selected
        const selectedRangeStart = context.workbook.getSelectedRange();
        selectedRangeStart.load(officeProperties.officeAddress);
        await context.sync();
        const startCell = selectedRangeStart.address.split('!')[1].split(':')[0];
        return startCell;
    }

    async bindNamedItem(namedItem, bindingId) {
        return await Office.context.document.bindings.addFromNamedItemAsync(
            namedItem, 'table', { id: bindingId }, (result) => {
                if (result.status == 'succeeded') {
                    console.log('Added new binding with type: ' + result.value.type + ' and id: ' + result.value.id);
                } else {
                    console.error('Error: ' + result.error.message);
                }
            });
    }
}

export const officeApiHelper = new OfficeApiHelper();
