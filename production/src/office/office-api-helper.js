import { IncorrectInputTypeError } from './incorrect-input-type';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { globalDefinitions } from '../global-definitions';
import { OfficeError } from './office-error';
import { OfficeBindingError } from './office-error';

const separator = globalDefinitions.reportBindingIdSeparator;

const ALPHABET_RANGE_START = 1;
const ALPHABET_RANGE_END = 26;
const ASCII_CAPITAL_LETTER_INDEX = 65;

class OfficeApiHelper {

    getRange(headerCount, startCell) {
        if (!Number.isInteger(headerCount)) {
            throw new IncorrectInputTypeError();
        }
        console.log(startCell);
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
        const context = await this.getOfficeContext();
        const tableRange = this.getBindingRange(context, bindingId);
        tableRange.select();
        return await context.sync();
    };

    getBindingRange(context, bindingId) {
        return context.workbook.bindings
            .getItem(bindingId).getTable()
            .getRange();
    }

    async getOfficeContext() {
        return await Excel.run(async (context) => {
            return context;
        });
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

    createBindingId(reportConvertedData, tableName, projectId, envUrl, separator = '_') {
        if (!reportConvertedData) {
            throw new OfficeBindingError('Missing reportConvertedData');
        }
        if (!tableName) {
            throw new OfficeBindingError('Missing tableName');
        }
        if (!projectId) {
            throw new OfficeBindingError('Missing projectId');
        }
        if (!envUrl) {
            throw new OfficeBindingError('Missing envUrl');
        }
        return reportConvertedData.name
            + separator + tableName
            + separator + reportConvertedData.id
            + separator + projectId
            + separator + envUrl;
    }

    loadExistingReportBindingsExcel = async () => {
        const context = await this.getOfficeContext();
        const bindingItems = await this._getBindingsFromWorkbook(context);
        const reportArray = this._excelBindingsToStore(bindingItems);
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

    _getBindingsFromWorkbook = async (context) => {
        const workbook = context.workbook;
        workbook.load(officeProperties.workbookBindings);
        const bindings = workbook.bindings;
        await context.sync();
        bindings.load(officeProperties.bindingItems);
        await context.sync();
        return bindings.items;
    }

    _excelBindingsToStore(bindings) {
        if (!bindings) {
            throw new OfficeError('Bindings should not be undefined!');
        }
        if (!(bindings instanceof Array)) {
            throw new OfficeError('Bindings must be of Array type!');
        }
        const bindingArrayLength = bindings.length;
        const reportArray = [];
        for (let i = 0; i < bindingArrayLength; i++) {
            const splittedBind = bindings[i].id.split(separator);
            reportArray.push({
                id: splittedBind[2],
                name: splittedBind[0],
                bindId: bindings[i].id,
                projectId: splittedBind[3],
                envUrl: splittedBind[4],
            });
        }
        return reportArray;
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
