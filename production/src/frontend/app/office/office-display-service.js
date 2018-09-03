import { officeApiHelper } from './office-api-helper';

class OfficeDisplayService {
    async displayReport(reportConvertedData) {
        const hasHeaders = true;
        await Excel.run(async (context) => {
            let sheet = context.workbook.worksheets.getActiveWorksheet();

            let startCell = await this._getSelectedCell(context);
            let range = officeApiHelper
                .getRange(reportConvertedData.headers.length, startCell);
            let mstrTable = sheet.tables.add(range, hasHeaders);
            mstrTable.name = reportConvertedData.name;

            mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];
            this._pushRows(reportConvertedData, mstrTable);

            this._formatTable(sheet);

            sheet.activate();
            return context.sync();
        }).catch((error) => officeApiHelper.handleOfficeApiException(error));
    }

    bindNamedItem(context, tableName, tableId) {
        Office.context.document.bindings.addFromNamedItemAsync(
            tableName, 'table', { id: tableId }, function (result) {
                if (result.status == 'succeeded') {
                    console.log('Added new binding with type: ' + result.value.type + ' and id: ' + result.value.id);
                } else {
                    console.error('Error: ' + result.error.message);
                }
            });
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
