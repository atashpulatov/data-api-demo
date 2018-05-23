
export default function displayReport(reportConvertedData) {
    Excel.run(function(context) {
        let sheet = context.workbook.worksheets.getActiveWorksheet();
        let expensesTable = sheet.tables.add('A1:D1', true /* hasHeaders */);
        expensesTable.name = 'ExpensesTable';

        expensesTable.getHeaderRowRange().values = [reportConvertedData.headers];

        expensesTable.rows.add(null /* add rows to the end of the table */, [
            reportConvertedData.rows,
        ]);

        if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
            sheet.getUsedRange().format.autofitColumns();
            sheet.getUsedRange().format.autofitRows();
        }

        sheet.activate();

        return context.sync();
    });
}
