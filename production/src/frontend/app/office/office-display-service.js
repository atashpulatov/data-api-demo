import { officeApiHelper } from './office-api-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { officeConverterService } from './office-converter-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { message } from 'antd';
import { globalDefinitions } from '../global-definitions';

const separator = globalDefinitions.reportBindingIdSeparator;

class OfficeDisplayService {
    constructor() {
        this.insertDataIntoExcel = this._insertDataIntoExcel.bind(this);
        this.printObject = this.printObject.bind(this);
    }

    async printObject(objectId) {
        let jsonData = await mstrObjectRestService.getObjectContent(objectId);
        let convertedReport = officeConverterService
            .getConvertedTable(jsonData);
        const result = await this._insertDataIntoExcel(convertedReport);
        this._addReportToState(result);
        message.info(`Loaded document: ${result.name}`);
    }

    _addReportToState(result) {
        reduxStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: {
                id: result.id,
                name: result.name,
                bindId: result.bindingId,
            },
        });
    }

    async _insertDataIntoExcel(reportConvertedData) {
        const hasHeaders = true;
        return Excel.run(async (context) => {
            const { mstrTable, sheet, startCell } =
                await this.initializeMstrTable(context, reportConvertedData, hasHeaders);
            mstrTable.getHeaderRowRange().values =
                [reportConvertedData.headers];
            this._pushRows(reportConvertedData, mstrTable);
            this._formatTable(sheet);

            const bindingId = `${reportConvertedData.name}${separator}${startCell}${separator}${reportConvertedData.id}`;
            const tableBinding = context.workbook.bindings.add(mstrTable.getRange(), 'Table', bindingId);
            console.log(tableBinding);
            // tableBinding.onDataChanged.add(officeApiHelper.onBindingDataChanged);

            sheet.activate();
            context.sync();
            return {
                id: reportConvertedData.id,
                name: reportConvertedData.name,
                bindingId,
            };
        }).catch((error) => officeApiHelper.handleOfficeApiException(error));
    }

    async _initializeMstrTable(context, reportConvertedData, hasHeaders) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const startCell = await this._getSelectedCell(context);
        const range = officeApiHelper
            .getRange(reportConvertedData.headers.length, startCell);
        const mstrTable = sheet.tables.add(range, hasHeaders);
        const tableName = reportConvertedData.name + startCell;
        mstrTable.name = tableName;
        return { mstrTable, sheet, startCell };
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
