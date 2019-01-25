import { officeApiHelper } from './office-api-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { officeConverterService } from './office-converter-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { globalDefinitions } from '../global-definitions';
import { sessionHelper } from '../storage/session-helper';
import { officeStoreService } from './store/office-store-service';

const separator = globalDefinitions.reportBindingIdSeparator;

class OfficeDisplayService {
    constructor() {
        this.insertDataIntoExcel = this._insertDataIntoExcel.bind(this);
        this.printObject = this.printObject.bind(this);
        this.removeReportFromExcel = this.removeReportFromExcel.bind(this);
        this.refreshReport = this.refreshReport.bind(this);
    }

    async printObject(objectId, startCell, officeTableId, bindingId, body) {
        sessionHelper.enableLoading();
        const excelContext = await officeApiHelper.getExcelContext();
        if (!startCell) {
            startCell = await officeApiHelper.getSelectedCell(excelContext);
        }
        const jsonData = await mstrObjectRestService.getObjectContent(objectId, body);
        if (jsonData && jsonData.result.data.root == null){
            //report returned no data
            sessionHelper.disableLoading();
            return {success: false, message: 'No data returned by the report: ' + jsonData.name};
        }
        const convertedReport = officeConverterService
            .getConvertedTable(jsonData);
        const newOfficeTableId = officeTableId || await officeApiHelper.findAvailableOfficeTableId(convertedReport.name, excelContext);
        await this._insertDataIntoExcel(convertedReport, excelContext, startCell, newOfficeTableId);
        const { envUrl, projectId } = officeApiHelper.getCurrentMstrContext();
        bindingId = bindingId || newOfficeTableId;
        await excelContext.sync();
        officeApiHelper.bindNamedItem(newOfficeTableId, bindingId);
        if (!officeTableId) {
            await this.addReportToStore({
                id: convertedReport.id,
                name: convertedReport.name,
                bindId: bindingId,
                tableId: newOfficeTableId,
                projectId,
                envUrl,                
            });
        }
        sessionHelper.disableLoading();
        return {success: true, message: 'Loaded report: ' + jsonData.name};
    }

    // TODO: move it to api helper?
    addReportToStore(report) {
        reduxStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: {
                id: report.id,
                name: report.name,
                bindId: report.bindId,
                tableId: report.tableId,
                projectId: report.projectId,
                envUrl: report.envUrl,
            },
        });
        officeStoreService.preserveReport(report);
    }

    async removeReportFromExcel(bindingId, isRefresh) {
        const officeContext = await officeApiHelper.getOfficeContext();
        await officeContext.document.bindings.releaseByIdAsync(bindingId, (asyncResult) => {
            console.log('released binding');
        });
        const excelContext = await officeApiHelper.getExcelContext();
        const tableObject = excelContext.workbook.tables.getItem(bindingId);
        await tableObject.delete();
        await excelContext.sync();
        if (!isRefresh) {
            reduxStore.dispatch({
                type: officeProperties.actions.removeReport,
                reportBindId: bindingId,
            });
            officeStoreService.deleteReport(bindingId);
        }
    }

    // FIXME: report after refresh goes to bottom of list
    // TODO: we could filter data to display options related to current envUrl
    async refreshReport(bindingId) {
        const isRefresh = true;
        const excelContext = await officeApiHelper.getExcelContext();
        const range = officeApiHelper.getBindingRange(excelContext, bindingId);
        range.load();
        await excelContext.sync();
        const startCell = range.address.split('!')[1].split(':')[0];
        const refreshReport = officeStoreService.getReportFromProperties(bindingId);
        await this.removeReportFromExcel(bindingId, isRefresh);
        await this.printObject(refreshReport.id, startCell, bindingId, bindingId);
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
        officeApiHelper.formatTable(sheet);
        sheet.activate();
        // tableBinding.onDataChanged.add(officeApiHelper.onBindingDataChanged);
        return mstrTable;
    }

    _pushRows(reportConvertedData, mstrTable) {
        const dataRows = reportConvertedData.rows
            .map((item) => reportConvertedData.headers
                .map((header) => item[header]));
        mstrTable.rows.add(null, dataRows);
    }
}

export const officeDisplayService = new OfficeDisplayService();
