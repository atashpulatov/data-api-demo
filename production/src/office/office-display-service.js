import { officeApiHelper } from './office-api-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { officeConverterService } from './office-converter-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { officeStoreService } from './store/office-store-service';
import { sessionHelper } from '../storage/session-helper';
import { notificationService } from '../notification/notification-service';
import { errorService } from '../error/error-handler';

class OfficeDisplayService {
  printObject = async (objectId, projectId, isReport = true, startCell, officeTableId, bindingId, body, isRefresh) => {
    const objectType = isReport ? 'report' : 'cube';
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      startCell = startCell || await officeApiHelper.getSelectedCell(excelContext);
      const jsonData = await mstrObjectRestService.getObjectContent(objectId, projectId, isReport, body);
      if (jsonData && jsonData.result.data.root == null) {
        // report returned no data
        sessionHelper.disableLoading();
        return { type: 'warning', message: `No data returned by the ${objectType}: ${jsonData.name}` };
      }
      const convertedReport = officeConverterService
        .getConvertedTable(jsonData);
      const newOfficeTableId = officeTableId || await officeApiHelper.findAvailableOfficeTableId(excelContext);
      await this._insertDataIntoExcel(convertedReport, excelContext, startCell, newOfficeTableId);
      const { envUrl } = officeApiHelper.getCurrentMstrContext();
      bindingId = bindingId || newOfficeTableId;
      officeApiHelper.bindNamedItem(newOfficeTableId, bindingId);
      if (!officeTableId && !isRefresh) {
        await this.addReportToStore({
          id: convertedReport.id,
          name: convertedReport.name,
          bindId: bindingId,
          tableId: newOfficeTableId,
          projectId,
          envUrl,
          body,
        });
      }
      return !isRefresh && { type: 'success', message: `Loaded ${objectType}: ${jsonData.name}` };
    } catch (error) {
      throw errorService.errorOfficeFactory(error);
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
        body: report.body,
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
    const result = await this.printObject(refreshReport.id, refreshReport.projectId, true, startCell, refreshReport.tebleId, bindingId, refreshReport.body, true);
    if (result) {
      notificationService.displayMessage(result.type, result.message);
    }
  }

  _insertDataIntoExcel = async (reportConvertedData, context, startCell, tableName) => {
    const hasHeaders = true;
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const range = officeApiHelper
      .getRange(reportConvertedData.headers.length, startCell);
    const mstrTable = sheet.tables.add(range, hasHeaders);
    try {
      mstrTable.name = tableName;
      mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];
      this._pushRows(reportConvertedData, mstrTable);
      officeApiHelper.formatTable(sheet);
      sheet.activate();
      await context.sync();
      return mstrTable;
    } catch (error) {
      mstrTable.delete();
      context.sync();
      throw error;
    }
  }

  _pushRows = (reportConvertedData, mstrTable) => {
    const dataRows = reportConvertedData.rows
      .map((item) => reportConvertedData.headers
        .map((header) => item[header]));
    mstrTable.rows.add(null, dataRows);
  }
}

export const officeDisplayService = new OfficeDisplayService();
