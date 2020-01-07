/* eslint-disable */
import uuid from 'uuid/v4';
import {IncorrectInputTypeError} from './incorrect-input-type';
import {OutsideOfRangeError} from '../error/outside-of-range-error';
import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';
import mstrNormalizedJsonHandler from '../mstr-object/mstr-normalized-json-handler';
import {CONTEXT_LIMIT} from '../mstr-object/mstr-object-rest-service';
import {authenticationHelper} from '../authentication/authentication-helper';
import {OBJ_REMOVED_FROM_EXCEL} from '../error/constants';
import {ProtectedSheetError} from '../error/protected-sheets-error';

const ALPHABET_RANGE_START = 1;
const ALPHABET_RANGE_END = 26;
const ASCII_CAPITAL_LETTER_INDEX = 65;
const EXCEL_TABLE_NAME = 'table';
const EXCEL_ROW_LIMIT = 1048576;
const EXCEL_COL_LIMIT = 16384;

const EXCEL_XTABS_BORDER_COLOR = '#a5a5a5';

const {OfficeExtension} = window;

export class OfficeApiHelper {
  constructor() {
    this.EXCEL_XTABS_BORDER_COLOR = EXCEL_XTABS_BORDER_COLOR;
  }

  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  getRange = (headerCount, startCell, rowCount = 0) => {
    if (!Number.isInteger(headerCount)) {
      throw new IncorrectInputTypeError();
    }
    const startCellArray = startCell.split(/(\d+)/);
    headerCount += parseInt(this.lettersToNumber(startCellArray[0]) - 1, 10);
    const endColumnNum = headerCount;
    let endColumn = '';
    for (let firstNumber = ALPHABET_RANGE_START,
      secondNumber = ALPHABET_RANGE_END;
      (headerCount -= firstNumber) >= 0;
      firstNumber = secondNumber, secondNumber *= ALPHABET_RANGE_END) {
      endColumn = String.fromCharCode(parseInt((headerCount % secondNumber) / firstNumber)
        + ASCII_CAPITAL_LETTER_INDEX)
        + endColumn;
    }
    const endRow = Number(startCellArray[1]) + rowCount;
    if (endRow > EXCEL_ROW_LIMIT || endColumnNum > EXCEL_COL_LIMIT) {
      throw new OutsideOfRangeError('The table you try to import exceeds the worksheet limits.');
    }
    return `${startCell}:${endColumn}${endRow}`;
  };

  numberToLetters = (colNum) => {
    let colLetter = '';
    let firstNumber = ALPHABET_RANGE_START;
    let secondNumber = ALPHABET_RANGE_END;
    for (firstNumber, secondNumber; (colNum -= firstNumber) >= 0; firstNumber = secondNumber, secondNumber *= ALPHABET_RANGE_END) {
      colLetter = String.fromCharCode(parseInt((colNum % secondNumber) / firstNumber)
        + ASCII_CAPITAL_LETTER_INDEX)
        + colLetter;
    }
    return colLetter;
  };

  offsetCellBy = (cell, rowOffset, colOffset) => {
    const cellArray = cell.split(/(\d+)/);
    const [column, row] = cellArray;
    const endRow = parseInt(row, 10) + parseInt(rowOffset, 10);
    const endColumn = this.numberToLetters(parseInt(this.lettersToNumber(column) + colOffset, 10));
    return `${endColumn}${endRow}`;
  }

  handleOfficeApiException = (error) => {
    console.error(`error: ${error}`);
    if (error instanceof window.OfficeExtension.Error) {
      console.error(`Debug info: ${JSON.stringify(error.debugInfo)}`);
    } else {
      throw error;
    }
  }

  lettersToNumber = (letters) => {
    if (!letters.match(/^[A-Z]*[A-Z]$/)) {
      throw new IncorrectInputTypeError();
    }
    return letters.split('').reduce((r, a) => r * ALPHABET_RANGE_END + parseInt(a, 36) - 9, 0);
  }

  onBindingObjectClick = async (bindingId, shouldSelect = true, deleteReport, chosenObjectName, isCrosstab, crosstabHeaderDimensions) => {
    let crosstabRange;
    try {
      const excelContext = await this.getExcelContext();
      const tableObject = excelContext.workbook.tables.getItem(bindingId);
      if (isCrosstab) {
        const tmpXtabDimensions = {...crosstabHeaderDimensions, columnsY: crosstabHeaderDimensions.columnsY + 1, };
        crosstabRange = await this.getCrosstabRangeSafely(tableObject, tmpXtabDimensions, excelContext);
        if (shouldSelect) crosstabRange.select();
      } else {
        const tableRange = this.getBindingRange(excelContext, bindingId);
        if (shouldSelect) tableRange.select();
      }
      await excelContext.sync();
      return true;
    } catch (error) {
      if (error.code === 'ItemNotFound') {
        return notificationService.displayTranslatedNotification({type: 'info', content: OBJ_REMOVED_FROM_EXCEL});
      }
      errorService.handleError(error, {chosenObjectName, onConfirm: deleteReport});
      return false;
    }
  };

  /**
 * checks excel session and auth token
 *
 * @memberof OfficeApiHelper
 */
  checkStatusOfSessions = async () => {
    await Promise.all([
      this.getExcelSessionStatus(),
      authenticationHelper.validateAuthToken(),
    ]);
  }


  getBindingRange = (context, bindingId) => context.workbook.bindings
    .getItem(bindingId).getTable()
    .getRange()

  getTable = (context, bindingId) => context.workbook.bindings
    .getItem(bindingId).getTable()

  getExcelContext = async () => window.Excel.run({ delayForCellEdit: true }, async (context) => context);

  getOfficeContext = async () => window.Office.context

  getExcelSessionStatus = async () => !!await this.getExcelContext() // ToDo find better way to check session status

  findAvailableOfficeTableId = () => EXCEL_TABLE_NAME + uuid().split('-').join('')

  getCurrentMstrContext = () => {
    const {envUrl} = this.reduxStore.getState().sessionReducer;
    const {username} = this.reduxStore.getState().sessionReducer;
    return {envUrl, username};
  }

  /**
   * Returns top left cell of selected range
   *
   * @param {Office} context Excel Context
   * @memberof OfficeApiHelper
   * @return {String} Address of the cell.
   */
  getSelectedCell = async (context) => {
    const selectedRangeStart = context.workbook.getSelectedRange().getCell(0, 0);
    selectedRangeStart.load(officeProperties.officeAddress);
    await context.sync();
    const startCell = this.getStartCell(selectedRangeStart.address);
    return startCell;
  }

  createAndActivateNewWorksheet = async (context) =>  {
      const sheets = context.workbook.worksheets;
      const sheet = sheets.add();
      await context.sync();
      sheet.activate();
      await context.sync();
  }

  getStartCell = (excelAdress) => excelAdress.match(/!(\w+\d+)(:|$)/)[1]

  /**
   * Adds binding to the Excel table
   *
   * @param {Office} namedItem Excel Table
   * @param {String} bindingId
   * @memberof OfficeApiHelper
   */
  bindNamedItem = (namedItem, bindingId) => new Promise((resolve, reject) => {
    window.Office.context.document.bindings.addFromNamedItemAsync(namedItem, 'table', { id: bindingId }, (result) => {
      if (result.status === 'succeeded') {
        console.log(`Added new binding with type: ${result.value.type} and id: ${result.value.id}`);
        resolve();
      } else {
        console.error(`Error: ${result.error.message}`);
        reject(result.error);
      }
    });
  })

    /**
     * Gets range of subtotal row based on subtotal cell
     *
     * @param {Office} object
     * @param {Office} officeContext office context
     * @param {Object} t i18n translating function
     * @memberof OfficeApiHelper
     */
    removeObjectAndDisplaytNotification = (object, officeContext, t) => {
      const { name } = object;
      this.removeObjectNotExistingInExcel(object, officeContext);
      const message = t('{{name}} has been removed from the workbook.', { name });
      notificationService.displayTranslatedNotification({ type: 'success', content: message });
    }

    removeReportFromExcel = async (bindingId, isCrosstab, crosstabHeaderDimensions) => {
      try {
        await authenticationHelper.validateAuthToken();
        const officeContext = await this.getOfficeContext();
        await officeContext.document.bindings.releaseByIdAsync(bindingId, () => { console.log('released binding'); });
        const excelContext = await this.getExcelContext();
        const tableObject = excelContext.workbook.tables.getItem(bindingId);
        this.deleteExcelTable(tableObject, excelContext, isCrosstab, crosstabHeaderDimensions);
        await excelContext.sync();
        return officeStoreService.removeReportFromStore(bindingId);
      } catch (error) {
        if (error.code === 'ItemNotFound') {
          return officeStoreService.removeReportFromStore(bindingId);
        }
        return errorService.handleError(error);
      }
    };

  /**
   * Get object from store based on bindingId and remove it from workbook
   *
   * @param {Office} context Excel Context
   * @param {Object} object Contains information obout the object
   * @param {Boolean} isClear specify if object should be cleared or deleted
   * @memberof OfficeApiHelper
   */
  deleteObjectTableBody = async (context, object, isClear) => {
    const { isCrosstab, crosstabHeaderDimensions } = object;
    const tableObject = context.workbook.tables.getItem(object.bindId);
    await this.deleteExcelTable(tableObject, context, isCrosstab, crosstabHeaderDimensions, isClear);
  }

  /**
   * Remove objects that no longer exists in the Excel workbook from the store
   *
   * @param {Function} t i18n translating function
   * @param {Object} object Contains information obout the object
   * @param {Office} officeContext Excel context
   * @memberof OfficeApiHelper
   */
  removeObjectNotExistingInExcel = async (object, officeContext) => {
    officeStoreService.removeReportFromStore(object.bindId);
    await officeContext.document.bindings.releaseByIdAsync(object.bindId, () => {console.log('released binding');});
  }

  /**
    * Returns excel sheet from specific table
    *
    * @param {Office} excelContext Excel context
    * @param {String} bindId Report bind id
    * @memberof OfficeApiHelper
    */
  getExcelSheetFromTable = async (excelContext, bindId) => {
    try {
      const table = excelContext.workbook.tables.getItem(bindId);
      await excelContext.sync();
      return table.getRange().worksheet;
    } catch (error) {
      return false;
    }
  }

  /**
    * Returns current excel sheet
    *
    * @param {Office} excelContext Excel context
    * @memberof OfficeApiHelper
  */
  getCurrentExcelSheet = (excelContext) => excelContext.workbook.worksheets.getActiveWorksheet()

  /**
    * Returns true if specific worksheet is protected
    *
    * @param {Office} excelContext Excel context
    * @param {Office} sheet Excel Sheet
    * @memberof OfficeApiHelper
  */
  isSheetProtected = async (excelContext, sheet) => {
    sheet.load('protection/protected');
    await excelContext.sync();
    return sheet.protection.protected;
  }

  /**
    * Returns true if specific worksheet is protected
    *
    * @param {Office} excelContext Excel context
    * @param {Array} reportArray array of Mstr Tables
    * @memberof OfficeApiHelper
  */
  checkIfAnySheetProtected = async (excelContext, reportArray) => {
    for (const report of reportArray) {
      const sheet = await this.getExcelSheetFromTable(excelContext, report.bindId);
      if (sheet) {
        await this.isCurrentReportSheetProtected(excelContext, undefined, sheet);
      } else {
        return false;
      }
    }
  }

  /**
      * Get sheet of the table. Return isSheetProtected
      *
      * @param {Office} excelContext Excel context
      * @param {String} report Report object
      * @param {Office} sheet Excel Sheet
      * @memberof OfficeApiHelper
      */
  isCurrentReportSheetProtected = async (excelContext, bindId, sheet) => {
    let isProtected = false;
    if (bindId) {
      const currentExcelSheet = await this.getExcelSheetFromTable(excelContext, bindId);
      if (currentExcelSheet) {
        isProtected = await this.isSheetProtected(excelContext, currentExcelSheet);
      } else {
        isProtected = false;
      }
    } else if (sheet && excelContext) {
      isProtected = await this.isSheetProtected(excelContext, sheet);
    } else {
      const currentSheet = await this.getCurrentExcelSheet(excelContext);
      isProtected = await this.isSheetProtected(excelContext, currentSheet);
    }
    if (isProtected) {
      throw new ProtectedSheetError();
    }
  }


  /**
   * Checks if the object existing in Excel workbook
   *
   * @param {Function} t i18n translating function
   * @param {Object} object Contains information obout the object
   * @param {Office} excelContext Excel context
   * @memberof OfficeApiHelper
   * @return {Boolean}
   */
  checkIfObjectExist = async (object, excelContext) => {
    const officeContext = await this.getOfficeContext();
    try {
      await this.getTable(excelContext, object.bindId);
      await excelContext.sync();
      return true;
    } catch (error) {
      await this.removeObjectNotExistingInExcel(object, officeContext);
      return false;
    }
  }

  /**
   * Gets the total range of crosstab report - it sums table body range and headers ranges
   *
   * @param {Office} cellAddress Starting table body cell
   * @param {Object} headerDimensions Contains information about crosstab headers dimensions
   * @param {Office} sheet Active Exccel spreadsheet
   * @memberof OfficeApiHelper
   * @return {Object}
   */
  getCrosstabRange = (cellAddress, headerDimensions, sheet) => {
    const {columnsY, columnsX, rowsX, rowsY, } = headerDimensions;
    const cell = typeof cellAddress === 'string' ? sheet.getRange(cellAddress) : cellAddress;
    const bodyRange = cell.getOffsetRange(rowsY, columnsX - 1);
    const startingCell = cell.getCell(0, 0).getOffsetRange(-(columnsY), -rowsX);
    return startingCell.getBoundingRect(bodyRange);
  }

  /**
   * Gets the total range of crosstab report - it sums table body range and headers ranges
   *
   * @param {Office} table Excel table
   * @param {Object} headerDimensions Contains information about crosstab headers dimensions
   * @param {Office} context Excel context
   * @memberof OfficeApiHelper
   * @return {Object}
   */
  getCrosstabRangeSafely = async (table, headerDimensions, context) => {
    const { columnsY, rowsX } = headerDimensions;
    const { validColumnsY, validRowsX } = await this.getCrosstabHeadersSafely(table, columnsY, context, rowsX);
    const startingCell = table.getRange().getCell(0, 0).getOffsetRange(-validColumnsY, -validRowsX);
    return startingCell.getBoundingRect(table.getRange());
  }

  /**
   * Gets the biggest valid range by checking axis by axis
   *
   * @param {Office} table Excel table
   * @param {Number} limit Number of rows or columns to check
   * @param {String} getFunction Excel range function 'getRowsAbove'|'getColumnsBefore'
   * @param {Office} context Excel context
   * @memberof OfficeApiHelper
   * @return {Number}
   */
  getValidOffset = async (table, limit, getFunction, context) => {
    for (let i = 0; i <= limit; i++) {
      try {
        table.getRange()[getFunction](i + 1);
        // eslint-disable-next-line no-await-in-loop
        await context.sync();
      } catch (error) {
        return i;
      }
    }
    return limit;
  }

  /**
   * Clears the two crosstab report ranges
   *
   * @param {Office} officeTable Starting table body cell
   * @param {Object} crosstabHeaderDimensions Contains information about crosstab headers dimensions
   * @param {Object} prevheaderDimensions Contains information about previous crosstab headers dimensions
   * @param {Office} context Excel context
   * @memberof OfficeApiHelper
   */
  clearCrosstabRange = async (officeTable, crosstabHeaderDimensions, prevheaderDimensions, isCrosstab, context) => {
    try {
      let leftRange;
      let topRange;
      let titlesRange;

      const { rowsX , columnsY } = prevheaderDimensions;

      if (rowsX) {
        // Row headers
        leftRange = officeTable.getRange().getColumnsBefore(rowsX);
        context.trackedObjects.add(leftRange);
        // Title headers
        titlesRange = officeTable.getRange().getCell(0, 0).getOffsetRange(0, -1).getResizedRange(-(columnsY), -(rowsX - 1));
        context.trackedObjects.add(titlesRange);
      }

      // Column headers
      if (columnsY) {
        topRange = officeTable.getRange().getRowsAbove(columnsY);
        context.trackedObjects.add(topRange);
      }
      // Check if ranges are valid before clearing
      await context.sync();
      if (isCrosstab && (crosstabHeaderDimensions === prevheaderDimensions)) {
        if (columnsY) topRange.clear('contents');
        if (rowsX) {
          leftRange.clear('contents');
          titlesRange.clear('contents');
        }
      } else {
        if (columnsY) topRange.clear();
        if (rowsX) {
          leftRange.clear();
          titlesRange.clear();
        }
      }
      if (columnsY) context.trackedObjects.remove([topRange]);
      if (rowsX) {
        context.trackedObjects.remove([leftRange, titlesRange]);
      }
    } catch (error) {
      officeTable.showHeaders = false;
      throw error;
    }
  }

  /**
   * Returns the new initial cell considering crosstabs
   *
   * @param {Office} cell - Starting table body cell
   * @param {Array} headers - Headers object from OfficeConverterServiceV2.getHeaders
   * @param {Boolean} isCrosstab - When is crosstab we offset the inital cell
   * @memberof OfficeApiHelper
   * @return {Object}
   */
  getTableStartCell = ({ startCell, instanceDefinition, prevOfficeTable }) => {
    const { mstrTable: { isCrosstab, prevCrosstabDimensions, crosstabHeaderDimensions, toCrosstabChange, fromCrosstabChange, } } = instanceDefinition;
    if (fromCrosstabChange) {
      return this.offsetCellBy(startCell, -prevCrosstabDimensions.columnsY, -prevCrosstabDimensions.rowsX);
    }
    if (!toCrosstabChange && (!isCrosstab || prevOfficeTable)) return startCell;
    const rowOffset = crosstabHeaderDimensions.columnsY;
    const colOffset = crosstabHeaderDimensions.rowsX;
    return this.offsetCellBy(startCell, rowOffset, colOffset);
  }

  /**
   *Prepares parameters for createHeaders
   *
   * @param {Office} reportStartingCell Address of the first cell in report (top left)
   * @param {Array} rows Contains headers structure and data
   * @param {Office} context Excel context
   * @memberof OfficeApiHelper
   */
  createRowsHeaders = (reportStartingCell, rows) => {
    const rowOffset = rows[0].length || 1; // we put 1 as offset if there are no attribue in rows
    let headerArray = [];
    // we call getCell in case multiple cells are selected
    const startingCell = reportStartingCell.getCell(0, 0).getOffsetRange(0, -rowOffset);
    headerArray = mstrNormalizedJsonHandler.transposeMatrix(rows);
    // transposed array length is 0 if there is no attributes in rows
    const colOffset = !headerArray.length ? rows.length - 1 : headerArray[0].length - 1;
    const headerRange = startingCell.getResizedRange(colOffset, rowOffset - 1);
    this.insertHeadersValues(headerRange, rows, 'rows');
    // TODO: Move merge cells after we import the whole table
    // const directionVector = [0, 1];
    // this.createHeaders(headerArray, startingCell, directionVector);
  }

  /**
   *Prepares parameters for createHeaders
   *
   * @param {Office} cellAddress Address of the first cell in report (top left)
   * @param {Array} columns Contains headers structure and data
   * @param {Office} sheet Active Exccel spreadsheet
   * @memberof OfficeApiHelper
   * @return {Promise} Context.sync
   */
  createColumnsHeaders = (cellAddress, columns, sheet) => {
    const reportStartingCell = sheet.getRange(cellAddress);
    const columnOffset = columns.length;
    const rowOffset = 0;
    // we call getCell in case multiple cells are selected
    const startingCell = reportStartingCell.getCell(0, 0).getOffsetRange(-columnOffset, -rowOffset);
    const directionVector = [1, 0];
    const headerRange = startingCell.getResizedRange(columns.length - 1, columns[0].length - 1);
    this.insertHeadersValues(headerRange, columns, 'columns');
    return this.createHeaders(columns, startingCell, directionVector);
  }

  /**
  * Create Title headers for crosstab report
  *
  * @param {Office} cellAddress Address of the first cell in report (top left)
  * @param {Object} attributesNames Contains arrays of attributes names in crosstab report
  * @param {Office} sheet Active Exccel spreadsheet
  * @param {Object} crosstabHeaderDimensions Contains dimensions of crosstab report headers
  * @memberof OfficeApiHelper
  */
  createRowsTitleHeaders = (cellAddress, attributesNames, sheet, crosstabHeaderDimensions) => {
    const reportStartingCell = sheet.getRange(cellAddress);
    const titlesBottomCell = reportStartingCell.getOffsetRange(0, -1);
    const rowsTitlesRange = titlesBottomCell.getResizedRange(0, -(crosstabHeaderDimensions.rowsX - 1));
    const columnssTitlesRange = titlesBottomCell.getOffsetRange(-1, 0).getResizedRange(-(crosstabHeaderDimensions.columnsY - 1), 0);

    const headerTitlesRange = columnssTitlesRange.getBoundingRect(rowsTitlesRange);
    headerTitlesRange.format.verticalAlignment = window.Excel.VerticalAlignment.bottom;
    this.formatCrosstabRange(headerTitlesRange);
    headerTitlesRange.values = '  ';

    // we are not inserting row attributes names if they do not exist
    if (attributesNames.rowsAttributes.length) rowsTitlesRange.values = [attributesNames.rowsAttributes];
    columnssTitlesRange.values = mstrNormalizedJsonHandler.transposeMatrix([attributesNames.columnsAttributes]);
  }

  /**
  * Returns the number of rows and columns headers that are valid for crosstab
  *
  * @param {Office} table Excel Object containig information about Excel Table
  * @param {Number} columnsY Contains information about crosstab header columnsY direction
  * @param {Office} context Excel context
  * @param {Number} rowsX Contains information about crosstab header rowsX direction
  * @memberof OfficeApiHelper
  */
  async getCrosstabHeadersSafely(table, columnsY, context, rowsX) {
    const validColumnsY = await this.getValidOffset(table, columnsY, 'getRowsAbove', context);
    const validRowsX = await this.getValidOffset(table, rowsX, 'getColumnsBefore', context);
    return { validColumnsY, validRowsX };
  }

  /**
  * Delete Excel table object from workbook. For crosstab reports will also clear the headers
  *
  * @param {Office} tableObject Address of the first cell in report (top left)
  * @param {Office} context Contains arrays of attributes names in crosstab report
  * @param {Boolean} isCrosstab Specify if object is a crosstab
  * @param {Object} crosstabHeaderDimensions Contains dimensions of crosstab report headers
  * @param {Boolean} isClear Specify if object should be cleared or deleted. False by default
  * @memberof OfficeApiHelper
  */
  async deleteExcelTable(tableObject, context, isCrosstab = false, crosstabHeaderDimensions = {}, isClear = false) {
    context.runtime.enableEvents = false;
    await context.sync();
    const tableRange = tableObject.getDataBodyRange();
    context.trackedObjects.add(tableRange);
    if (isCrosstab) {
      const { rowsX, rowsY, columnsX, columnsY } = crosstabHeaderDimensions;
      this.clearEmptyCrosstabRow(tableObject); // Since showing Excel table header dont override the data but insert new row, we clear values from empty row in crosstab to prevent it
      tableObject.showHeaders = true;
      await context.sync();
      const crosstabRange = await this.getCrosstabRangeSafely(tableObject, crosstabHeaderDimensions, context);

      const firstCell = crosstabRange.getCell(0, 0);
      const columnsHeaders = firstCell.getOffsetRange(0, rowsX).getResizedRange(columnsY - 1, columnsX - 1);
      const rowsHeaders = firstCell.getResizedRange((columnsY + rowsY), rowsX - 1);
      columnsHeaders.clear();
      rowsHeaders.clear();
    }
    tableRange.clear();
    if (!isClear) tableObject.delete();
    context.runtime.enableEvents = true;
    await context.sync();
    context.trackedObjects.remove(tableRange);
  }

  /**
   * Clear previous formatting and insert data in range
   *
   * @param {Office} headerRange Range of the header
   * @param {Array} headerArray Contains rows/headers structure and data
   * @param {String} axis - Axis to apply formatting columns or rows
   * @memberof OfficeApiHelper
   */
  insertHeadersValues(headerRange, headerArray, axis = 'rows') {
    headerRange.clear('contents'); // we are unmerging and removing formatting to avoid conflicts while merging cells
    headerRange.unmerge();
    // if there is no attributes in rows we insert empty string for whole range
    headerRange.values = axis === 'rows' && !headerArray[0].length ? '' : headerArray;
    const hAlign = axis === 'rows' ? 'left' : 'center';
    headerRange.format.horizontalAlignment = window.Excel.HorizontalAlignment[hAlign];
    headerRange.format.verticalAlignment = window.Excel.VerticalAlignment.top;
    this.formatCrosstabRange(headerRange);
  }

  /**
   * Format crosstab range
   *
   * @param {Office} range Range of the header
   * @memberof OfficeApiHelper
   */
  formatCrosstabRange = (range) => {
    const { borders } = range.format;
    borders.getItem('EdgeTop').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('EdgeRight').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('EdgeBottom').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('EdgeLeft').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('InsideVertical').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('InsideHorizontal').color = EXCEL_XTABS_BORDER_COLOR;
  }

  /**
   * Create Headers structure in Excel
   *
   * @param {Array} headerArray Contains rows/headers structure and data
   * @param {Office} startingCell Address of the first cell header (top left)
   * @param {number} directionVector direction vertor for the step size when iterating over cells
   * @memberof OfficeApiHelper
   */
  createHeaders = (headerArray, startingCell, directionVector) => {
    const [offsetForMoving1, offsetForMoving2] = directionVector;
    for (let i = 0; i < headerArray.length - 1; i++) {
      let currentCell = startingCell;
      for (let j = 0; j < headerArray[i].length - 1; j++) {
        if (headerArray[i][j] === headerArray[i][j + 1]) {
          // increasing size of selected range for cells that will be merged
          currentCell.getResizedRange(offsetForMoving2, offsetForMoving1).merge();
        }
        // moving to next attributr value (cell)
        currentCell = currentCell.getOffsetRange(offsetForMoving2, offsetForMoving1);
      }
      // moving to next attribute (row/column)
      startingCell = startingCell.getOffsetRange(offsetForMoving1, offsetForMoving2);
    }
  }

  /**
   * Clear the empty row in Crosstab Report
   *
   * @param {Office} officeTable Excel Object containig information about Excel Table
   * @memberof OfficeApiHelper
   */
  clearEmptyCrosstabRow = (officeTable) => {
    const headerRange = officeTable.getDataBodyRange().getRow(0).getOffsetRange(-1, 0);
    headerRange.clear('Contents');
  }
}

export const officeApiHelper = new OfficeApiHelper();
