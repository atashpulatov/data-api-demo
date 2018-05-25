import officeApiHelpers from './office-api-helpers.js';

export default function displayReport(reportConvertedData) {
    Excel.run(function (context) {
        let sheet = context.workbook.worksheets.getActiveWorksheet();
        let mstrTable = sheet.tables.add('A1:D1', true /* hasHeaders */);
        //mstrTable.name = 'ExpensesTable';

        mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];

        let rows = reportConvertedData.rows.map((item) => {
                let row = [];
                reportConvertedData.headers.forEach((header) => {
                    row.push(item[header]);
                });
                return row;
        });
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
