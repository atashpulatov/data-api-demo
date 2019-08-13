import uuid from 'uuid/v4';
import {IncorrectInputTypeError} from './incorrect-input-type';
import {OutsideOfRangeError} from '../error/outside-of-range-error';
import {reduxStore} from '../store';
import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';
import mstrNormalizedJsonHandler from '../mstr-object/mstr-normalized-json-handler';
import {CONTEXT_LIMIT} from '../mstr-object/mstr-object-rest-service';

const ALPHABET_RANGE_START = 1;
const ALPHABET_RANGE_END = 26;
const ASCII_CAPITAL_LETTER_INDEX = 65;
const EXCEL_TABLE_NAME = 'table';
const EXCEL_ROW_LIMIT = 1048576;
const EXCEL_COL_LIMIT = 16384;
const EXCEL_XTABS_BORDER_COLOR = '#a5a5a5';

class OfficeApiHelper {
  getRange = (headerCount, startCell, rowCount = 0) => {
    if (!Number.isInteger(headerCount)) {
      throw new IncorrectInputTypeError();
    }
    const startCellArray = startCell.split(/(\d+)/);
    headerCount += parseInt(this.lettersToNumber(startCellArray[0]) - 1);
    const endColumnNum = headerCount;
    let endColumn = '';
    for (let firstNumber = ALPHABET_RANGE_START,
      secondNumber = ALPHABET_RANGE_END;
      (headerCount -= firstNumber) >= 0;
      firstNumber = secondNumber, secondNumber *= ALPHABET_RANGE_END) {
      endColumn = String.fromCharCode(parseInt(
          (headerCount % secondNumber) / firstNumber)
        + ASCII_CAPITAL_LETTER_INDEX)
        + endColumn;
    }
    const endRow = Number(startCellArray[1]) + rowCount;
    if (endRow > EXCEL_ROW_LIMIT || endColumnNum > EXCEL_COL_LIMIT) {
      throw new OutsideOfRangeError('The table you try to import exceeds the worksheet limits.');
    }
    return `${startCell}:${endColumn}${endRow}`;
  }

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
  }

  offsetCellBy = (cell, rowOffset, colOffset) => {
    const cellArray = cell.split(/(\d+)/);
    const [column, row] = cellArray;
    const endRow = parseInt(row) + parseInt(rowOffset);
    const endColumn = this.numberToLetters(parseInt(this.lettersToNumber(column) + colOffset));
    return `${endColumn}${endRow}`;
  }

  handleOfficeApiException = (error) => {
    console.error('error: ' + error);
    if (error instanceof OfficeExtension.Error) {
      console.error('Debug info: ' + JSON.stringify(error.debugInfo));
    } else {
      throw error;
    }
  }

  lettersToNumber = (letters) => {
    if (!letters.match(/^[A-Z]*[A-Z]$/)) {
      throw new IncorrectInputTypeError();
    }
    return letters.split('').reduce((r, a) =>
      r * ALPHABET_RANGE_END + parseInt(a, 36) - 9, 0);
  }

  onBindingObjectClick = async (bindingId, shouldSelect = true) => {
    try {
      const excelContext = await this.getExcelContext();
      const tableRange = this.getBindingRange(excelContext, bindingId);
      shouldSelect && tableRange.select();
      await excelContext.sync();
      return true;
    } catch (error) {
      if (error.code === 'ItemNotFound') {
        return notificationService.displayNotification('info', 'The object does not exist in the metadata.');
      }
      const errorAfterOfficeFactory = errorService.errorOfficeFactory(error);
      errorService.handleOfficeError(errorAfterOfficeFactory);
      return false;
    }
  };

  getBindingRange = (context, bindingId) => {
    try {
      return context.workbook.bindings
          .getItem(bindingId).getTable()
          .getRange();
    } catch (error) {
      throw errorService.errorOfficeFactory(error);
    }
  }

  getTable = (context, bindingId) => {
    return context.workbook.bindings
        .getItem(bindingId).getTable();
  }

  getExcelContext = async () => {
    // https://docs.microsoft.com/en-us/javascript/api/excel/excel.runoptions?view=office-js
    return await Excel.run({delayForCellEdit: true}, async (context) => {
      return context;
    });
  }

  getOfficeContext = async () => {
    return await Office.context;
  }

  getExcelSessionStatus = async () => {
    // ToDo find better way to check session status
    return await this.getExcelContext() ? true : false;
  }

  findAvailableOfficeTableId = () => {
    return EXCEL_TABLE_NAME + uuid().split('-').join('');
  }

  loadExistingReportBindingsExcel = async () => {
    const reportArray = await officeStoreService._getReportProperties();
    reduxStore.dispatch({
      type: officeProperties.actions.loadAllReports,
      reportArray,
    });
  };

  getCurrentMstrContext = () => {
    const envUrl = reduxStore.getState().sessionReducer.envUrl;
    const username = reduxStore.getState().sessionReducer.username;
    return {envUrl, username};
  }

  formatTable = (table, isCrosstab, crosstabHeaderDimensions) => {
    if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
      if (isCrosstab) {
        const {rowsX} = crosstabHeaderDimensions;
        table.getDataBodyRange().format.autofitColumns();
        table.getDataBodyRange().getColumnsBefore(rowsX).format.autofitColumns();
      } else {
        table.getDataBodyRange().format.autofitColumns();
      }
    } else {
      notificationService.displayNotification('warning', `Unable to format table.`);
    }
  }

  formatNumbers = (table, reportConvertedData, isCrosstab) => {
    const {columnInformation} = reportConvertedData;
    let filteredColumnInformation;
    if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
      try {
        const columns = table.columns;
        if (isCrosstab) {
          filteredColumnInformation = columnInformation.filter((e) => {// we store attribute informations in column information in crosstab attributes are in headers not excel table so we dont need them here.
            if (e.isAttribute === false) return e;
          });
        } else {
          filteredColumnInformation = columnInformation;
        }
        const offset = columnInformation.length - filteredColumnInformation.length;
        for (const object of filteredColumnInformation) {
          if (Object.keys(object).length === 0) { // Skips iteration if object is emptys
            continue;
          }

          const columnRange = columns.getItemAt(object.index - offset).getDataBodyRange();
          let format = '';
          if (!object.isAttribute) {
            if (object.category === 9) {
              format = this._getNumberFormattingCategoryName(object);
            } else {
              format = object.formatString;

              if (format.indexOf('$') !== -1) {
                // Normalizing formatString from MicroStrategy when locale codes are used [$-\d+]
                format = format.replace(/\[\$-/g, '[$$$$-').replace(/\$/g, '\\$').replace(/\\\$\\\$/g, '$').replace(/"/g, '');
              }

              // for fractions set General format
              object.formatString.match(/# \?+?\/\?+?/) && (format = 'General');
            }
          }
          columnRange.numberFormat = format;
        }
      } catch (error) {
        throw errorService.handleError(error);
      }
    }
  }

  _getNumberFormattingCategoryName = (metric) => {
    switch (metric.category) {
      case -2:
        return 'Default';
      case 9:
        return 'General';
      case 0:
        return 'Fixed';
      case 1:
        return 'Currency';
      case 2:
        return 'Date';
      case 3:
        return 'Time';
      case 4:
        return 'Percentage';
      case 5:
        return 'Fraction';
      case 6:
        return 'Scientific';
      case 7: // 'Custom'
        return metric.formatString;
      case 8:
        return 'Special';
      default:
        return 'General';
    }
  }

  getSelectedCell = async (context) => {
    const selectedRangeStart = context.workbook.getSelectedRange().getCell(0, 0);
    selectedRangeStart.load(officeProperties.officeAddress);
    await context.sync();
    const startCell = this.getStartCell(selectedRangeStart.address);
    return startCell;
  }

  getStartCell = (excelAdress) => {
    return excelAdress.match(/!(\w+\d+)(:|$)/)[1];
  }

  bindNamedItem = (namedItem, bindingId) => {
    return new Promise((resolve, reject) => Office.context.document.bindings.addFromNamedItemAsync(
        namedItem, 'table', {id: bindingId}, (result) => {
          if (result.status === 'succeeded') {
            console.log('Added new binding with type: ' + result.value.type + ' and id: ' + result.value.id);
            resolve();
          } else {
            console.error('Error: ' + result.error.message);
            reject(result.error);
          }
        }));
  }

  deleteObjectTableBody = async (context, object) => {
    try {
      context.runtime.enableEvents = false;
      await context.sync();
      const tableObject = context.workbook.tables.getItem(object.bindId);
      const tableRange = tableObject.getDataBodyRange();
      tableRange.clear(Excel.ClearApplyTo.contents);
      context.runtime.enableEvents = true;
      await context.sync();
    } catch (error) {
      console.error('Error: ' + error);
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
    const {columnsY, columnsX, rowsX, rowsY} = headerDimensions;
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
    const {columnsY, rowsX} = headerDimensions;

    const validColumnsY = await this.getValidOffset(table, columnsY, 'getRowsAbove', context);
    const validRowsX = await this.getValidOffset(table, rowsX, 'getColumnsBefore', context);

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
   * @param {Object} headerDimensions Contains information about crosstab headers dimensions
   * @param {Office} context Excel context
   * @memberof OfficeApiHelper
   */
  clearCrosstabRange = async (officeTable, headerDimensions, context) => {
    try {
      // Row headers
      const leftRange = officeTable.getRange().getColumnsBefore(headerDimensions.rowsX);
      context.trackedObjects.add(leftRange);
      // Column headers
      const topRange = officeTable.getRange().getRowsAbove(headerDimensions.columnsY);
      context.trackedObjects.add(topRange);
      // Title headers
      const titlesRange = officeTable.getRange().getCell(0, 0).getOffsetRange(0, -1).getResizedRange(-(headerDimensions.columnsY), -(headerDimensions.rowsX - 1));
      context.trackedObjects.add(titlesRange);
      // Check if ranges are valid before clearing
      await context.sync();

      leftRange.clear('contents');
      topRange.clear('contents');
      titlesRange.clear('contents');
      context.trackedObjects.remove([leftRange, topRange, titlesRange]);
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
  getTableStartCell = ({startCell, instanceDefinition, prevOfficeTable, toCrosstabChange, fromCrosstabChange}) => {
    const {mstrTable: {headers, isCrosstab, prevCrosstabDimensions}} = instanceDefinition;
    if (fromCrosstabChange) return this.offsetCellBy(startCell, -prevCrosstabDimensions.columnsY, -prevCrosstabDimensions.rowsX);
    if (!toCrosstabChange && (!isCrosstab || prevOfficeTable)) return startCell;
    const rowOffset = headers.columns.length;
    const colOffset = headers.rows[0].length;
    return this.offsetCellBy(startCell, rowOffset, colOffset);
  }

  /**
   * Gets range of subtotal row based on subtotal cell
   *
   * @param {Office} startCell Starting table body cell
   * @param {Office} cell Starting subtotal row cell
   * @param {Object} mstrTable mstrTable object instance definition
   * @memberof OfficeApiHelper
   * @return {Office} Range of subtotal row
   */
  getSubtotalRange = (startCell, cell, mstrTable) => {
    const {headers} = mstrTable;
    const {axis} = cell;
    let offsets = {};

    if (axis === 'rows') {
      offsets = {
        verticalFirstCell: cell.colIndex,
        horizontalFirstCell: -(headers.rows[0].length - cell.attributeIndex),
        verticalLastCell: cell.colIndex,
        horizontalLastCell: headers.columns[0].length - 1,
      };
    } else if (axis === 'columns') {
      offsets = {
        verticalFirstCell: -((headers.columns.length - cell.attributeIndex) + 1),
        horizontalFirstCell: cell.colIndex,
        verticalLastCell: mstrTable.tableSize.rows,
        horizontalLastCell: cell.colIndex,
      };
    } else { // if not a crosstab
      offsets = {
        verticalFirstCell: cell.rowIndex + 1,
        horizontalFirstCell: cell.attributeIndex,
        verticalLastCell: cell.rowIndex + 1,
        horizontalLastCell: mstrTable.tableSize.columns - 1,
      };
    }
    const firstSubtotalCell = startCell.getOffsetRange(offsets.verticalFirstCell, offsets.horizontalFirstCell);
    const lastSubtotalCell = startCell.getOffsetRange(offsets.verticalLastCell, offsets.horizontalLastCell);
    return firstSubtotalCell.getBoundingRect(lastSubtotalCell);
  }

  /**
   *Sets bold format for all subtotal rows
   *
   * @param {Office} startCell Starting table body cell
   * @param {Office} subtotalCells 2d array of all starting subtotal row cells (each element contains row and colum number of subtotal cell in headers columns)
   * @param {Object} mstrTable mstrTable object instance definition
   * @param {Office} context Excel context
   * @memberof OfficeApiHelper
   * @return {Promise} Context.sync
   */
  formatSubtotals = async (startCell, subtotalCells, mstrTable, context) => {
    let contextPromises = [];
    for (const cell of subtotalCells) {
      const subtotalRowRange = this.getSubtotalRange(startCell, cell, mstrTable);
      subtotalRowRange && (subtotalRowRange.format.font.bold = true);
      contextPromises.push(context.sync());
      if (contextPromises.length % CONTEXT_LIMIT === 0) {
        await Promise.all(contextPromises);
        contextPromises = [];
      }
    };
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
    const columnOffset = 0;
    const rowOffset = rows[0].length;
    // reportStartingCell.unmerge(); // excel api have problem with handling merged cells which are partailly in range, we unmerged selected cell to avoid this problem
    const startingCell = reportStartingCell.getCell(0, 0).getOffsetRange(-columnOffset, -rowOffset); // we call getCell in case multiple cells are selected
    const headerArray = mstrNormalizedJsonHandler._transposeMatrix(rows);
    const headerRange = startingCell.getResizedRange(headerArray[0].length - 1, headerArray.length - 1);
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
    // reportStartingCell.unmerge(); // excel api have problem with handling merged cells which are partailly in range, we unmerged selected cell to avoid this problem
    const startingCell = reportStartingCell.getCell(0, 0).getOffsetRange(-columnOffset, -rowOffset);// we call getCell in case multiple cells are selected
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
  createRowsTitleHeaders = async (cellAddress, attributesNames, sheet, crosstabHeaderDimensions) => {
    const reportStartingCell = sheet.getRange(cellAddress);
    const titlesBottomCell = reportStartingCell.getOffsetRange(0, -1);
    const rowsTitlesRange = titlesBottomCell.getResizedRange(0, -(crosstabHeaderDimensions.rowsX - 1));
    const columnssTitlesRange = titlesBottomCell.getOffsetRange(-1, 0).getResizedRange(-(crosstabHeaderDimensions.columnsY - 1), 0);

    const headerTitlesRange = columnssTitlesRange.getBoundingRect(rowsTitlesRange);
    headerTitlesRange.format.verticalAlignment = Excel.VerticalAlignment.bottom;
    this.formatCrosstabRange(headerTitlesRange);
    headerTitlesRange.values = '  ';

    rowsTitlesRange.values = [attributesNames.rowsAttributes];
    columnssTitlesRange.values = mstrNormalizedJsonHandler._transposeMatrix([attributesNames.columnsAttributes]);
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
    headerRange.values = headerArray;
    const hAlign = axis === 'rows' ? 'left' : 'center';
    headerRange.format.horizontalAlignment = Excel.HorizontalAlignment[hAlign];
    headerRange.format.verticalAlignment = Excel.VerticalAlignment.top;
    this.formatCrosstabRange(headerRange);
  }

  /**
   * Format crosstab range
   *
   * @param {Office} range Range of the header
   * @memberof OfficeApiHelper
   */
  formatCrosstabRange(range) {
    range.format.borders.getItem('EdgeTop').color = EXCEL_XTABS_BORDER_COLOR;
    range.format.borders.getItem('EdgeRight').color = EXCEL_XTABS_BORDER_COLOR;
    range.format.borders.getItem('EdgeBottom').color = EXCEL_XTABS_BORDER_COLOR;
    range.format.borders.getItem('EdgeLeft').color = EXCEL_XTABS_BORDER_COLOR;
    range.format.borders.getItem('InsideVertical').color = EXCEL_XTABS_BORDER_COLOR;
    range.format.borders.getItem('InsideHorizontal').color = EXCEL_XTABS_BORDER_COLOR;
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
          currentCell.getResizedRange(offsetForMoving2, offsetForMoving1).merge(); // increasing size of selected range for cells that will be merged
        }
        currentCell = currentCell.getOffsetRange(offsetForMoving2, offsetForMoving1); // moving to next attributr value (cell)
      }
      startingCell = startingCell.getOffsetRange(offsetForMoving1, offsetForMoving2); // moving to next attribute (row/column)
    }
  }
}

export const officeApiHelper = new OfficeApiHelper();
