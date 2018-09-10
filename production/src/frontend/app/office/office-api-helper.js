import { IncorrectInputTypeError } from './incorrect-input-type';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { globalDefinitions } from '../global-definitions';

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
        console.log('error: ' + error);
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

    onBindingObjectClick = (event) => {
        Excel.run((ctx) => {
            const table = ctx.workbook.bindings
                .getItem(event).getTable()
                .getRange();
            table.select();
            return ctx.sync();
        });
    };

    loadExistingReportBindingsExcel = async () => {
        Excel.run(async (context) => {
            const workbook = context.workbook;
            workbook.load('bindings');
            const bindings = workbook.bindings;
            await context.sync();
            bindings.load('items');
            await context.sync();
            const reportArray = this._excelBindingsToStore(bindings.items);
            reduxStore.dispatch({
                type: officeProperties.actions.loadAllReports,
                reportArray,
            });
        });
    };

    _excelBindingsToStore(bindings) {
        console.log('converting bindings');
        console.log(bindings);
        const bindingArrayLength = bindings.length;
        const reportArray = [];
        for (let i = 0; i < bindingArrayLength; i++) {
            const splittedBind = bindings[i].id.split(separator);
            console.log(splittedBind);
            reportArray.push({
                id: splittedBind[2],
                name: splittedBind[0],
                bindId: bindings[i].id,
            });
        }
        return reportArray;
    }
}

export const officeApiHelper = new OfficeApiHelper();

// export const officeApiHelper = {
//     handleOfficeApiException,
//     getRange,
//     lettersToNumber,
//     onBindingObjectClick,
//     loadExistingReportBindingsExcel,
//     logError,
// };
