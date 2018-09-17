import { officeApiHelper } from './office-api-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { officeConverterService } from './office-converter-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { message } from 'antd';
import { globalDefinitions } from '../global-definitions';
import { sessionHelper } from '../storage/session-helper';

const separator = globalDefinitions.reportBindingIdSeparator;

class OfficeDisplayService {
    constructor() {
        this.insertDataIntoExcel = this._insertDataIntoExcel.bind(this);
        this.printObject = this.printObject.bind(this);
        this.removeReportFromExcel = this.removeReportFromExcel.bind(this);
        this.refreshReport = this.refreshReport.bind(this);
    }

    async printObject(objectId, startCell) {
        sessionHelper.enableLoading();
        const context = await officeApiHelper.getOfficeContext();
        if (!startCell) {
            startCell = await this._getSelectedCell(context);
        }
        let jsonData = await mstrObjectRestService.getObjectContent(objectId);
        let convertedReport = officeConverterService
            .getConvertedTable(jsonData);
        const tableName = await officeApiHelper.findAvailableTableName(convertedReport.name, context);
        const mstrTable = await this._insertDataIntoExcel(convertedReport, context, startCell, tableName);
        const { envUrl, projectId } = officeApiHelper.getCurrentMstrContext();
        const bindingId = officeApiHelper.createBindingId(convertedReport, tableName, projectId, envUrl, separator);
        context.workbook.bindings.add(mstrTable.getRange(), 'Table', bindingId);
        this.addReportToStore({
            id: convertedReport.id,
            name: convertedReport.name,
            bindId: bindingId,
            envUrl,
            projectId,
        });
        await context.sync();
        sessionHelper.disableLoading();
    }

    addReportToStore(report) {
        reduxStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: {
                id: report.id,
                name: report.name,
                bindId: report.bindId,
                projectId: report.projectId,
                envUrl: report.envUrl,
            },
        });
    }

    async removeReportFromExcel(bindingId) {
        const context = await officeApiHelper.getOfficeContext();
        const range = officeApiHelper.getBindingRange(context, bindingId);
        const binding = await context.workbook.bindings
            .getItem(bindingId);
        binding.delete();
        range.clear('All');
        reduxStore.dispatch({
            type: officeProperties.actions.removeReport,
            reportBindId: bindingId,
        });
        return await context.sync();
    }

    async refreshReport(bindingId) {
        let context = await officeApiHelper.getOfficeContext();
        let range = officeApiHelper.getBindingRange(context, bindingId);
        range.load();
        await context.sync();
        const startCell = range.address.split('!')[1].split(':')[0];
        const bindIdItems = bindingId.split(globalDefinitions.reportBindingIdSeparator);
        await this.removeReportFromExcel(bindingId);
        await this.printObject(bindIdItems[2], startCell);
    }

    async _insertDataIntoExcel(reportConvertedData, context, startCell, tableName) {
        const hasHeaders = true;
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = officeApiHelper
            .getRange(reportConvertedData.headers.length, startCell);
        const mstrTable = sheet.tables.add(range, hasHeaders);
        mstrTable.name = tableName;
        mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];
        this._pushRows(reportConvertedData, mstrTable);
        this._formatTable(sheet);
        sheet.activate();
        // tableBinding.onDataChanged.add(officeApiHelper.onBindingDataChanged);
        return mstrTable;
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
