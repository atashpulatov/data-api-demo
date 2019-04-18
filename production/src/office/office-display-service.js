import {officeApiHelper} from './office-api-helper';
import {mstrObjectRestService, DATA_LIMIT} from '../mstr-object/mstr-object-rest-service';
import {reduxStore} from '../store';
import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';
import {errorService} from '../error/error-handler';
import {popupController} from '../popup/popup-controller';
import {authenticationHelper} from '../authentication/authentication-helper';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NOT_SUPPORTED_NO_ATTRIBUTES} from '../error/constants';
import {OverlappingTablesError} from '../error/overlapping-tables-error';

class OfficeDisplayService {
  printObject = async (objectId, projectId, isReport = true, ...args) => {
    const objectInfo = await mstrObjectRestService.getObjectInfo(objectId, projectId, isReport);
    reduxStore.dispatch({
      type: officeProperties.actions.preLoadReport,
      preLoadReport: objectInfo,
    });
    popupController.runPopup(PopupTypeEnum.loadingPage, 22, 28);
    return this._printObject(objectId, projectId, isReport, ...args);
  }

  _printObject = async (objectId, projectId, isReport = true, selectedCell, officeTableId, bindingId, body, isRefresh) => {
    try {
      const objectType = isReport ? 'report' : 'dataset';
      const {envUrl} = officeApiHelper.getCurrentMstrContext();

      // Get excel context and initial cell
      console.groupCollapsed('Importing data performance');
      console.time('Total');
      console.time('Init excel');
      const excelContext = await officeApiHelper.getExcelContext();
      const startCell = selectedCell || await officeApiHelper.getSelectedCell(excelContext);
      console.timeEnd('Init excel');

      // Get mstr instance definition
      console.time('Instance definition');
      const instanceDefinition = await mstrObjectRestService.getInstanceDefinition(objectId, projectId, isReport);
      console.timeEnd('Instance definition');

      // Check if instance returned data
      if (!instanceDefinition || instanceDefinition.mstrTable.rows.length === 0) {
        return {type: 'warning', message: NOT_SUPPORTED_NO_ATTRIBUTES};
      }

      // TODO: If isRefresh check if new instance definition is same as before

      // Create or get table id
      let {officeTable, newOfficeTableId} = await this._getOfficeTable(officeTableId, isRefresh, excelContext, bindingId, instanceDefinition, startCell);

      // Fetch, convert and insert with promise generator
      console.time('Fetch and insert into excel');
      const connectionData = {objectId, projectId, isReport, body};
      const officeData = {officeTable, excelContext, startCell, newOfficeTableId};
      officeTable = await this._fetchInsertDataIntoExcel(connectionData, officeData, instanceDefinition, isRefresh);

      // Apply formatting
      await this._applyFormatting(isRefresh, officeTable, instanceDefinition, excelContext);

      // Save to store
      bindingId = bindingId || newOfficeTableId;
      await officeApiHelper.bindNamedItem(newOfficeTableId, bindingId);
      this._addToStore(officeTableId, isRefresh, instanceDefinition, bindingId, newOfficeTableId, projectId, envUrl, body, objectType);

      console.timeEnd('Total');
      return !isRefresh && {type: 'success', message: `Data loaded successfully`};
    } catch (error) {
      throw errorService.errorOfficeFactory(error);
    } finally {
      console.groupEnd();
      this._dispatchPrintFinish();
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
        isLoading: report.isLoading,
        objectType: report.objectType,
      },
    });
    officeStoreService.preserveReport(report);
  };

  removeReportFromStore = (bindingId) => {
    reduxStore.dispatch({
      type: officeProperties.actions.removeReport,
      reportBindId: bindingId,
    });
    officeStoreService.deleteReport(bindingId);
    return true;
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

  _createOfficeTable = async (instanceDefinition, context, startCell, officeTableId) => {
    const hasHeaders = true;
    const {rows, columns, mstrTable} = instanceDefinition;
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const tableRange = officeApiHelper.getRange(columns, startCell, rows);
    const sheetRange = sheet.getRange(tableRange);
    await this._checkRangeValidity(context, sheetRange);

    const officeTable = sheet.tables.add(tableRange, hasHeaders);
    try {
      officeTable.load('name');
      officeTable.name = officeTableId;
      officeTable.getHeaderRowRange().values = [mstrTable.headers];
      sheet.activate();
      await context.sync();
      return officeTable;
    } catch (error) {
      officeTable.delete();
      await context.sync();
      throw error;
    }
  }

  _dispatchPrintFinish() {
    const reduxStoreState = reduxStore.getState();
    reduxStore.dispatch({type: officeProperties.actions.popupHidden});
    reduxStore.dispatch({type: officeProperties.actions.stopLoading});
    reduxStoreState.sessionReducer.dialog.close();
  }

  _addToStore(officeTableId, isRefresh, instanceDefinition, bindingId, newOfficeTableId, projectId, envUrl, body, objectType) {
    if (!officeTableId && !isRefresh) {
      this.addReportToStore({
        id: instanceDefinition.mstrTable.id,
        name: instanceDefinition.mstrTable.name,
        bindId: bindingId,
        tableId: newOfficeTableId,
        projectId,
        envUrl,
        body,
        isLoading: false,
        objectType,
      });
    }
  }

  async _applyFormatting(isRefresh, officeTable, instanceDefinition, excelContext) {
    console.time('Apply formatting');
    if (!isRefresh) {
      officeApiHelper.formatNumbers(officeTable, instanceDefinition.mstrTable);
      await excelContext.sync();
      officeApiHelper.formatTable(officeTable);
      await excelContext.sync();
    }
    console.timeEnd('Apply formatting');
  }

  async _getOfficeTable(officeTableId, isRefresh, excelContext, bindingId, instanceDefinition, startCell) {
    console.time('Create or get table');
    const newOfficeTableId = officeTableId || officeApiHelper.findAvailableOfficeTableId();
    let officeTable;
    if (isRefresh) {
      officeTable = await officeApiHelper.getTable(excelContext, bindingId);
    } else {
      officeTable = await this._createOfficeTable(instanceDefinition, excelContext, startCell, newOfficeTableId);
    }
    console.timeEnd('Create or get table');
    return {officeTable, newOfficeTableId};
  }

  async _fetchInsertDataIntoExcel(connectionData, officeData, instanceDefinition) {
    try {
      const {objectId, projectId, isReport, body} = connectionData;
      const {excelContext, officeTable} = officeData;
      const {mstrTable, columns, rows} = instanceDefinition;
      const {headers} = mstrTable;
      const limit = Math.floor(DATA_LIMIT / columns);
      const rowGenerator = mstrObjectRestService.getObjectContentGenerator(instanceDefinition, objectId, projectId, isReport, body, limit);
      let rowIndex = 0;
      const contextPromises = [];
      console.time('Fetch data');
      for await (const row of rowGenerator) {
        console.groupCollapsed(`Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`);
        console.timeEnd('Fetch data');
        console.time('Append rows');
        const excelRows = this._getRowsArray(row, headers);
        this._appendRowsToTable(officeTable, excelRows, rowIndex);
        rowIndex += row.length;
        console.timeEnd('Append rows');
        contextPromises.push(excelContext.sync());
        console.time('Fetch data');
        console.groupEnd();
      };
      console.timeEnd('Fetch and insert into excel');
      console.time('Context sync');
      await Promise.all(contextPromises);
      console.timeEnd('Context sync');
      return officeTable;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  _appendRowsToTable(officeTable, excelRows, rowIndex) {
    officeTable.getHeaderRowRange().getRowsBelow(excelRows.length).getOffsetRange(rowIndex, 0).values = excelRows;
  }

  _checkRangeValidity = async (context, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await context.sync();
    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError('The required data range in the worksheet is not empty');
    }
  }

  _getRowsArray = (rows, headers) => {
    return rows
        .map((item) => headers
            .map((header) => item[header]));
  }
}

export const officeDisplayService = new OfficeDisplayService();
