import {officeApiHelper} from './office-api-helper';
import {mstrObjectRestService} from '../mstr-object/mstr-object-rest-service';
import {reduxStore} from '../store';
import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';
import {popupController} from '../popup/popup-controller';
import {OutsideOfRangeError} from '../error/outside-of-range-error';
import {authenticationHelper} from '../authentication/authentication-helper';
import {PopupTypeEnum} from '../home/popup-type-enum';

const EXCEL_PAGINATION = 5000;

class OfficeDisplayService {
  _printObject = async (objectId, projectId, isReport = true, startCell, officeTableId, bindingId, body, isRefresh) => {
    const objectType = isReport ? 'report' : 'dataset';
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      startCell = startCell || await officeApiHelper.getSelectedCell(excelContext);
      const officeTable = await mstrObjectRestService.getObjectContent(objectId, projectId, isReport, body);
      if (!officeTable || (officeTable.rows && officeTable.rows.length === 0)) {
        // report returned no data
        return {type: 'warning', message: `No data returned by the ${objectType}: ${officeTable.name}`};
      }
      const newOfficeTableId = officeTableId || await officeApiHelper.findAvailableOfficeTableId(excelContext);
      await this._insertDataIntoExcel(officeTable, excelContext, startCell, newOfficeTableId);
      const {envUrl} = officeApiHelper.getCurrentMstrContext();
      bindingId = bindingId || newOfficeTableId;
      officeApiHelper.bindNamedItem(newOfficeTableId, bindingId);
      if (!officeTableId && !isRefresh) {
        await this.addReportToStore({
          id: officeTable.id,
          name: officeTable.name,
          bindId: bindingId,
          tableId: newOfficeTableId,
          projectId,
          envUrl,
          body,
          isLoading: false,
          objectType,
        });
      }
      return !isRefresh && {type: 'success', message: `Data loaded successfully`};
    } catch (error) {
      throw errorService.errorOfficeFactory(error);
    } finally {
      const reduxStoreState = reduxStore.getState();
      reduxStoreState.sessionReducer.dialog.close();
    }
  }

  printObject = async (...args) => {
    popupController.runPopup(PopupTypeEnum.loadingPage, 30, 50);
    return await this._printObject(...args);
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
        isLoading: report.isLoading,
        objectType: report.objectType,
      },
    });
    officeStoreService.preserveReport(report);
  }

  removeReportFromExcel = async (bindingId, isRefresh) => {
    try {
      await authenticationHelper.validateAuthToken();
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
      return true;
    } catch (error) {
      return errorService.handleError(error);
    }
  };

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
    const result = await this.printObject(refreshReport.id, refreshReport.projectId, true, startCell, refreshReport.tableId, bindingId, refreshReport.body, true);
    if (result) {
      notificationService.displayMessage(result.type, result.message);
    }
  }

  _insertDataIntoExcel = async (reportConvertedData, context, startCell, tableName) => {
    const hasHeaders = true;
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const endRow = Math.min(EXCEL_PAGINATION, reportConvertedData.rows.length);

    const range = officeApiHelper.getRange(reportConvertedData.headers.length, startCell, endRow);
    const sheetRange = sheet.getRange(range);
    context.trackedObjects.add(sheetRange);
    await this._checkRangeValidity(context, sheetRange);

    const rowsData = this._getRowsArray(reportConvertedData);

    const mstrTable = sheet.tables.add(range, hasHeaders);
    sheetRange.values = [reportConvertedData.headers, ...rowsData.slice(0, endRow)];
    try {
      mstrTable.name = tableName;
      await context.sync();
      officeApiHelper.formatNumbers(mstrTable, reportConvertedData);
      await this._addRowsSequentially(rowsData, endRow, mstrTable, context);
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

  _checkRangeValidity = async (context, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await context.sync();
    if (!usedDataRange.isNullObject) {
      throw new OutsideOfRangeError('The required data range in the worksheet is not empty');
    }
  }

  _getRowsArray = (reportConvertedData) => {
    return reportConvertedData.rows
        .map((item) => reportConvertedData.headers
            .map((header) => item[header]));
  }

  _addRowsSequentially = async (rowsData, endRow, mstrTable, context) => {
    if (rowsData.length > endRow) {
      const startIndex = endRow;
      for (let i = startIndex; i < rowsData.length; i += EXCEL_PAGINATION) {
        context.workbook.application.suspendApiCalculationUntilNextSync();
        const endIndex = Math.min(rowsData.length, i + EXCEL_PAGINATION);
        mstrTable.getDataBodyRange().getRowsBelow(Math.min(rowsData.length - i, EXCEL_PAGINATION)).values = rowsData.slice(i, endIndex);
        await context.sync();
      }
    }
  }
}

export const officeDisplayService = new OfficeDisplayService();
