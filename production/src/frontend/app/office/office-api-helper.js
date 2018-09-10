import { IncorrectInputTypeError } from './incorrect-input-type';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { globalDefinitions } from '../global-definitions';

const separator = globalDefinitions.reportBindingIdSeparator;

const ALPHABET_RANGE_START = 1;
const ALPHABET_RANGE_END = 26;
const ASCII_CAPITAL_LETTER_INDEX = 65;

function getRange(headerCount, startCell) {
    if (!Number.isInteger(headerCount)) {
        throw new IncorrectInputTypeError();
    }
    let startCellArray = startCell.split(/(\d+)/);
    headerCount += parseInt(lettersToNumber(startCellArray[0]) - 1);
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

function handleOfficeApiException(error) {
    console.log('error: ' + error);
    if (error instanceof OfficeExtension.Error) {
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    }
}

function lettersToNumber(letters) {
    if (!letters.match(/^[A-Z]*[A-Z]$/)) {
        throw new IncorrectInputTypeError();
    }
    return letters.split('').reduce((r, a) =>
        r * ALPHABET_RANGE_END + parseInt(a, 36) - 9, 0);
}

// when data in the table is changed, this event will be triggered.
const onBindingDataChanged = (eventArgs) => {
    console.log('triggered change');
    Excel.run((ctx) => {
        // highlight the table in orange to indicate data has been changed.
        ctx.workbook.bindings.getItem(eventArgs.binding.id).getTable().getDataBodyRange().format.fill.color = 'Orange';
        return ctx.sync().then(() => {
            console.log('The value in this table got changed!');
        })
            .catch((error) => {
                console.log(JSON.stringify(error));
            });
    });
};

const onBindingObjectClick = (event) => {
    Excel.run((ctx) => {
        const table = ctx.workbook.bindings
            .getItem(event).getTable()
            .getRange();
        table.select();
        return ctx.sync();
    });
};

const loadExistingReportBindingsExcel = async () => {
    Excel.run(async (context) => {
        const workbook = context.workbook;
        workbook.load('bindings');
        const bindings = workbook.bindings;
        await context.sync();
        bindings.load('items');
        await context.sync();
        const bindingArrayLength = bindings.items.length;
        const reportArray = _excelBindingsToStore(bindingArrayLength, bindings, reportArray);
        reduxStore.dispatch({
            type: officeProperties.actions.loadAllReports,
            reportArray,
        });
    });
};

function _excelBindingsToStore(bindingArrayLength, bindings) {
    const reportArray = [];
    for (let i = 0; i < bindingArrayLength; i++) {
        const splittedBind = bindings.items[i].id.split(separator);
        console.log(splittedBind);
        reportArray.push({
            id: splittedBind[2],
            name: splittedBind[0],
            bindId: bindings.items[i].id,
        });
    }
    return reportArray;
}

export const officeApiHelper = {
    handleOfficeApiException,
    getRange,
    lettersToNumber,
    onBindingDataChanged,
    onBindingObjectClick,
    loadExistingReportBindingsExcel,
};
