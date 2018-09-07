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
        reduxStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: {
                id: result.id,
                name: result.name,
                bindId: result.bindingId,
            },
        });
        message.info(`Loaded document: ${result.name}`);
    }

    async insertDataIntoExcel(reportConvertedData) {
        const hasHeaders = true;
        const { id, name } = reportConvertedData;
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

            const bindingId = `${startCell}${reportConvertedData.id}`;
            const tableBinding = context.workbook.bindings.add(mstrTable.getRange(), 'Table', bindingId);
            console.log(tableBinding);
            // tableBinding.onDataChanged.add(officeApiHelper.onBindingDataChanged);

            sheet.activate();
            context.sync();
            return {
                id,
                name,
                bindingId,
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
        const selectedRangeStart = context.workbook.getSelectedRange();
        selectedRangeStart.load('address');
        await context.sync();
        const startCell = selectedRangeStart.address.split('!')[1];
        return startCell;
    }
}

export const officeDisplayService = new OfficeDisplayService();
