import { officeApiHelper } from './office-api-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { officeConverterService } from './office-converter-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { officeStoreService } from './store/office-store-service';
import { errorService } from '../error/error-handler';

class OfficeDisplayService {
    constructor() {
        this.insertDataIntoExcel = this._insertDataIntoExcel.bind(this);
        this.printObject = this.printObject.bind(this);
        this.removeReportFromExcel = this.removeReportFromExcel.bind(this);
        this.refreshReport = this.refreshReport.bind(this);
    }

    printObject = async (objectId, startCell, officeTableId, bindingId, body) => {
        try {
            const excelContext = await officeApiHelper.getExcelContext();
            if (!startCell) {
                startCell = await officeApiHelper.getSelectedCell(excelContext);
            }
            const jsonData = await mstrObjectRestService.getObjectContent(objectId, body);
            const convertedReport = officeConverterService
                .getConvertedTable(jsonData);
            const newOfficeTableId = officeTableId || await officeApiHelper.findAvailableOfficeTableId(excelContext);
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
        } catch (error) {
            errorService.errorOfficeFactory(error);
        }
    }

    // TODO: move it to api helper?
    addReportToStore = (report) => {
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

    removeReportFromExcel = async (bindingId, isRefresh) => {
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

    // TODO: we could filter data to display options related to current envUrl
    refreshReport = async (bindingId) => {
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

    _insertDataIntoExcel = async (reportConvertedData, context, startCell, tableName) => {
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

    _pushRows = (reportConvertedData, mstrTable) => {
        const dataRows = reportConvertedData.rows
            .map((item) => reportConvertedData.headers
                .map((header) => item[header]));
        mstrTable.rows.add(null, dataRows);
    }
}

export const officeDisplayService = new OfficeDisplayService();
