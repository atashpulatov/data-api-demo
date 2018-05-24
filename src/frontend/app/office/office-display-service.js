import officeApiHelpers from './office-api-helpers.js'

export default function displayReport(reportConvertedData) {
    Excel.run(function(context) {
        let sheet = context.workbook.worksheets.getActiveWorksheet();
        let mstrTable = sheet.tables.add('A1:D1', true /* hasHeaders */);
        //mstrTable.name = 'ExpensesTable';

        mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];

        mstrTable.rows.add(null /* add rows to the end of the table */,
            reportConvertedData.rows,
        );

        /* Alternatively we can use below code but it would require changing converter
                var newData = transactions.map(item =>
            [item.DATE, item.MERCHANT, item.CATEGORY, item.AMOUNT]);

            expensesTable.rows.add(null, newData);
        */

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
