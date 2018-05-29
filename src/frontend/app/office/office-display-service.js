import officeApiHelper from './office-api-helper';

export default function displayReport(reportConvertedData) {
    Excel.run((context) => {
        let sheet = context.workbook.worksheets.getActiveWorksheet();
        let range = officeApiHelper
            .getRange(reportConvertedData.headers.length);
        const hasHeaders = true;
        let mstrTable = sheet.tables.add(range, hasHeaders);
        // mstrTable.name = reportConvertedData.id;

        mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];

        let dataRows = reportConvertedData.rows
            .map((item) => reportConvertedData.headers
                .map((header) => item[header]));

        mstrTable.rows.add(null, dataRows);

        if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
            sheet.getUsedRange().format.autofitColumns();
            sheet.getUsedRange().format.autofitRows();
        }
        // Office.context.document.settings
            // .set('mstrReportId', reportConvertedData.id);

        sheet.activate();

        return context.sync();
    }).catch((error) => officeApiHelper.handleOfficeApiException(error));
}
