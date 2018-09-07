import { officeApiHelper } from './office-api-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { officeConverterService } from './office-converter-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { message } from 'antd';

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
        const bindingId = await this._bindNamedItem(
            result.tableName,
            convertedReport.id,
            result.startCell);
        reduxStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: {
                id: convertedReport.id,
                name: jsonData.name,
                bindId: bindingId,
            },
        });
        message.info(`Loaded document: ${jsonData.name}`);
        this._displayAllBindingNames();
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

    async _displayAllBindingNames() {
        console.log('trying to show existing bindings');
        await Office.context.document.bindings.getAllAsync((asyncResult) => {
            const bindingArray = asyncResult.value;
            var bindingString = '';
            for (var i in bindingArray) {
                bindingString += bindingArray[i].id + '\n';
                console.log(bindingArray[i]);
            }
            console.log('Existing bindings: ' + bindingString);
        });
    }

    async _bindNamedItem(tableName, tableId, startCell) {
        const bindingId = `${startCell}${tableId}`;
        await Office.context.document.bindings.addFromNamedItemAsync(
            tableName, 'table', { id: bindingId, tableName: tableName }, async (asyncResult) => {
                console.log('adding eventHandler');
                console.log(asyncResult);
                const selectString = `bindings#${asyncResult.value.id}`;
                console.log(selectString);
                const bindingObject = await Office.select(selectString,
                    function onError() {
                        console.log('error on attaching event handler');
                    });
                const attachHandlerResult = await bindingObject.addHandlerAsync(Office.EventType.BindingDataChanged,
                    (eventArgs) => {
                        officeApiHelper.onBindingDataChanged(eventArgs);
                    });
                console.log(attachHandlerResult);
                return asyncResult.value;
            });
        return bindingId;
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
