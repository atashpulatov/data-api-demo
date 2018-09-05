import { officeApiHelper } from './office-api-helper';

class OfficeDisplayService {
    async displayReport(reportConvertedData) {
        const hasHeaders = true;
        return Excel.run(async (context) => {
            let sheet = context.workbook.worksheets.getActiveWorksheet();

            let startCell = await this._getSelectedCell(context);
            let range = officeApiHelper
                .getRange(reportConvertedData.headers.length, startCell);
            let mstrTable = sheet.tables.add(range, hasHeaders);
            const tableName = reportConvertedData.name + startCell;
            mstrTable.name = tableName;

            mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];
            this._pushRows(reportConvertedData, mstrTable);

            this._formatTable(sheet);

            sheet.activate();
            context.sync();
            return {
                startCell,
                tableName,
            };
        }).catch((error) => officeApiHelper.handleOfficeApiException(error));
    }

    _formatTable(sheet) {
        if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
            sheet.getUsedRange().format.autofitColumns();
            sheet.getUsedRange().format.autofitRows();
        }
    }

    _pushRows(reportConvertedData, mstrTable) {
        let dataRows = reportConvertedData.rows
            .map((item) => reportConvertedData.headers
                .map((header) => item[header]));
        mstrTable.rows.add(null, dataRows);
    }

    async _getSelectedCell(context) {
        // TODO: handle more than one cell selected
        let selectedRangeStart = context.workbook.getSelectedRange();
        selectedRangeStart.load('address');
        await context.sync();
        let startCell = selectedRangeStart.address.split('!')[1];
        return startCell;
    }
}

export const officeDisplayService = new OfficeDisplayService();
