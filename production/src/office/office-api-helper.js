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
      errorService.handleOfficeError(error);
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
    return await Excel.run(async (context) => {
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

  formatTable = (table) => {
    if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
      table.getRange().format.autofitColumns();
    } else {
      notificationService.displayNotification('warning', `Unable to format table.`);
    }
  }

  formatNumbers = (table, reportConvertedData) => {
    if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
      try {
        const columns = table.columns;

        for (const object of reportConvertedData.columnInformation) {
          if (!object.isAttribute) {
            const columnRange = columns.getItemAt(object.index).getDataBodyRange();
            let format = '';

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
            columnRange.numberFormat = format;
          }
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

  deleteObjectTableBody = (context, object) => {
    const tableObject = context.workbook.tables.getItem(object.bindId);
    const tableRange = tableObject.getDataBodyRange();
    tableRange.clear(Excel.ClearApplyTo.contents);
  }


  createRowsHeaders = async (context, cell, headers) => {
    const columnOffset = 0;
    const rowOffset = headers.rows[0].length;
    const startingCell = cell.getOffsetRange(-columnOffset, -rowOffset);
    const headerArray = mstrNormalizedJsonHandler._transposeMatrix(headers.rows);
    const OffsetForMoving1 = 0;
    const OffsetForMoving2 = 1;

    await this.createHeaders(headerArray, startingCell, OffsetForMoving2, OffsetForMoving1, context);
  }
  createColumnsHeaders = async (context, cell, headers) => {
    const columnOffset = headers.columns.length;
    const rowOffset = 0;
    const startingCell = cell.getOffsetRange(-columnOffset, -rowOffset);
    const headerArray = headers.columns;
    const OffsetForMoving1 = 1;
    const OffsetForMoving2 = 0;

    await this.createHeaders(headerArray, startingCell, OffsetForMoving2, OffsetForMoving1, context);
  }

  createHeaders = async (headerArray, startingCell, OffsetForMoving2, OffsetForMoving1, context) => {
    for (let i = 0; i < headerArray.length - 1; i++) {
      let currentCell = startingCell;
      for (let j = 0; j < headerArray[i].length - 1; j++) {
        if (headerArray[i][j] === headerArray[i][j + 1]) {
          currentCell.getResizedRange(OffsetForMoving2, OffsetForMoving1).merge(); // increasing size of selected range for 2 cells that will be merged
          currentCell.format.horizontalAlignment = Excel.HorizontalAlignment.center;
          currentCell.format.verticalAlignment = Excel.VerticalAlignment.center;
        }
        currentCell = currentCell.getOffsetRange(OffsetForMoving2, OffsetForMoving1); // moving to next cell
      }
      startingCell = startingCell.getOffsetRange(OffsetForMoving1, OffsetForMoving2); // moving to next row/column
    }
    await context.sync();
  }
}


export const officeApiHelper = new OfficeApiHelper();
