import officeApiHelpers from './office-api-helpers.js';

export default function displayReport(reportConvertedData) {
    Excel.run( async function(context) {
        let sheet = context.workbook.worksheets.getActiveWorksheet();

        let selectedRangeStart = context.workbook.getSelectedRange();
        selectedRangeStart.load('address');
        await context.sync();

        let startCell = selectedRangeStart.address.split('!')[1];
        let range = getRange(reportConvertedData.headers.length, startCell);
        let mstrTable = sheet.tables.add(range, true /* hasHeaders */);
        // mstrTable.name = 'ExpensesTable';

        mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];

        let dataRows = reportConvertedData.rows
            .map((item) => reportConvertedData.headers
                .map((header) => item[header]));

        mstrTable.rows.add(null, dataRows);

        if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
            sheet.getUsedRange().format.autofitColumns();
            sheet.getUsedRange().format.autofitRows();
        }

        sheet.activate();

        return context.sync();
    }).catch(function(error) {
        console.log('error: ' + error);
        if (error instanceof OfficeExtension.Error) {
            console.log('Debug info: ' + JSON.stringify(error.debugInfo));
        }
    });
}

function lettersToNumber(letters) {
    return letters.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0);
}

function getRange(headerCount, startCell) {
    let startCellArray = startCell.split(/(\d+)/);
    headerCount += parseInt(lettersToNumber(startCellArray[0]) - 1);
    let endRange = '';
    for (let aNumber = 1, bNumber = 26;
        (headerCount -= aNumber) >= 0;
        aNumber = bNumber, bNumber *= 26) {
        endRange = String.fromCharCode(parseInt(
            (headerCount % bNumber) / aNumber) + 65)
            + endRange;
    }
    return startCell.concat(':').concat(endRange).concat(startCellArray[1]);
}
