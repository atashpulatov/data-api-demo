import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';

const ROWS_NUMBER_CHANGE_LIMIT = 10000;
const CELLS_NUMBER_CHANGE_LIMIT = 100000;

class OfficeTableRefresh {
  /**
   * Gets data about table created on import based on bind Id.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} instanceDefinition
   * @param {Office} prevOfficeTable Reference to previous Excel table
   * @param {Object} previousTableDimensions Dimensions of the previously created table
   *
   * @returns {Object} object containing:
   *
   * - tableChanged - true if columns number changed, false otherwise
   * - startCell - starting cell address
   */
  getExistingOfficeTableData = async (
    excelContext,
    instanceDefinition,
    prevOfficeTable,
    previousTableDimensions
  ) => {
    let startCell = await this.getStartCellOnRefresh(prevOfficeTable, excelContext);

    let tableChanged = false;
    ({ tableChanged, startCell } = await this.handleColumnChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions,
      startCell
    ));

    return { tableChanged, startCell };
  };

  /**
   * Checks if the number of columns in report has changed and handles cases when crosstab headers were modified.
   *
   * @param {Object} prevOfficeTable Reference to previous Excel table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} instanceDefinition
   * @param {Object} previousTableDimensions Dimensions of the previously created table
   * @param {String} startCell Address of starting cell of Table
   *
   * @returns {Object} object containing:
   *
   * - tableChanged - true if columns number changed, false otherwise
   * - startCell - modified starting cell address
   */
  handleColumnChange = async (
    prevOfficeTable,
    excelContext,
    instanceDefinition,
    previousTableDimensions,
    startCell
  ) => {
    const { mstrTable } = instanceDefinition;

    let tableChanged = await this.checkTableChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions
    );

    ({ tableChanged, startCell } = await this.clearIfCrosstabHeadersChanged(
      prevOfficeTable,
      excelContext,
      tableChanged,
      startCell,
      mstrTable
    ));

    return { tableChanged, startCell };
  };

  /**
   * Clears the empty row in Crosstab Report if exists,
   * by calling function officeApiCrosstabHelper.clearEmptyCrosstabRow.
   *
   * @param {Object} mstrTable Contains information about mstr object
   * @param {Object} prevOfficeTable Reference to previous Excel table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   */
  clearEmptyCrosstabRow = async (mstrTable, prevOfficeTable, excelContext) => {
    const { isCrosstab, toCrosstabChange, prevCrosstabDimensions } = mstrTable;

    if (isCrosstab && !toCrosstabChange) {
      const crosstabEmptyRowExist = await officeApiCrosstabHelper.getValidOffset(
        prevOfficeTable,
        prevCrosstabDimensions.columnsY,
        'getRowsAbove',
        excelContext
      );

      if (crosstabEmptyRowExist) {
        await officeApiCrosstabHelper.clearEmptyCrosstabRow(prevOfficeTable, excelContext);
      }
    }
  };

  /**
   * Compares if table structure has changed.
   *
   * @param {Object} prevOfficeTable Reference to previous Excel table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} instanceDefinition
   * @param {Object} previousTableDimensions Dimensions of the previously created table
   *
   * @return {Boolean} Specify table structure changed
   */
  checkTableChange = async (
    prevOfficeTable,
    excelContext,
    instanceDefinition,
    previousTableDimensions
  ) => {
    const {
      columns,
      rows,
      mstrTable: { toCrosstabChange, fromCrosstabChange },
    } = instanceDefinition;

    if (toCrosstabChange || fromCrosstabChange) {
      return true;
    }

    const tableChanged = await this.checkColumnsChange(
      prevOfficeTable,
      excelContext,
      columns,
      previousTableDimensions
    );

    const rowsNumberChange = await this.checkRowsNumberChange(prevOfficeTable, excelContext, rows);
    return (
      tableChanged ||
      rowsNumberChange > ROWS_NUMBER_CHANGE_LIMIT ||
      rowsNumberChange * columns > CELLS_NUMBER_CHANGE_LIMIT
    );
  };

  /**
   * Compares if the number of columns in table has changed.
   *
   * @param {Object} prevOfficeTable Reference to previous Excel table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Number} columns  Number of columns in instance
   * @param {Object} previousTableDimensions Dimensions of the previously created table
   *
   * @return {Boolean} Specify if number of columns in table changed
   */
  checkColumnsChange = async (prevOfficeTable, excelContext, columns, previousTableDimensions) => {
    const tableColumns = prevOfficeTable.columns;
    // for backward compatibility we assume that if no previousTableDimensions were stored columns didn not changed
    const prevTableColumns = previousTableDimensions ? previousTableDimensions.columns : columns;

    tableColumns.load('count');
    await excelContext.sync();

    const tableColumnsCount = tableColumns.count;

    return columns !== tableColumnsCount || columns !== prevTableColumns;
  };

  /**
   * Compares if the number of rows in table has changed.
   *
   * @param {Object} prevOfficeTable Reference to previous Excel table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Number} rows Number of rows in instance
   *
   * @return {Number} Absolute value of difference between number of rows in instance and Excel table
   */
  checkRowsNumberChange = async (prevOfficeTable, excelContext, rows) => {
    const tableRows = prevOfficeTable.rows;

    tableRows.load('count');
    await excelContext.sync();

    return Math.abs(rows - tableRows.count);
  };

  /**
   * Get top left cell from the excel table.
   *
   * @param {Object} prevOfficeTable Reference to previous Excel table
   * @param {Object} excelContext
   *
   */
  getStartCellOnRefresh = async (prevOfficeTable, excelContext) => {
    const headerCell = prevOfficeTable.getDataBodyRange().getCell(0, 0);
    headerCell.load('address');
    await excelContext.sync();
    const startCellOfRange = officeApiHelper.getStartCellOfRange(headerCell.address);
    return officeApiHelper.offsetCellBy(startCellOfRange, -1, 0);
  };

  /**
   * Get top left cell from the excel table. For crosstabs return the first cell of Excel table not crosstab headers.
   *
   * @param {Object} prevOfficeTable Reference to previous Excel table
   * @param {Object} excelContext excel context
   * @param {Boolean} tableChanged Specify if table columns has been changed.
   * @param {String} startCell Address of starting cell of Table
   * @param {Object} mstrTable Contains information about mstr object
   *
   */
  clearIfCrosstabHeadersChanged = async (
    prevOfficeTable,
    excelContext,
    tableChanged,
    startCell,
    mstrTable
  ) => {
    const { prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab } = mstrTable;
    const { validColumnsY, validRowsX } = await officeApiCrosstabHelper.getCrosstabHeadersSafely(
      prevCrosstabDimensions,
      prevOfficeTable,
      excelContext
    );

    if (isCrosstab && crosstabHeaderDimensions && prevCrosstabDimensions) {
      if (
        validRowsX !== crosstabHeaderDimensions.rowsX ||
        validColumnsY - 1 !== crosstabHeaderDimensions.columnsY
      ) {
        tableChanged = true;
        prevCrosstabDimensions.rowsX = validRowsX;
        prevCrosstabDimensions.columnsY = validColumnsY - 1;
      }
      if (tableChanged) {
        startCell = officeApiHelper.offsetCellBy(
          startCell,
          -prevCrosstabDimensions.columnsY,
          -prevCrosstabDimensions.rowsX
        );
      }
    }

    if (prevCrosstabDimensions) {
      officeApiCrosstabHelper.clearCrosstabRange(prevOfficeTable, mstrTable, excelContext);
    }

    await excelContext.sync();
    return { tableChanged, startCell };
  };

  /**
   * Get previously imported Excel table
   *
   * @param {Office} excelContext excel context
   * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
   * @returns {Office} Reference to previously imported Excel table
   *
   */
  getPreviousOfficeTable = async (excelContext, bindId) => {
    const prevOfficeTable = await officeApiHelper.getTable(excelContext, bindId);
    prevOfficeTable.load('showTotals');
    // We can set showTotals value here, since the loaded value will not change until we load it again
    prevOfficeTable.showTotals = false;
    await excelContext.sync();
    return prevOfficeTable;
  };

  /**
   * Gets top left cell from the table. For crosstabs returns the first cell of crosstab headers.
   *
   * @param {string} startCell Top left corner cell
   * @param {Object} instanceDefinition Definition of an object instance
   * @param {Boolean} tableChanged Specifies if table has been changed
   *
   * @returns {string} Top left cell of the table
   */
  getCrosstabStartCell = (startCell, instanceDefinition, tableChanged) => {
    const {
      mstrTable: {
        isCrosstab,
        fromCrosstabChange,
        crosstabHeaderDimensions,
        prevCrosstabDimensions,
      },
    } = instanceDefinition;

    const { rowsX, columnsY } = crosstabHeaderDimensions || prevCrosstabDimensions;

    if ((isCrosstab && !tableChanged) || fromCrosstabChange) {
      return officeApiHelper.offsetCellBy(startCell, -columnsY, -rowsX);
    }

    return startCell;
  };
}
const officeTableRefresh = new OfficeTableRefresh();
export default officeTableRefresh;
