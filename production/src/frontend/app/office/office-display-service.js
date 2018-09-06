import { officeApiHelper } from './office-api-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { officeConverterService } from './office-converter-service';

class OfficeDisplayService {
    constructor() {
        this.insertDataIntoExcel = this.insertDataIntoExcel.bind(this);
        this.printObject = this.printObject.bind(this);
    }

    async printObject(objectId) {
        let jsonData = await mstrObjectRestService.getObjectContent(objectId);
        let convertedReport = officeConverterService
            .getConvertedTable(jsonData);
        convertedReport.id = jsonData.id;
        const result = await this.insertDataIntoExcel(convertedReport);
        await this._bindNamedItem(
            result.tableName,
            convertedReport.id,
            result.startCell);
        displayAllBindingNames();
    }

    async insertDataIntoExcel(reportConvertedData) {
        const hasHeaders = true;
        return Excel.run(async (context) => {
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            const startCell = await this._getSelectedCell(context);
            const range = officeApiHelper
                .getRange(reportConvertedData.headers.length, startCell);
            const mstrTable = sheet.tables.add(range, hasHeaders);
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

    _displayAllBindingNames() {
        Office.context.document.bindings.getAllAsync((asyncResult) => {
            var bindingString = '';
            for (var i in asyncResult.value) {
                bindingString += asyncResult.value[i].id + '\n';
            }
            message.info(bindingString);
            console.log('Existing bindings: ' + bindingString);
        });
    }

    async _bindNamedItem(tableName, tableId, startCell) {
        const bindingId = `${startCell}${tableId}`;
        Office.context.document.bindings.addFromNamedItemAsync(
            tableName, 'table', { id: bindingId }, (asyncResult) => {
                console.log('adding eventHandler');
                const selectString = `bindings#${bindingId}`;
                console.log(selectString);
                Office.select(selectString,
                    function onError() {
                        console.log('error on attaching event handler');
                    }).addHandlerAsync(Office.EventType.BindingDataChanged,
                        (eventArgs) => {
                            officeApiHelper.onBindingDataChanged(eventArgs);
                        });
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
        const selectedRangeStart = context.workbook.getSelectedRange();
        selectedRangeStart.load('address');
        await context.sync();
        const startCell = selectedRangeStart.address.split('!')[1];
        return startCell;
    }
}

export const officeDisplayService = new OfficeDisplayService();
