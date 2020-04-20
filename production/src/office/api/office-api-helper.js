import { IncorrectInputTypeError } from '../incorrect-input-type';
import { OutsideOfRangeError } from '../../error/outside-of-range-error';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { officeApiCrosstabHelper } from './office-api-crosstab-helper';
import { errorService } from '../../error/error-handler';

const ALPHABET_RANGE_START = 1;
const ALPHABET_RANGE_END = 26;
const ASCII_CAPITAL_LETTER_INDEX = 65;
const EXCEL_ROW_LIMIT = 1048576;
const EXCEL_COL_LIMIT = 16384;

class OfficeApiHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * checks excel session and auth token
   *
   */
  checkStatusOfSessions = async () => {
    await Promise.all([
      this.getExcelSessionStatus(),
      authenticationHelper.validateAuthToken(),
    ]);
  };

  /**
   * Gets range of the Excel table added to Workbook binded item collection.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
   * @return {Office} Reference to Excel Range
   */
  getBindingRange = (excelContext, bindId) => excelContext.workbook.bindings.getItem(bindId).getTable().getRange();

  /**
   * Gets Excel table added to Workbook binded item collection.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
   * @return {Office} Reference to Excel Table
   */
  getTable = (excelContext, bindId) => excelContext.workbook.bindings.getItem(bindId).getTable();

  /**
   * Gets a new Excel Context.
   *
   * @return {Office} Reference to a new Excel Context used by Excel API functions
   */
  getExcelContext = async () => window.Excel.run({ delayForCellEdit: true }, async (excelContext) => excelContext);

  /**
   * Gets Office Context.
   *
   * @return {Office} Reference to Office Context used by Office API functions
   */
  getOfficeContext = async () => window.Office.context;

  /**
   * Checks the status of Excel session.
   *
   * @return {Boolean} Returns true if the Excel session is active, false otherwise
   */
  getExcelSessionStatus = async () => !!await this.getExcelContext();

  /**
   * Gets username and environment URL from Redux store.
   *
   * @return {Object} Object containing username and envUrl (environment URL)
   */
  getCurrentMstrContext = () => {
    const { envUrl } = this.reduxStore.getState().sessionReducer;
    const { username } = this.reduxStore.getState().sessionReducer;
    return { envUrl, username };
  };

  /**
   * Returns top left cell of selected range.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @return {String} Address of the cell.
   */
  getSelectedCell = async (excelContext) => {
    const selectedRangeStart = excelContext.workbook.getSelectedRange().getCell(0, 0);
    selectedRangeStart.load(officeProperties.officeAddress);
    await excelContext.sync();
    return this.getStartCellOfRange(selectedRangeStart.address);
  };

  /**
   * Returns top left cell from passed address.
   *
   * @param {Office} excelAddress Reference to Excel Context used by Excel API functions
   * @return {String} Address of the cell.
   */
  getStartCellOfRange = (excelAddress) => excelAddress.match(/!(\w+\d+)(:|$)/)[1];

  /**
   * Gets Excel range based on starting cell and number of columns and rows.
   *
   * @param {Number} headerCount Number of rows
   * @param {String} startCell Address of the cell in Excel spreadsheet
   * @param {Number} rowCount Number of rows
   * @return {String} Address of Excel Range
   */
  getRange = (headerCount, startCell, rowCount = 0) => {
    if (!Number.isInteger(headerCount)) {
      throw new IncorrectInputTypeError();
    }

    const startCellArray = startCell.split(/(\d+)/);
    headerCount += parseInt(this.lettersToNumber(startCellArray[0]) - 1, 10);

    const endColumn = this.numberToLetters(headerCount);
    const endRow = Number(startCellArray[1]) + rowCount;

    if (endRow > EXCEL_ROW_LIMIT || headerCount > EXCEL_COL_LIMIT) {
      throw new OutsideOfRangeError('The table you try to import exceeds the worksheet limits.');
    }
    return `${startCell}:${endColumn}${endRow}`;
  };

  /**
   * Returns excel sheet from specific table.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
   *
   * @return {String} Excel sheet or false in case of error
   */
  getExcelSheetFromTable = async (excelContext, bindId) => {
    try {
      const officeTable = excelContext.workbook.tables.getItem(bindId);
      await excelContext.sync();
      return officeTable.getRange().worksheet;
    } catch (error) {
      return false;
    }
  };

  /**
   * Returns current excel sheet.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   */
  getCurrentExcelSheet = (excelContext) => excelContext.workbook.worksheets.getActiveWorksheet();

  /**
   * Converts number of column to Excel column name.
   *
   * @param {Number} headerCount Number of rows
   * @return {String} Excel column indicator
   */
  numberToLetters = (headerCount) => {
    let result = '';
    let firstNumber = ALPHABET_RANGE_START;
    let secondNumber = ALPHABET_RANGE_END;

    headerCount -= firstNumber;
    while (headerCount >= 0) {
      result = String.fromCharCode(parseInt((headerCount % secondNumber) / firstNumber, 10)
        + ASCII_CAPITAL_LETTER_INDEX)
        + result;

      firstNumber = secondNumber;
      secondNumber *= ALPHABET_RANGE_END;
      headerCount -= firstNumber;
    }

    return result;
  };

  /**
   * Converts Excel column name to index of the column.
   *
   * @param {String} letters Name of the Excel column
   * @return {Number} Index of the Excel column
   */
  lettersToNumber = (letters) => {
    if (!letters.match(/^[A-Z]*[A-Z]$/)) {
      throw new IncorrectInputTypeError();
    }
    return letters.split('').reduce((r, a) => r * ALPHABET_RANGE_END + parseInt(a, 36) - 9, 0);
  };

  /**
   * Offsets Excel address by passed row and column offset.
   *
   * @param {String} cell Address of the cell in Excel spreadsheet
   * @param {Number} rowOffset Number of rows
   * @param {Number} colOffset Number of column
   * @return {String} Address of Excel cell
   */
  offsetCellBy = (cell, rowOffset, colOffset) => {
    const cellArray = cell.split(/(\d+)/);
    const [column, row] = cellArray;
    const endRow = parseInt(row, 10) + parseInt(rowOffset, 10);
    const endColumn = this.numberToLetters(parseInt(this.lettersToNumber(column) + colOffset, 10));
    return `${endColumn}${endRow}`;
  };

  /**
   * Highlights imported object in Excel worksheet.
   *
   * Throws error if object no longer exists in Excel or if Excel or MSTR session expired.
   *
   * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
   * @param {Boolean} [shouldSelect=true] Specify if the Object on Worksheet should be highlighted
   * @param {Function} deleteObject Function for removing imported object
   * @param {String} chosenObjectName Name of the imported object
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @param {Object} crosstabHeaderDimensions Contains information about crosstab headers dimensions
   */
  onBindingObjectClick = async (ObjectData) => {
    let crosstabRange;
    // try {
    const { bindId, isCrosstab, crosstabHeaderDimensions } = ObjectData;

    const excelContext = await this.getExcelContext();
    const officeTable = excelContext.workbook.tables.getItem(bindId);

    if (isCrosstab) {
      const tmpXtabDimensions = {
        ...crosstabHeaderDimensions,
        columnsY: crosstabHeaderDimensions.columnsY + 1,
      };
      crosstabRange = await officeApiCrosstabHelper.getCrosstabRangeSafely(
        officeTable,
        tmpXtabDimensions,
        excelContext
      );
      crosstabRange.select();
    } else {
      const tableRange = this.getBindingRange(excelContext, bindId);
      tableRange.select();
    }
    await excelContext.sync();
    // } catch (error) {
    //   if (error) {
    //     if (error.code === 'ItemNotFound') {
    //       console.log('error:', error.message, error.code, error.response);
    //     }
    //     if (error.code === 'InvalidSelection') {
    //       console.log('error:', error.message, error.code);
    //     }
    //   }
    //   errorService.handleObjectBasedError(ObjectData.objectWorkingId, error);
    // }
  };

  /**
   * Adds binding to the Excel table.
   *
   * @param {Office} namedItem Excel Table
   * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
   */
  bindNamedItem = (namedItem, bindId) => new Promise((resolve, reject) => {
    window.Office.context.document.bindings.addFromNamedItemAsync(namedItem, 'table', { id: bindId }, (result) => {
      if (result.status === 'succeeded') {
        console.log(`Added new binding with type: ${result.value.type} and id: ${result.value.id}`);
        resolve();
      } else {
        console.error(`Error: ${result.error.message}`);
        reject(result.error);
      }
    });
  });

  /**
   * Returns the new initial cell considering crosstabs.
   *
   * For crosstab initial cell is offsetted.
   *
   * @param {Office} cell Starting table body cell
   * @param {Array} headers Headers object from OfficeConverterServiceV2.getHeaders
   * @param {Boolean} isCrosstab Indicates if it's a crosstab
   * @return {Object}
   */
  getTableStartCell = ({ startCell, instanceDefinition, prevOfficeTable }) => {
    const {
      mstrTable: {
        isCrosstab,
        prevCrosstabDimensions,
        crosstabHeaderDimensions,
        toCrosstabChange,
        fromCrosstabChange,
      }
    } = instanceDefinition;

    if (fromCrosstabChange) {
      return this.offsetCellBy(startCell, -prevCrosstabDimensions.columnsY, -prevCrosstabDimensions.rowsX);
    }

    if (!toCrosstabChange && (!isCrosstab || prevOfficeTable)) {
      return startCell;
    }

    const rowOffset = crosstabHeaderDimensions.columnsY;
    const colOffset = crosstabHeaderDimensions.rowsX;
    return this.offsetCellBy(startCell, rowOffset, colOffset);
  };

  /**
   * Attaches a event listener to onSelectionChanged on workbook.
   * As event handler, resets the active cell value via callback and then updates it with new value.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Function} setActiveCellAddress Callback to save the active cell address value.
   */
  addOnSelectionChangedListener = async (excelContext, setActiveCellAddress) => {
    excelContext.workbook.onSelectionChanged.add(async () => {
      setActiveCellAddress('...');
      const activeCellAddress = await this.getSelectedCell(excelContext);
      setActiveCellAddress(activeCellAddress);
    });
    await excelContext.sync();
  }
}

export const officeApiHelper = new OfficeApiHelper();
