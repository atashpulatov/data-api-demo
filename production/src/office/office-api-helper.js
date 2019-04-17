import uuid from 'uuid/v4';
import {IncorrectInputTypeError} from './incorrect-input-type';
import {OutsideOfRangeError} from '../error/outside-of-range-error';
import {reduxStore} from '../store';
import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';

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
    const excelContext = await this.getExcelContext();
    const tableRange = this.getBindingRange(excelContext, bindingId);
    tableRange.select();
    return await excelContext.sync();
  };

  getBindingRange = (context, bindingId) => {
    return context.workbook.bindings
        .getItem(bindingId).getTable()
        .getRange();
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

  formatTable = (sheet) => {
    if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
      sheet.getRange().format.autofitColumns();
    } else {
      notificationService.displayNotification('warning', `Unable to format table.`);
    }
  }

  formatNumbers = (table, reportConvertedData) => {
    if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
      try {
        const rowsCount = reportConvertedData.rows.length;
        const columns = table.columns;

        for (const object of reportConvertedData.columnInformation) {
          if (!object.isAttribute) {
            const columnRange = columns.getItemAt(object.index).getHeaderRowRange().getRowsBelow(rowsCount);
            let format = '';

            if (object.category == 9) {
              format = this._getNumberFormattingCategoryName(object);
            } else {
              format = object.formatString;

              if (format.indexOf('$') !== -1) {
                format = format.replace(/[$]/g, '\\$').replace(/["]/g, ''); // fix anoying $-sign currency replacemnt in Excel
              }
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
    const startCell = selectedRangeStart.address
        .split('!')[1].split(':')[0];
    return startCell;
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
}

export const officeApiHelper = new OfficeApiHelper();
