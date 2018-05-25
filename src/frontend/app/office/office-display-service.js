import officeApiHelpers from './office-api-helpers.js';

export default function displayReport(reportConvertedData) {
    Excel.run(function (context) {
        let sheet = context.workbook.worksheets.getActiveWorksheet();
        let range = getRange(reportConvertedData.headers.length - 1);
        let mstrTable = sheet.tables.add(range, true /* hasHeaders */);
        // mstrTable.name = 'ExpensesTable';

        mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];

        let rows = reportConvertedData.rows
            .map((item) => reportConvertedData.headers
                .map((header) => item[header]));

        mstrTable.rows.add(null, rows);

        if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
            sheet.getUsedRange().format.autofitColumns();
            sheet.getUsedRange().format.autofitRows();
        }

        sheet.activate();

        return context.sync();
    }).catch(function (error) {
        console.log('error: ' + error);
        if (error instanceof OfficeExtension.Error) {
            console.log('Debug info: ' + JSON.stringify(error.debugInfo));
        }
    });
}

function getRange(headerCount) { // TODO: Right now we are supporting up to 25 columns
    let endRange = String.fromCharCode(65 + headerCount);
    return 'A1:'.concat(endRange).concat('1');
}
