import { officeApiHelper } from './office-api-helper';
import {
  DATA_LIMIT,
  PROMISE_LIMIT,
  IMPORT_ROW_LIMIT,
  CONTEXT_LIMIT,
  getObjectInfo,
  getObjectDefinition,
  createInstance,
  getObjectContentGenerator,
  answerPrompts,
  modifyInstance,
  createDossierInstance,
  fetchVisualizationDefinition,
} from '../mstr-object/mstr-object-rest-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { officeStoreService } from './store/office-store-service';
import { errorService } from '../error/error-handler';
import { popupController } from '../popup/popup-controller';
import { authenticationHelper } from '../authentication/authentication-helper';
import { PopupTypeEnum } from '../home/popup-type-enum';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import {
  NOT_SUPPORTED_NO_ATTRIBUTES,
  ALL_DATA_FILTERED_OUT,
  TABLE_OVERLAP,
  ERROR_POPUP_CLOSED,
} from '../error/constants';
import { OverlappingTablesError } from '../error/overlapping-tables-error';

const DEFAULT_TABLE_STYLE = 'TableStyleLight11';
const TABLE_HEADER_FONT_COLOR = '#000000';
const TABLE_HEADER_FILL_COLOR = '#ffffff';

class OfficeDisplayService {
  printObject = async (options) => {
    const {
      isRefreshAll = false,
      isPrompted,
      objectId,
      projectId,
      mstrObjectType,
    } = options;
    if (!isRefreshAll) {
      // /Reports/getDefinition (GET /reports/{reportId}) endpoint does not work for Reports with Object Prompt(?)
      // so we're using /Object_Management/getObject (GET /objects/{id}) instead
      // should probably open an DE
      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization) {
        const objectInfo = isPrompted
          ? await getObjectInfo(objectId,
            projectId,
            mstrObjectType)
          : await getObjectDefinition(objectId,
            projectId,
            mstrObjectType);
        reduxStore.dispatch({
          type: officeProperties.actions.preLoadReport,
          preLoadReport: objectInfo,
        });
      }

      await popupController.runPopup(PopupTypeEnum.loadingPage, 22, 28);
    }
    try {
      return await this._printObject(options);
    } finally {
      if (!isRefreshAll) this._dispatchPrintFinish();
    }
  };

  _printObject = async ({
    objectId,
    projectId,
    mstrObjectType = mstrObjectEnum.mstrObjectType.report,
    selectedCell,
    bindingId,
    isRefresh,
    dossierData,
    body,
    isCrosstab,
    isPrompted,
    promptsAnswers,
    crosstabHeaderDimensions = false,
    importSubtotal = true,
    subtotalsAddresses = false,
    visualizationInfo,
  }) => {
    let officeTable;
    let newOfficeTableId;
    let shouldFormat;
    let excelContext;
    let startCell;
    let tableColumnsChanged;
    let instanceDefinition;
    try {
      const objectType = mstrObjectType;
      const { envUrl } = officeApiHelper.getCurrentMstrContext();

      // Get excel context and initial cell
      console.group('Importing data performance');
      console.time('Total');
      console.time('Init excel');
      excelContext = await officeApiHelper.getExcelContext();
      startCell = selectedCell || (await officeApiHelper.getSelectedCell(excelContext));
      console.timeEnd('Init excel');

      // Get mstr instance definition
      console.time('Instance definition');

      if (body) {
        body.template = body.requestedObjects;
      }
      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
        const instanceId = (await createDossierInstance(projectId, objectId, body)).body.mid;
        const config = {
          projectId, objectId, instanceId, mstrObjectType, dossierData, body, visualizationInfo,
        };
        const temp = await fetchVisualizationDefinition(config);
        instanceDefinition = { ...temp, instanceId };
      } else {
        const config = { objectId, projectId, mstrObjectType, dossierData, body };
        instanceDefinition = await createInstance(config);
      }
      console.log(instanceDefinition);
      // Status 2 = report has open prompts to be answered before data can be returned
      if (instanceDefinition.status === 2) {
        instanceDefinition = await this._answerPrompts(
          instanceDefinition,
          objectId,
          projectId,
          promptsAnswers,
          mstrObjectType,
          dossierData,
          body,
        );
      }
      const { mstrTable } = instanceDefinition;
      isCrosstab = mstrTable.isCrosstab;
      mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions;
      mstrTable.crosstabHeaderDimensions = isCrosstab
        ? this._getCrosstabHeaderDimensions(instanceDefinition)
        : false;
      mstrTable.subtotalsAddresses = subtotalsAddresses;
      console.timeEnd('Instance definition');

      // Check if instance returned data
      if (
        !instanceDefinition
        || instanceDefinition.mstrTable.rows.length === 0
      ) {
        return {
          type: 'warning',
          message: isPrompted
            ? ALL_DATA_FILTERED_OUT
            : NOT_SUPPORTED_NO_ATTRIBUTES,
        };
      }

      // TODO: If isRefresh check if new instance definition is same as before

      // Create or update table
      ({ officeTable, newOfficeTableId, shouldFormat, tableColumnsChanged } = await this._getOfficeTable(isRefresh, excelContext, bindingId, instanceDefinition, startCell));

      // Apply formatting when table was created
      if (shouldFormat) {
        await this._applyFormatting(officeTable, instanceDefinition, isCrosstab, excelContext);
      }

      // Fetch, convert and insert with promise generator
      console.time('Fetch and insert into excel');
      const connectionData = { objectId, projectId, dossierData, mstrObjectType, body };
      const officeData = { officeTable, excelContext, startCell, newOfficeTableId };
      ({ officeTable, subtotalsAddresses } = await this._fetchInsertDataIntoExcel({
        connectionData,
        officeData,
        instanceDefinition,
        isRefresh,
        startCell,
        tableColumnsChanged,
        visualizationInfo,
      }));
      if (importSubtotal && subtotalsAddresses.length) {
        // Removing duplicated subtotal addresses from headers
        await this.applySubtotalFormatting(isCrosstab, subtotalsAddresses, officeTable, excelContext, mstrTable);
      }

      // Save to store
      bindingId = bindingId || newOfficeTableId;
      await officeApiHelper.bindNamedItem(newOfficeTableId, bindingId);
      this._addToStore({
        isRefresh,
        instanceDefinition,
        bindingId,
        projectId,
        envUrl,
        body,
        objectType,
        isCrosstab,
        isPrompted,
        promptsAnswers,
        importSubtotal,
        subtotalsAddresses,
        visualizationInfo,
      });

      console.timeEnd('Total');
      reduxStore.dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
      });
      return { type: 'success', message: 'Data loaded successfully' };
    } catch (error) {
      if (officeTable && !isRefresh) {
        let crosstabRange;
        if (isCrosstab) {
          const sheet = officeTable.worksheet;
          crosstabRange = officeApiHelper.getCrosstabRange(officeTable.getRange().getCell(0, 0),
            crosstabHeaderDimensions,
            sheet);
        }
        officeTable.delete();
        if (isCrosstab) (await crosstabRange.clear());
      }
      throw error;
    } finally {
      excelContext.sync();
      console.groupEnd();
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

  removeReportFromExcel = async (
    bindingId,
    isCrosstab,
    crosstabHeaderDimensions,
    isRefresh,
  ) => {
    let crosstabRange;
    try {
      await authenticationHelper.validateAuthToken();
      const officeContext = await officeApiHelper.getOfficeContext();
      try {
        await officeContext.document.bindings.releaseByIdAsync(bindingId,
          () => {
            console.log('released binding');
          });
        const excelContext = await officeApiHelper.getExcelContext();
        const tableObject = excelContext.workbook.tables.getItem(bindingId);
        if (isCrosstab) {
          tableObject.showHeaders = true;
          crosstabRange = await officeApiHelper.getCrosstabRangeSafely(tableObject,
            crosstabHeaderDimensions,
            excelContext);
          excelContext.trackedObjects.add(crosstabRange);
        }
        await tableObject.clearFilters();
        // since we are removing table from Excel, we don't need event to be emitted
        excelContext.runtime.enableEvents = false;
        await excelContext.sync();
        await tableObject.delete();
        if (isCrosstab) {
          await crosstabRange.clear();
          excelContext.trackedObjects.remove(crosstabRange);
        }
        excelContext.runtime.enableEvents = true;
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
   * @param {string} officeTableId Excel Binding ID
   * @param {Object} prevOfficeTable Previous office table to refresh
   *
   * @memberOf OfficeDisplayService
   */
  _createOfficeTable = async (instanceDefinition, context, startCell, officeTableId, prevOfficeTable) => {
    const { rows, columns, mstrTable } = instanceDefinition;
    const { isCrosstab, toCrosstabChange, fromCrosstabChange, prevCrosstabDimensions, crosstabHeaderDimensions } = mstrTable;
    const { rowsX: prevRowsX, columnsY: prevColumnsY } = prevCrosstabDimensions;
    const { rowsX, columnsY } = crosstabHeaderDimensions;
    let range;
    const sheet = prevOfficeTable
      ? prevOfficeTable.worksheet
      : context.workbook.worksheets.getActiveWorksheet();
    let tableStartCell = officeApiHelper.getTableStartCell({ startCell, sheet, instanceDefinition, prevOfficeTable, toCrosstabChange, fromCrosstabChange });
    if (prevCrosstabDimensions && prevCrosstabDimensions !== crosstabHeaderDimensions && isCrosstab) {
      tableStartCell = officeApiHelper.offsetCellBy(tableStartCell, columnsY - prevColumnsY, rowsX - prevRowsX);
    }
    const tableRange = officeApiHelper.getRange(columns, tableStartCell, rows);
    if (isCrosstab) {
      range = officeApiHelper.getCrosstabRange(tableStartCell, crosstabHeaderDimensions, sheet);
    } else {
      range = sheet.getRange(tableRange);
    }
    context.trackedObjects.add(range);
    if (prevOfficeTable) {
      prevOfficeTable.rows.load('count');
      await context.sync();
      const addedColumns = Math.max(0, columns - prevOfficeTable.columns.count);
      const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);

      if (addedColumns) {
        const rightRange = prevOfficeTable
          .getRange()
          .getColumnsAfter(addedColumns);
        await this._checkRangeValidity(context, rightRange);
      }

      if (addedRows) {
        const bottomRange = prevOfficeTable
          .getRange()
          .getRowsBelow(addedRows)
          .getResizedRange(0, addedColumns);
        await this._checkRangeValidity(context, bottomRange);
      }

      context.runtime.enableEvents = false;
      await context.sync();
      prevOfficeTable.delete();
      context.runtime.enableEvents = true;
      await context.sync();
    } else {
      await this._checkRangeValidity(context, range);
    }
    if (isCrosstab) {
      officeApiHelper.createColumnsHeaders(tableStartCell, mstrTable.headers.columns, sheet, range);
      officeApiHelper.createRowsTitleHeaders(tableStartCell, mstrTable.attributesNames, sheet, crosstabHeaderDimensions);
    }
    const officeTable = sheet.tables.add(tableRange, true);
    this._styleHeaders(officeTable, TABLE_HEADER_FONT_COLOR, TABLE_HEADER_FILL_COLOR);
    try {
      officeTable.load('name');
      officeTable.name = officeTableId;
      if (isCrosstab) {
        officeTable.showFilterButton = false;
        officeTable.showHeaders = false;
      } else {
        officeTable.getHeaderRowRange().values = [
          mstrTable.headers.columns[mstrTable.headers.columns.length - 1],
        ];
      }
      sheet.activate();
      await context.sync();
      return officeTable;
    } catch (error) {
      await context.sync();
      throw error;
    }
  };

  _updateOfficeTable = async (
    instanceDefinition,
    context,
    startCell,
    prevOfficeTable,
  ) => {
    try {
      const { rows, mstrTable } = instanceDefinition;
      const { isCrosstab, subtotalsAddresses } = mstrTable;
      const crosstabHeaderDimensions = this._getCrosstabHeaderDimensions(instanceDefinition);

      prevOfficeTable.rows.load('count');
      await context.sync();
      if (subtotalsAddresses.length) await this.applySubtotalFormatting(isCrosstab, subtotalsAddresses, prevOfficeTable, context, mstrTable, false);
      const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);
      // If the new table has more rows during update check validity
      if (addedRows) {
        const bottomRange = prevOfficeTable.getRange().getRowsBelow(addedRows);
        await this._checkRangeValidity(context, bottomRange);
      }

      if (mstrTable.isCrosstab) {
        try {
          const range = officeApiHelper.getCrosstabRange(startCell, crosstabHeaderDimensions, prevOfficeTable.worksheet);
          officeApiHelper.createColumnsHeaders(startCell, mstrTable.headers.columns, prevOfficeTable.worksheet, range);
          officeApiHelper.createRowsTitleHeaders(startCell, mstrTable.attributesNames, prevOfficeTable.worksheet, crosstabHeaderDimensions);
        } catch (error) {
          console.log(error);
        }
      }
      context.workbook.application.suspendApiCalculationUntilNextSync();
      prevOfficeTable.clearFilters();
      prevOfficeTable.sort.clear();
      if (!mstrTable.isCrosstab) {
        prevOfficeTable.getHeaderRowRange().values = [
          mstrTable.headers.columns[mstrTable.headers.columns.length - 1],
        ];
      }
      await context.sync();
      await this._updateRows(prevOfficeTable, context, rows);
      return prevOfficeTable;
    } catch (error) {
      await context.sync();
      throw error;
    }
  };

  _getCrosstabHeaderDimensions = (instanceDefinition) => {
    const { mstrTable } = instanceDefinition;
    const { isCrosstab, headers } = mstrTable;
    return {
      columnsY: isCrosstab ? headers.columns.length : 0,
      columnsX: isCrosstab ? headers.columns[0].length : 0,
      rowsX: isCrosstab ? (headers.rows[0].length || 1) : 0, // if there is no attributes in rows we need to setup 1 for offset for column attributes names
      rowsY: isCrosstab ? instanceDefinition.rows : 0,
    };
  }

  _updateRows = async (prevOfficeTable, context, rows) => {
    const tableRows = prevOfficeTable.rows;
    tableRows.load('count');
    await context.sync();
    const tableRowCount = tableRows.count;
    // Delete extra rows if new report is smaller
    if (rows < tableRowCount) {
      prevOfficeTable
        .getRange()
        .getRow(rows + 1)
        .getResizedRange(tableRowCount - rows, 0)
        .clear();
      await context.sync();
      tableRows.load('items');
      await context.sync();
      const rowsToRemove = tableRows.items;
      for (let i = tableRowCount - 1; i >= rows; i--) {
        rowsToRemove[i].delete();
        if (i === rows || i % CONTEXT_LIMIT === 0) {
          await context.sync();
        }
      }
    }
  }

  _styleHeaders = (officeTable, fontColor, fillColor) => {
    officeTable.style = DEFAULT_TABLE_STYLE;
    // Temporarily disabling header formatting
    // const headerRowRange = officeTable.getHeaderRowRange();
    // headerRowRange.format.fill.color = fillColor;
    // headerRowRange.format.font.color = fontColor;
  };

  /**
   * Function closes popup; used when  importing report
   * it swallows error from office if dialog has been closed by user
   *
   * @memberOf OfficeDisplayService
   */
  _dispatchPrintFinish = () => {
    const reduxStoreState = reduxStore.getState();
    reduxStore.dispatch({ type: officeProperties.actions.popupHidden });
    reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
    try {
      reduxStoreState.sessionReducer.dialog.close();
    } catch (err) {
      if (!err.includes(ERROR_POPUP_CLOSED)) {
        throw err;
      }
    }
  }

  _addToStore = ({
    isRefresh,
    instanceDefinition: { mstrTable },
    bindingId,
    projectId,
    envUrl,
    body,
    objectType,
    isCrosstab,
    isPrompted,
    promptsAnswers,
    importSubtotal,
    subtotalsAddresses,
    visualizationInfo,
  }) => {
    const report = {
      id: mstrTable.id,
      name: mstrTable.name,
      bindId: bindingId,
      projectId,
      envUrl,
      body,
      isLoading: false,
      objectType,
      isPrompted,
      isCrosstab,
      importSubtotal,
      subtotalsAddresses,
      promptsAnswers,
      crosstabHeaderDimensions: mstrTable.crosstabHeaderDimensions,
      visualizationInfo,
    };
    officeStoreService.saveAndPreserveReportInStore(report, isRefresh);
  }

  _applyFormatting = async (
    officeTable,
    instanceDefinition,
    isCrosstab,
    excelContext,
  ) => {
    try {
      console.time('Apply formatting');
      officeApiHelper.formatNumbers(officeTable,
        instanceDefinition.mstrTable,
        isCrosstab);
      await excelContext.sync();
    } catch (error) {
      // TODO: Inform the user?
      console.log('Cannot apply formatting, skipping');
    } finally {
      console.timeEnd('Apply formatting');
    }
  }

  _getOfficeTable = async (isRefresh, excelContext, bindingId, instanceDefinition, startCell) => {
    console.time('Create or get table');
    const newOfficeTableId = bindingId || officeApiHelper.findAvailableOfficeTableId();
    const { mstrTable, columns, rows } = instanceDefinition;
    const { prevCrosstabDimensions, isCrosstab } = mstrTable;
    let officeTable;
    let shouldFormat = true;
    let tableColumnsChanged;
    if (isRefresh) {
      const prevOfficeTable = await officeApiHelper.getTable(excelContext,
        bindingId);
      prevOfficeTable.showHeaders = true;
      await excelContext.sync();
      tableColumnsChanged = await this._checkColumnsChange(prevOfficeTable, excelContext, instanceDefinition);
      mstrTable.toCrosstabChange = !prevCrosstabDimensions && isCrosstab;
      mstrTable.fromCrosstabChange = prevCrosstabDimensions && !isCrosstab;
      const headerCell = prevOfficeTable.getHeaderRowRange().getCell(0, 0);
      headerCell.load('address');
      await excelContext.sync();
      startCell = officeApiHelper.getStartCell(headerCell.address);
      officeApiHelper.getRange(columns, startCell, rows);
      if (prevCrosstabDimensions) {
        officeApiHelper.clearCrosstabRange(prevOfficeTable, prevCrosstabDimensions, excelContext);
      }
      await excelContext.sync();
      if (tableColumnsChanged) {
        console.log('Instance definition changed, creating new table');
        officeTable = await this._createOfficeTable(instanceDefinition, excelContext, startCell, newOfficeTableId, prevOfficeTable);
      } else {
        shouldFormat = false;
        console.time('Validate existing table');
        officeTable = await this._updateOfficeTable(instanceDefinition, excelContext, startCell, prevOfficeTable);
        console.timeEnd('Validate existing table');
      }
    } else {
      officeTable = await this._createOfficeTable(instanceDefinition, excelContext, startCell, newOfficeTableId);
    }
    console.timeEnd('Create or get table');
    return {
      officeTable,
      newOfficeTableId,
      shouldFormat,
      tableColumnsChanged,
    };
  }

  applySubtotalFormatting = async (isCrosstab, subtotalsAddresses, officeTable, excelContext, mstrTable, shouldbold = true) => {
    console.time('Subtotal Formatting');
    if (isCrosstab) { subtotalsAddresses = new Set(subtotalsAddresses); }
    const reportstartCell = officeTable.getRange().getCell(0, 0);
    excelContext.trackedObjects.add(reportstartCell);
    await officeApiHelper.formatSubtotals(reportstartCell, subtotalsAddresses, mstrTable, excelContext, shouldbold);
    excelContext.trackedObjects.remove(reportstartCell);
    console.timeEnd('Subtotal Formatting');
  }

  async _fetchInsertDataIntoExcel({ connectionData, officeData, instanceDefinition, isRefresh, tableColumnsChanged, visualizationInfo }) {
    try {
      const { objectId, projectId, dossierData, mstrObjectType } = connectionData;
      const { excelContext, officeTable } = officeData;
      const { columns, rows, mstrTable } = instanceDefinition;
      const limit = Math.min(Math.floor(DATA_LIMIT / columns),
        IMPORT_ROW_LIMIT);
      const configGenerator = {
        instanceDefinition, objectId, projectId, mstrObjectType, dossierData, limit, visualizationInfo,
      };
      const rowGenerator = getObjectContentGenerator(configGenerator);
      let rowIndex = 0;
      let contextPromises = [];
      const subtotalsAddresses = [];
      console.time('Fetch data');
      // eslint-disable-next-line no-restricted-syntax, no-unused-vars
      for await (const { row, header, subtotalAddress } of rowGenerator) {
        console.groupCollapsed(`Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`);
        console.timeEnd('Fetch data');
        excelContext.workbook.application.suspendApiCalculationUntilNextSync();
        console.group('Append rows');
        await this._appendRowsToTable(officeTable, row, rowIndex, isRefresh, tableColumnsChanged, excelContext);
        console.groupEnd('Append rows');
        if (mstrTable.isCrosstab) {
          console.time('Append crosstab rows');
          this._appendCrosstabRowsToRange(officeTable, header.rows, rowIndex, isRefresh, excelContext);
          contextPromises.push(excelContext.sync());
          console.timeEnd('Append crosstab rows');
        }
        console.time('Get subtotals coordinates');
        for (let i = 0; i < subtotalAddress.length; i += 1) {
          // eslint removed Boolean(subtotalAddress[i])
          if (subtotalAddress[i]) subtotalsAddresses.push(subtotalAddress[i]);
        }
        console.timeEnd('Get subtotals coordinates');
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
      }
      console.timeEnd('Fetch and insert into excel');
      console.time('Context sync');
      await Promise.all(contextPromises);
      console.timeEnd('Context sync');
      console.time('Column auto size');
      await officeApiHelper.formatTable(officeTable, mstrTable.isCrosstab, mstrTable.crosstabHeaderDimensions, excelContext);
      console.timeEnd('Column auto size');
      if (mstrTable.isCrosstab) officeTable.showHeaders = false;
      await excelContext.sync();
      return { officeTable, subtotalsAddresses };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  _appendCrosstabRowsToRange = (officeTable, headerRows, rowIndex) => {
    const startCell = officeTable
      .getDataBodyRange()
      .getRow(0)
      .getCell(0, 0)
      .getOffsetRange(rowIndex, 0);
    officeApiHelper.createRowsHeaders(startCell, headerRows);
  }

  _appendRowsToTable = async (officeTable, excelRows, rowIndex, isRefresh = false, tableColumnsChanged, excelContext) => {
    console.time('Split Rows');
    let splitExcelRows = [excelRows];
    if (this.sizeOfObject(excelRows) > 5) splitExcelRows = this.splitExcelRows(excelRows);
    console.timeEnd('Split Rows');
    // Get resize range: The number of rows/cols by which to expand the bottom-right corner,
    // relative to the current range.
    for (let i = 0; i < splitExcelRows.length; i += 1) {
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      const rowRange = officeTable
        .getDataBodyRange()
        .getRow(rowIndex)
        .getResizedRange(splitExcelRows[i].length - 1, 0);
      rowIndex += splitExcelRows[i].length;
      if (!tableColumnsChanged && isRefresh) rowRange.clear('Contents');
      rowRange.values = splitExcelRows[i];
      console.time(`Sync for ${splitExcelRows[i].length} rows`);
      await excelContext.sync();
      console.timeEnd(`Sync for ${splitExcelRows[i].length} rows`);
    }
  }

  /**
   * Split Excel Rows into chunks that meets limit of 5MB
   *
   * @param {Array} excelRows Array of table data
   * @returns {Array} Array with sub-arrays with size not more than 5MB
   * @memberof officeDisplayService
   */
  splitExcelRows = (excelRows) => {
    let splitRows = [excelRows];
    let isFitSize = false;
    do {
      const tempSplit = [];
      let changed = false;
      for (let i = 0; i < splitRows.length; i += 1) {
        // 5 MB is a limit for excel
        if (this.sizeOfObject(splitRows[i]) > 5) {
          const { length } = splitRows[i];
          tempSplit.push(splitRows[i].slice(0, length / 2));
          tempSplit.push(splitRows[i].slice(length / 2, length));
          changed = true;
        } else {
          tempSplit.push(splitRows[i]);
        }
      }
      splitRows = [...tempSplit];
      if (!changed) isFitSize = true;
    } while (!isFitSize);
    return splitRows;
  }

  /**
   * Check size of passed object in MB
   *
   * @param {Object} object Item to check size of
   * @returns {number} Size of passed object in MB
   * @memberof officeDisplayService
   */
  sizeOfObject = (object) => {
    const objectList = [];
    const stack = [object];
    let bytes = 0;
    while (stack.length) {
      const value = stack.pop();
      if (typeof value === 'boolean') {
        bytes += 4;
      } else if (typeof value === 'string') {
        bytes += value.length * 2;
      } else if (typeof value === 'number') {
        bytes += 8;
      } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
        objectList.push(value);
        for (const i in value) {
          stack.push(value[i]);
        }
      }
    }
    // Formating bytes to MB in decimal
    return bytes / 1000000;
  }

  _checkColumnsChange = async (prevOfficeTable, context, instanceDefinition) => {
    const { columns } = instanceDefinition;
    const tableColumns = prevOfficeTable.columns;
    tableColumns.load('count');
    await context.sync();
    const tableColumnsCount = tableColumns.count;
    return columns !== tableColumnsCount;
  };

  _checkRangeValidity = async (context, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await context.sync();
    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError(TABLE_OVERLAP);
    }
  };

  _answerPrompts = async (instanceDefinition, objectId, projectId, promptsAnswers, dossierData, body) => {
    try {
      let count = 0;
      while (instanceDefinition.status === 2) {
        const config = { objectId, projectId, instanceId: instanceDefinition.instanceId, promptsAnswers: promptsAnswers[count] };
        await answerPrompts(config);
        const configInstance = { objectId, projectId, dossierData, body, instanceId: instanceDefinition.instanceId };
        instanceDefinition = await modifyInstance(configInstance);
        count += 1;
      }
      return instanceDefinition;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const officeDisplayService = new OfficeDisplayService();
export default officeDisplayService;
