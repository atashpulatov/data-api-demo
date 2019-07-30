import {officeApiHelper} from './office-api-helper';
import {mstrObjectRestService, DATA_LIMIT, PROMISE_LIMIT, IMPORT_ROW_LIMIT} from '../mstr-object/mstr-object-rest-service';
import {reduxStore} from '../store';
import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';
import {errorService} from '../error/error-handler';
import {popupController} from '../popup/popup-controller';
import {authenticationHelper} from '../authentication/authentication-helper';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NOT_SUPPORTED_NO_ATTRIBUTES, ALL_DATA_FILTERED_OUT, TABLE_OVERLAP, ERROR_POPUP_CLOSED} from '../error/constants';
import {OverlappingTablesError} from '../error/overlapping-tables-error';

const DEFAULT_TABLE_STYLE = 'TableStyleLight11';
const TABLE_HEADER_FONT_COLOR = '#000000';
const TABLE_HEADER_FILL_COLOR = '#ffffff';

class OfficeDisplayService {
  printObject = async (options) => {
    const {isRefreshAll = false, isPrompted, objectId, projectId, isReport} = options;
    if (!isRefreshAll) {
      // /Reports/getDefinition (GET /reports/{reportId}) endpoint does not work for Reports with Object Prompt(?)
      // so we're using /Object_Management/getObject (GET /objects/{id}) instead
      // should probably open an DE
      const objectInfo = !!isPrompted ? await mstrObjectRestService.getObjectInfo(objectId, projectId, isReport) : await mstrObjectRestService.getObjectDefinition(objectId, projectId, isReport);
      reduxStore.dispatch({
        type: officeProperties.actions.preLoadReport,
        preLoadReport: objectInfo,
      });
      await popupController.runPopup(PopupTypeEnum.loadingPage, 22, 28);
    }
    try {
      return await this._printObject(options);
    } catch (error) {
      throw error;
    } finally {
      !isRefreshAll && this._dispatchPrintFinish();
    }
  }

  _printObject = async ({objectId, projectId, isReport = true, selectedCell, bindingId, isRefresh, dossierData, body, isCrosstab, isPrompted, promptsAnswers}) => {
    let officeTable;
    let newOfficeTableId;
    let shouldFormat;
    let excelContext;
    let crosstabHeaderDimensions;
    try {
      const objectType = isReport ? 'report' : 'dataset';
      const {envUrl} = officeApiHelper.getCurrentMstrContext();

      // Get excel context and initial cell
      console.group('Importing data performance');
      console.time('Total');
      console.time('Init excel');
      excelContext = await officeApiHelper.getExcelContext();
      const startCell = selectedCell || await officeApiHelper.getSelectedCell(excelContext);
      console.timeEnd('Init excel');

      // Get mstr instance definition
      console.time('Instance definition');
      let instanceDefinition = await mstrObjectRestService.createInstance(objectId, projectId, isReport, dossierData, body);

      // Status 2 = report has open prompts to be answered before data can be returned
      if (instanceDefinition.status === 2) {
        instanceDefinition = await this._answerPrompts(instanceDefinition, objectId, projectId, promptsAnswers, isReport, dossierData, body);
      }
      const {isCrosstab} = instanceDefinition.mstrTable;

      if (isCrosstab) {
        crosstabHeaderDimensions = {
          columnsY: instanceDefinition.mstrTable.headers.columns.length,
          columnsX: instanceDefinition.mstrTable.headers.columns[0].length,
          rowsX: instanceDefinition.mstrTable.rows.length,
          rowsY: instanceDefinition.rows,
        };
      }
      console.timeEnd('Instance definition');

      // Check if instance returned data
      if (!instanceDefinition || instanceDefinition.mstrTable.rows.length === 0) {
        return {type: 'warning', message: !!isPrompted ? ALL_DATA_FILTERED_OUT : NOT_SUPPORTED_NO_ATTRIBUTES};
      }

      // TODO: If isRefresh check if new instance definition is same as before

      // Create or update table
      ({officeTable, newOfficeTableId, shouldFormat} = await this._getOfficeTable(isRefresh, excelContext, bindingId, instanceDefinition, startCell, crosstabHeaderDimensions));

      // Fetch, convert and insert with promise generator
      console.time('Fetch and insert into excel');
      const connectionData = {objectId, projectId, dossierData, isReport, body};
      const officeData = {officeTable, excelContext, startCell, newOfficeTableId};
      officeTable = await this._fetchInsertDataIntoExcel({connectionData, officeData, instanceDefinition, isRefresh, startCell});

      // Apply formatting when table was created
      if (shouldFormat) {
        await this._applyFormatting(officeTable, instanceDefinition, excelContext);
      }

      // Save to store
      bindingId = bindingId || newOfficeTableId;
      await officeApiHelper.bindNamedItem(newOfficeTableId, bindingId);
      this._addToStore({isRefresh, instanceDefinition, bindingId, projectId, envUrl, body, objectType, isCrosstab, isPrompted, promptsAnswers, crosstabHeaderDimensions});

      console.timeEnd('Total');
      reduxStore.dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
      });
      return {type: 'success', message: `Data loaded successfully`};
    } catch (error) {
      if (officeTable && !isRefresh) {
        // officeTable.delete();
      }
      throw errorService.errorOfficeFactory(error);
    } finally {
      excelContext.sync();
      console.groupEnd();
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
        projectId: report.projectId,
        envUrl: report.envUrl,
        body: report.body,
        isLoading: report.isLoading,
        objectType: report.objectType,
        isCrosstab: report.isCrosstab,
        isPrompted: report.isPrompted,
        promptsAnswers: report.promptsAnswers,
        crosstabHeaderDimensions: report.crosstabHeaderDimensions,
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

  removeReportFromExcel = async (bindingId, isCrosstab, crosstabHeaderDimensions, isRefresh) => {
    let crosstabRange;
    try {
      await authenticationHelper.validateAuthToken();
      const officeContext = await officeApiHelper.getOfficeContext();
      try {
        await officeContext.document.bindings.releaseByIdAsync(bindingId, (asyncResult) => {
          console.log('released binding');
        });
        const excelContext = await officeApiHelper.getExcelContext();
        const tableObject = excelContext.workbook.tables.getItem(bindingId);
        if (isCrosstab) {
          const sheet = tableObject.worksheet;
          const cell = tableObject.getRange().getCell(0, 0);
          cell.load('address');
          await excelContext.sync();
          crosstabRange = officeApiHelper.getCrosstabRange(cell.address, crosstabHeaderDimensions, sheet);
        }
        await tableObject.clearFilters();
        await tableObject.delete();
        isCrosstab && await crosstabRange.clear();
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
  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {Object} instanceDefinition
   * @param {Object} context ExcelContext
   * @param {string} startCell  Top left corner cell
   * @param {Object} crosstabHeaderDimensions Contains information about crosstab headers dimensions
   * @param {string} officeTableId Excel Binding ID
   * @param {Object} prevOfficeTable Previous office table to refresh
   *
   * @memberOf OfficeDisplayService
   */
  _createOfficeTable = async (instanceDefinition, context, startCell, crosstabHeaderDimensions, officeTableId, prevOfficeTable) => {
    const {rows, columns, mstrTable} = instanceDefinition;
    const {isCrosstab} = mstrTable;
    let range;
    const sheet = prevOfficeTable ? prevOfficeTable.worksheet : context.workbook.worksheets.getActiveWorksheet();
    const tableStartCell = officeApiHelper.getTableStartCell({startCell, sheet, mstrTable});
    const tableRange = officeApiHelper.getRange(columns, tableStartCell, rows);
    if (isCrosstab) {
      range = officeApiHelper.getCrosstabRange(tableStartCell, crosstabHeaderDimensions, sheet);
    } else {
      range = sheet.getRange(tableRange);
    }
    if (prevOfficeTable) {
      prevOfficeTable.rows.load('count');
      await context.sync();
      const addedColumns = Math.max(0, columns - prevOfficeTable.columns.count);
      const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);

      if (addedColumns) {
        const rightRange = prevOfficeTable.getRange().getColumnsAfter(addedColumns);
        await this._checkRangeValidity(context, rightRange);
      }

      if (addedRows) {
        const bottomRange = prevOfficeTable.getRange().getRowsBelow(addedRows).getResizedRange(0, addedColumns);
        await this._checkRangeValidity(context, bottomRange);
      }

      prevOfficeTable.delete();
      await context.sync();
    } else {
      await this._checkRangeValidity(context, range);
    }
    isCrosstab && officeApiHelper.createColumnsHeaders(tableStartCell, mstrTable.headers.columns, sheet, range);
    const officeTable = sheet.tables.add(tableRange, true);
    this._styleHeaders(officeTable, TABLE_HEADER_FONT_COLOR, TABLE_HEADER_FILL_COLOR);
    try {
      officeTable.load('name');
      officeTable.name = officeTableId;
      !isCrosstab && (officeTable.getHeaderRowRange().values = [mstrTable.headers.columns.pop()]);
      sheet.activate();
      await context.sync();
      return officeTable;
    } catch (error) {
      await context.sync();
      throw error;
    }
  }

  _updateOfficeTable = async (instanceDefinition, context, prevOfficeTable) => {
    try {
      const {rows, mstrTable} = instanceDefinition;

      prevOfficeTable.rows.load('count');
      await context.sync();
      const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);
      // If the new table has more rows during update check validity
      if (addedRows) {
        const bottomRange = prevOfficeTable.getRange().getRowsBelow(addedRows);
        await this._checkRangeValidity(context, bottomRange);
      }

      context.workbook.application.suspendApiCalculationUntilNextSync();
      prevOfficeTable.clearFilters();
      prevOfficeTable.sort.clear();
      prevOfficeTable.getHeaderRowRange().values = [mstrTable.headers.columns];
      await context.sync();
      await this._updateRows(prevOfficeTable, context, rows);
      return prevOfficeTable;
    } catch (error) {
      await context.sync();
      throw error;
    }
  }

  async _updateRows(prevOfficeTable, context, rows) {
    const tableRows = prevOfficeTable.rows;
    tableRows.load('count');
    await context.sync();
    const tableRowCount = tableRows.count;
    // Delete extra rows if new report is smaller
    if (rows < tableRowCount) {
      prevOfficeTable.getRange().getRow(rows + 1).getResizedRange(tableRowCount - rows, 0).clear();
      await context.sync();
      tableRows.load('items');
      await context.sync();
      const rowsToRemove = tableRows.items;
      for (let i = tableRowCount - 1; i >= rows; i--) {
        rowsToRemove[i].delete();
        if (i === rows || i % 500 === 0) {
          await context.sync();
        }
      }
    }
  }

  _styleHeaders = (officeTable, fontColor, fillColor) => {
    officeTable.style = DEFAULT_TABLE_STYLE;
    const headerRowRange = officeTable.getHeaderRowRange();
    headerRowRange.format.fill.color = fillColor;
    headerRowRange.format.font.color = fontColor;
  }

  /**
   * Function closes popup; used when  importing report
   * it swallows error from office if dialog has been closed by user
   *
   * @memberOf OfficeDisplayService
   */
  _dispatchPrintFinish() {
    const reduxStoreState = reduxStore.getState();
    reduxStore.dispatch({type: officeProperties.actions.popupHidden});
    reduxStore.dispatch({type: officeProperties.actions.stopLoading});
    try {
      reduxStoreState.sessionReducer.dialog.close();
    } catch (err) {
      if (!err.includes(ERROR_POPUP_CLOSED)) {
        throw err;
      }
    }
  }

  _addToStore({isRefresh, instanceDefinition, bindingId, projectId, envUrl, body, objectType, isCrosstab, isPrompted, promptsAnswers, crosstabHeaderDimensions}) {
    if (!isRefresh) {
      this.addReportToStore({
        id: objectType === 'report' ? instanceDefinition.mstrTable.id : instanceDefinition.mstrTable.cubeId,
        name: objectType === 'report' ? instanceDefinition.mstrTable.name : instanceDefinition.mstrTable.cubeName,
        bindId: bindingId,
        projectId,
        envUrl,
        body,
        isLoading: false,
        objectType,
        isPrompted,
        isCrosstab,
        promptsAnswers,
        crosstabHeaderDimensions,
      });
    }
  }

  async _applyFormatting(officeTable, instanceDefinition, excelContext) {
    try {
      console.time('Apply formatting');
      officeApiHelper.formatNumbers(officeTable, instanceDefinition.mstrTable);
      await excelContext.sync();
      officeApiHelper.formatTable(officeTable);
      await excelContext.sync();
    } catch (error) {
      // TODO: Inform the user?
      console.log('Cannot apply formatting, skipping');
    } finally {
      console.timeEnd('Apply formatting');
    }
  }

  async _getOfficeTable(isRefresh, excelContext, bindingId, instanceDefinition, startCell, crosstabHeaderDimensions) {
    console.time('Create or get table');
    const newOfficeTableId = bindingId || officeApiHelper.findAvailableOfficeTableId();
    let officeTable;
    let shouldFormat = true;

    if (isRefresh) {
      const prevOfficeTable = await officeApiHelper.getTable(excelContext, bindingId);
      const tableColumnsChanged = await this._checkColumnsChange(prevOfficeTable, excelContext, instanceDefinition);
      if (tableColumnsChanged) {
        console.log('Instance definition changed, creating new table');
        const headerCell = prevOfficeTable.getHeaderRowRange().getCell(0, 0);
        headerCell.load('address');
        await excelContext.sync();
        const startCell = officeApiHelper.getStartCell(headerCell.address);
        await excelContext.sync();
        officeTable = await this._createOfficeTable(instanceDefinition, excelContext, startCell, crosstabHeaderDimensions, newOfficeTableId, prevOfficeTable);
      } else {
        shouldFormat = false;
        console.time('Validate existing table');
        officeTable = await this._updateOfficeTable(instanceDefinition, excelContext, prevOfficeTable);
        console.timeEnd('Validate existing table');
      }
    } else {
      officeTable = await this._createOfficeTable(instanceDefinition, excelContext, startCell, crosstabHeaderDimensions, newOfficeTableId);
    }
    console.timeEnd('Create or get table');
    return {officeTable, newOfficeTableId, shouldFormat};
  }

  async _fetchInsertDataIntoExcel({connectionData, officeData, instanceDefinition, isRefresh}) {
    try {
      const {objectId, projectId, dossierData, isReport, body} = connectionData;
      const {excelContext, officeTable} = officeData;
      const {columns, rows, mstrTable} = instanceDefinition;
      const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);
      const rowGenerator = mstrObjectRestService.getObjectContentGenerator(instanceDefinition, objectId, projectId, isReport, dossierData, body, limit);
      let rowIndex = 0;
      let contextPromises = [];
      console.time('Fetch data');
      for await (const {row, header} of rowGenerator) {
        console.groupCollapsed(`Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`);
        console.timeEnd('Fetch data');
        console.time('Append rows');
        excelContext.workbook.application.suspendApiCalculationUntilNextSync();
        await this._appendRowsToTable(officeTable, row, rowIndex, isRefresh);
        contextPromises.push(excelContext.sync());
        console.timeEnd('Append rows');
        if (mstrTable.isCrosstab) {
          console.time('Append crosstab rows');
          this._appendCrosstabRowsToRange(officeTable, header.rows, rowIndex, isRefresh, excelContext);
          contextPromises.push(excelContext.sync());
          console.timeEnd('Append crosstab rows');
        }
        rowIndex += row.length;
        const promiseLength = contextPromises.length;
        if (promiseLength % PROMISE_LIMIT === 0) {
          console.time('Waiting for pending context syncs');
          await Promise.all(contextPromises);
          console.timeEnd('Waiting for pending context syncs');
          contextPromises = [];
        }
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

  _appendCrosstabRowsToRange(officeTable, headerRows, rowIndex, isRefresh) {
    const startCell = officeTable.getDataBodyRange().getRow(0).getCell(0, 0).getOffsetRange(rowIndex, 0);
    officeApiHelper.createRowsHeaders(startCell, headerRows);
  }

  _appendRowsToTable(officeTable, excelRows, rowIndex, isRefresh = false) {
    // Get resize range: The number of rows/cols by which to expand the bottom-right corner, relative to the current range.
    const rowRange = officeTable.getDataBodyRange().getRow(0).getResizedRange(excelRows.length - 1, 0).getOffsetRange(rowIndex, 0);
    // clear(applyToString?: "All" | "Formats" | "Contents" | "Hyperlinks" | "RemoveHyperlinks"): void;
    isRefresh && rowRange.clear('Contents');
    rowRange.values = excelRows;
  }

  _checkColumnsChange = async (prevOfficeTable, context, instanceDefinition) => {
    const {columns} = instanceDefinition;
    const tableColumns = prevOfficeTable.columns;
    tableColumns.load('count');
    await context.sync();
    const tableColumnsCount = tableColumns.count;
    return columns !== tableColumnsCount;
  }

  _checkRangeValidity = async (context, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await context.sync();
    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError(TABLE_OVERLAP);
    }
  }

  async _answerPrompts(instanceDefinition, objectId, projectId, promptsAnswers, isReport, dossierData, body) {
    let count = 0;
    while (instanceDefinition.status === 2) {
      await mstrObjectRestService.answerPrompts(objectId, projectId, instanceDefinition.instanceId, promptsAnswers[count]);
      instanceDefinition = await mstrObjectRestService.getInstance(objectId, projectId, isReport, dossierData, body, instanceDefinition.instanceId);
      count++;
    }
    return instanceDefinition;
  }
}

export const officeDisplayService = new OfficeDisplayService();
