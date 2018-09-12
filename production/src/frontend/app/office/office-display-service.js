import { officeApiHelper } from './office-api-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { officeConverterService } from './office-converter-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { message } from 'antd';
import { globalDefinitions } from '../global-definitions';
import { OfficeBindingError } from './office-error';

const separator = globalDefinitions.reportBindingIdSeparator;

class OfficeDisplayService {
    constructor() {
        this.insertDataIntoExcel = this._insertDataIntoExcel.bind(this);
        this.printObject = this.printObject.bind(this);
    }

    async printObject(objectId) {
        const context = await officeApiHelper._getOfficeContext();
        const startCell = await this._getSelectedCell(context);
        let jsonData = await mstrObjectRestService.getObjectContent(objectId);
        let convertedReport = officeConverterService
            .getConvertedTable(jsonData);
        const mstrTable = await this._insertDataIntoExcel(convertedReport, context, startCell);
        const bindingId = this._createBindingId(convertedReport, startCell, separator);
        context.workbook.bindings.add(mstrTable.getRange(), 'Table', bindingId);
        this.addReportToStore({
            id: convertedReport.id,
            name: convertedReport.name,
            bindId: bindingId,
        });
        await context.sync();
        message.info(`Loaded document: ${convertedReport.name}`);
    }

    addReportToStore(result) {
        reduxStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: {
                id: result.id,
                name: result.name,
                bindId: result.bindId,
            },
        });
    }

    async _insertDataIntoExcel(reportConvertedData, context, startCell) {
        const hasHeaders = true;
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = officeApiHelper
            .getRange(reportConvertedData.headers.length, startCell);
        const mstrTable = sheet.tables.add(range, hasHeaders);
        mstrTable.name = reportConvertedData.name + startCell;
        mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];
        this._pushRows(reportConvertedData, mstrTable);
        this._formatTable(sheet);
        sheet.activate();
        // tableBinding.onDataChanged.add(officeApiHelper.onBindingDataChanged);
        return mstrTable;
    }

    _createBindingId(reportConvertedData, startCell, separator = '_') {
        if (!reportConvertedData) {
            throw new OfficeBindingError('Missing reportConvertedData');
        }
        if (!startCell) {
            throw new OfficeBindingError('Missing startCell');
        }
        return reportConvertedData.name
            + separator + startCell
            + separator + reportConvertedData.id;
    }

    _formatTable(sheet) {
        if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
            sheet.getUsedRange().format.autofitColumns();
            sheet.getUsedRange().format.autofitRows();
        } else {
            message.warning(`Unable to format table.`);
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
        selectedRangeStart.load(officeProperties.officeAddress);
        await context.sync();
        const startCell = selectedRangeStart.address.split('!')[1];
        return startCell;
    }
}

export const officeDisplayService = new OfficeDisplayService();
