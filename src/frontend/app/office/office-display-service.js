import officeApiHelpers from './office-api-helpers.js';

export default function displayReport(reportConvertedData) {
    Excel.run(function (context) {
        let sheet = context.workbook.worksheets.getActiveWorksheet();
        let range = getRange(reportConvertedData.headers.length);
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
    }).catch(function (error) {
        console.log('error: ' + error);
        if (error instanceof OfficeExtension.Error) {
            console.log('Debug info: ' + JSON.stringify(error.debugInfo));
        }
    });
}

function getRange(headerCount) {
    let endRange = '';
        for (let aNumber = 1, bNumber = 26;
            (headerCount -= aNumber) >= 0;
            aNumber = bNumber, bNumber *= 26) {
          endRange = String.fromCharCode(parseInt(
              (headerCount % bNumber) / aNumber) + 65)
              + endRange;
        }
    return 'A1:'.concat(endRange).concat('1');
}
