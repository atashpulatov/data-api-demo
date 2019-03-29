import {officeApiHelper} from './office-api-helper';
import {mstrObjectRestService} from '../mstr-object/mstr-object-rest-service';
import {reduxStore} from '../store';
import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';
import {popupController} from '../popup/popup-controller';
import {authenticationHelper} from '../authentication/authentication-helper';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NOT_SUPPORTED_NO_ATTRIBUTES} from '../error/constants';
import {OverlappingTablesError} from '../error/overlapping-tables-error';

const EXCEL_PAGINATION = 5000;

class OfficeDisplayService {
  _printObject = async (objectId, projectId, isReport = true, selectedCell, officeTableId, bindingId, body, isRefresh) => {
    try {
      // Get excel context and initial cell
      const excelContext = await officeApiHelper.getExcelContext();
      const startCell = selectedCell || await officeApiHelper.getSelectedCell(excelContext);

      // Get mstr instance definition
      const objectType = isReport ? 'report' : 'dataset';
      const instanceDefinition = await mstrObjectRestService.getInstanceDefinition(objectId, projectId, isReport);
      console.log(instanceDefinition);

      // Check if instance returned data
      if (!instanceDefinition || instanceDefinition.rows === 0) {
        return {type: 'warning', message: NOT_SUPPORTED_NO_ATTRIBUTES};
      }

      // Create empty table
      const newOfficeTableId = officeTableId || officeApiHelper.findAvailableOfficeTableId();
      // TODO: Add logic to get table if isRefresh
      const officeTable = await this._createOfficeTable(instanceDefinition, excelContext, startCell, newOfficeTableId);

      // Fetch, convert and insert in chain of promises
      const connectionData = {objectId, projectId, isReport, body};
      const officeData = {officeTable, excelContext, startCell, newOfficeTableId};
      await this._fetchInsertDataIntoExcel(connectionData, officeData);

      const {envUrl} = officeApiHelper.getCurrentMstrContext();
      bindingId = bindingId || newOfficeTableId;

      await officeApiHelper.bindNamedItem(newOfficeTableId, bindingId);

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
      console.log(error);
      throw errorService.errorOfficeFactory(error);
    } finally {
      const reduxStoreState = reduxStore.getState();
      reduxStore.dispatch({type: officeProperties.actions.popupHidden});
      reduxStore.dispatch({type: officeProperties.actions.stopLoading});
      reduxStoreState.sessionReducer.dialog.close();
    }
  }

  printObject = async (objectId, projectId, isReport = true, ...args) => {
    const objectInfo = await mstrObjectRestService.getObjectInfo(objectId, projectId, isReport);
    reduxStore.dispatch({
      type: officeProperties.actions.preLoadReport,
      preLoadReport: objectInfo,
    });
    popupController.runPopup(PopupTypeEnum.loadingPage, 22, 28);
    return this._printObject(objectId, projectId, isReport, ...args);
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
  };

  removeReportFromExcel = async (bindingId, isRefresh) => {
    try {
      await authenticationHelper.validateAuthToken();
      const officeContext = await officeApiHelper.getOfficeContext();
      try {
        await officeContext.document.bindings.releaseByIdAsync(bindingId, (asyncResult) => {
          console.log('released binding');
        });
        const excelContext = await officeApiHelper.getExcelContext();
        const tableObject = excelContext.workbook.tables.getItem(bindingId);
        await tableObject.clearFilters();
        await tableObject.delete();
        await excelContext.sync();
        return !isRefresh && this.removeReportFromStore(bindingId);
      } catch (e) {
        if (e.code === 'ItemNotFound') {
          return !isRefresh && this.removeReportFromStore(bindingId);
        }
        throw e;
      }
    } catch (error) {
      return errorService.handleError(error);
    }
  };

  removeReportFromStore = (bindingId) => {
    reduxStore.dispatch({
      type: officeProperties.actions.removeReport,
      reportBindId: bindingId,
    });
    officeStoreService.deleteReport(bindingId);
    return true;
  };

  // TODO: we could filter data to display options related to current envUrl
  refreshReport = async (bindingId, objectType) => {
    const isReport = objectType === 'report';
    const isRefresh = true;
    const excelContext = await officeApiHelper.getExcelContext();
    try {
      await officeApiHelper.onBindingObjectClick(bindingId);
      const range = officeApiHelper.getBindingRange(excelContext, bindingId);
      range.load('address');
      await excelContext.sync();
      const startCell = range.address.split('!')[1].split(':')[0];
      const refreshReport = officeStoreService.getReportFromProperties(bindingId);
      await this.removeReportFromExcel(bindingId, isRefresh);
      const result = await this.printObject(refreshReport.id, refreshReport.projectId, isReport, startCell, refreshReport.tableId, bindingId, refreshReport.body, true);
      if (result) {
        notificationService.displayMessage(result.type, result.message);
      }
      return true;
    } catch (e) {
      if (e.code === 'ItemNotFound') {
        return notificationService.displayMessage('info', 'Data is not relevant anymore. You can delete it from the list');
      }
      throw e;
    }
  };

  _fetchInsertDataIntoExcel(connectionData, officeData) {
    // TODO: Continue here
  }

  _appendRowsToTable(officeContext, officeTable, rowsData) {
    officeTable.getDataBodyRange().values = rowsData;
    return officeContext.sync();
  }

  _insertDataIntoExcel = async (reportConvertedData, context, startCell, tableName) => {
    const hasHeaders = true;
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const endRow = Math.min(EXCEL_PAGINATION, reportConvertedData.rows.length);
    const HEADER_END_ROW_INDEX = 0;
    officeApiHelper.getRange(reportConvertedData.headers.length, startCell, HEADER_END_ROW_INDEX);

    const tableRange = officeApiHelper.getRange(reportConvertedData.headers.length, startCell, endRow);
    const sheetRange = sheet.getRange(tableRange);
    context.trackedObjects.add(sheetRange);
    await this._checkRangeValidity(context, sheetRange);

    const rowsData = this._getRowsArray(reportConvertedData);
    const mstrTable = sheet.tables.add(tableRange, hasHeaders);

    try {
      mstrTable.load('name');
      mstrTable.name = tableName;
      mstrTable.getHeaderRowRange().values = [reportConvertedData.headers];
      mstrTable.getDataBodyRange().values = rowsData.slice(0, endRow);
      await context.sync();
      officeApiHelper.formatNumbers(mstrTable, reportConvertedData);
      await this._addRowsSequentially(rowsData, endRow, mstrTable, context);
      officeApiHelper.formatTable(sheet);
      sheet.activate();
      await context.sync();
      return mstrTable;
    } catch (error) {
      mstrTable.delete();
      await context.sync();
      throw error;
    }
  }

  _createOfficeTable = async (instanceDefinition, context, startCell, tableName) => {
    const hasHeaders = true;
    const {rows, columns, mstrTable} = instanceDefinition;
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const tableRange = officeApiHelper.getRange(columns, startCell, rows);
    const sheetRange = sheet.getRange(tableRange);
    await this._checkRangeValidity(context, sheetRange);

    const excelTable = sheet.tables.add(tableRange, hasHeaders);
    try {
      excelTable.load('name');
      excelTable.name = tableName;
      excelTable.getHeaderRowRange().values = [mstrTable.headers];
      sheet.activate();
      await context.sync();
      return mstrTable;
    } catch (error) {
      excelTable.delete();
      await context.sync();
      throw error;
    }
  }

  _checkRangeValidity = async (context, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await context.sync();
    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError('The required data range in the worksheet is not empty');
    }
  }

  _getRowsArray = (reportConvertedData) => {
    return reportConvertedData.rows
        .map((item) => reportConvertedData.headers
            .map((header) => item[header]));
  }

  _addRowsSequentially = async (rowsData, endRow, mstrTable, context) => {
    try {
      if (rowsData.length > endRow) {
        const startIndex = endRow;
        for (let i = startIndex; i < rowsData.length; i += EXCEL_PAGINATION) {
          await context.sync();
          context.workbook.application.suspendApiCalculationUntilNextSync();
          const endIndex = Math.min(rowsData.length, i + EXCEL_PAGINATION);
          mstrTable.getDataBodyRange().getRowsBelow(Math.min(rowsData.length - i, EXCEL_PAGINATION)).values = rowsData.slice(i, endIndex);
        }
        await context.sync();
      }
    } catch (error) {
      throw error;
    }
  }
}

export const officeDisplayService = new OfficeDisplayService();
