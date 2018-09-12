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
        this.addReportToStore(result);
        message.info(`Loaded document: ${result.name}`);
    }

    addReportToStore(result) {
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
        const context = await officeApiHelper._getOfficeContext();
        const startCell = await this._getSelectedCell(context);
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = officeApiHelper
            .getRange(reportConvertedData.headers.length, startCell);
        const mstrTable = sheet.tables.add(range, hasHeaders);
        mstrTable.name = reportConvertedData.name + startCell;
        mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];
        this._pushRows(reportConvertedData, mstrTable);
        this._formatTable(sheet);

        const bindingId = this._createBindingId(reportConvertedData, startCell, separator);
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
    }

    _createBindingId(reportConvertedData, startCell, separator = '_') {
        return reportConvertedData.name
            + separator + startCell
            + separator + reportConvertedData.id;
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
