import uuid from 'uuid/v4';
import {IncorrectInputTypeError} from './incorrect-input-type';
import {OutsideOfRangeError} from '../error/outside-of-range-error';
import {reduxStore} from '../store';
import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';
import mstrNormalizedJsonHandler from '../mstr-object/mstr-normalized-json-handler';

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

  onBindingObjectClick = async (bindingId) => {
    try {
      const excelContext = await this.getExcelContext();
      const tableRange = this.getBindingRange(excelContext, bindingId);
      tableRange.select();
      return await excelContext.sync();
    } catch (error) {
      if (error.code === 'ItemNotFound') {
        return notificationService.displayNotification('info', 'The object does not exist in the metadata.');
      }
      const errorAfterOfficeFactory = errorService.errorOfficeFactory(error);
      errorService.handleOfficeError(errorAfterOfficeFactory);
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
        table.getRange().format.autofitColumns();
        table.getRange().getColumnsBefore(rowsX).format.autofitColumns();
      } else {
        table.getRange().format.autofitColumns();
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
          } else if (!isCrosstab) {
            if (object.forms.length > 1) {
              format = '@';
            } else {
              format = object.forms[0] === 'text' ? '@' : 'General';
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
    const selectedRangeStart = context.workbook.getSelectedRange();
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
      const tableObject = context.workbook.tables.getItem(object.bindId);
      const tableRange = tableObject.getDataBodyRange();
      tableRange.clear(Excel.ClearApplyTo.contents);
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
    const startingCell = cell.getCell(0, 0).getOffsetRange(-(columnsY - 1), -rowsX);
    return startingCell.getBoundingRect(bodyRange);
  }

  /**
   * Clears the two crosstab report ranges
   *
   * @param {Office} officeTable Starting table body cell
   * @param {Object} headerDimensions Contains information about crosstab headers dimensions
   * @memberof OfficeApiHelper
   */
  clearCrosstabRange = (officeTable, headerDimensions) => {
    try {
      // Remove row headers
      const leftRange = officeTable.getRange().getColumnsBefore(headerDimensions.rowsX);
      leftRange.clear();

      // Remove column headers
      const topRange = officeTable.getRange().getRowsAbove(headerDimensions.columnsY - 1);
      topRange.clear();
    } catch (error) {
      // TODO: Throw no available range error

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
  getTableStartCell = ({startCell, mstrTable, prevOfficeTable}) => {
    const {headers, isCrosstab} = mstrTable;
    if (!isCrosstab || prevOfficeTable) return startCell;
    const rowOffset = headers.columns.length - 1;
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
        verticalFirstCell: cell.colIndex + 1,
        horizontalFirstCell: -(headers.rows[0].length - cell.attributeIndex),
        verticalLastCell: cell.colIndex + 1,
        horizontalLastCell: headers.columns[0].length - 1,
      };
    } else if (axis === 'columns') {
      offsets = {
        verticalFirstCell: -((headers.columns.length - cell.attributeIndex) - 1),
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
  formatSubtotals = (startCell, subtotalCells, mstrTable, context) => {
    for (const cell of subtotalCells) {
      const subtotalRowRange = this.getSubtotalRange(startCell, cell, mstrTable, context);
      subtotalRowRange && (subtotalRowRange.format.font.bold = true);
    };
    return context.sync();
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
    const startingCell = reportStartingCell.getCell(0, 0).getOffsetRange(-(columnOffset - 1), -rowOffset);// we call getCell in case multiple cells are selected
    const directionVector = [1, 0];
    const headerRange = startingCell.getResizedRange(columns.length - 1, columns[0].length - 1);
    this.insertHeadersValues(headerRange, columns, 'columns');

    return this.createHeaders(columns, startingCell, directionVector);
  }
  /**
   * Clear prevoius formatting and insert data in range
   *
   * @param {Office} headerRange Range of the header
   * @param {Array} headerArray Contains rows/headers structure and data
   * @param {String} axis - Axis to apply formatting columns or rows
   * @memberof OfficeApiHelper
   */
  insertHeadersValues(headerRange, headerArray, axis = 'rows') {
    headerRange.clear(); // we are unmerging and removing formatting to avoid conflicts while merging cells
    headerRange.values = headerArray;
    const hAlign = axis === 'rows' ? 'left' : 'center';
    headerRange.numberFormat = '@';
    headerRange.format.horizontalAlignment = Excel.HorizontalAlignment[hAlign];
    headerRange.format.verticalAlignment = Excel.VerticalAlignment.top;
    headerRange.format.borders.getItem('EdgeTop').color = EXCEL_XTABS_BORDER_COLOR;
    headerRange.format.borders.getItem('EdgeRight').color = EXCEL_XTABS_BORDER_COLOR;
    headerRange.format.borders.getItem('EdgeBottom').color = EXCEL_XTABS_BORDER_COLOR;
    headerRange.format.borders.getItem('EdgeLeft').color = EXCEL_XTABS_BORDER_COLOR;
    headerRange.format.borders.getItem('InsideVertical').color = EXCEL_XTABS_BORDER_COLOR;
    headerRange.format.borders.getItem('InsideHorizontal').color = EXCEL_XTABS_BORDER_COLOR;
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
