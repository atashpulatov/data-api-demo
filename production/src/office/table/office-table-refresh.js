import { officeApiHelper } from '../api/office-api-helper';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';

const ROWS_NUMBER_CHANGE_LIMIT = 10000;
const CELLS_NUMBER_CHANGE_LIMIT = 100000;

class OfficeTableRefresh {
  /**
   * Gets data about table created on import based on bind Id.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} bindId Id of the Office table created on import used for referencing the Excel table
   * @param {Object} instanceDefinition
   * @param {Object} previousTableDimensions Dimensions of the previously created table
   *
   * @returns {Object} object containing:
   *
   * - tableChanged - true if columns number changed, false otherwise
   * - prevOfficeTable - reference to previous table
   * - startCell - starting cell address
   */
  getExistingOfficeTableData = async (excelContext, instanceDefinition, prevOfficeTable, previousTableDimensions) => {
    let startCell = await this.getStartCellOnRefresh(prevOfficeTable, excelContext);

    let tableChanged = false;
    ({ tableChanged, startCell } = await this.handleColumnChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions,
      startCell,
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
    startCell,
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
        officeApiCrosstabHelper.clearEmptyCrosstabRow(prevOfficeTable);
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
  checkTableChange = async (prevOfficeTable, excelContext, instanceDefinition, previousTableDimensions) => {
    const { columns, rows, mstrTable: { toCrosstabChange, fromCrosstabChange } } = instanceDefinition;

    if (toCrosstabChange || fromCrosstabChange) {
      return true;
    }

    const tableChanged = await this.checkColumnsChange(prevOfficeTable, excelContext, columns, previousTableDimensions);

    const rowsNumberChange = await this.checkRowsNumberChange(prevOfficeTable, excelContext, rows);

    return tableChanged
        || rowsNumberChange > ROWS_NUMBER_CHANGE_LIMIT
        || rowsNumberChange * columns > CELLS_NUMBER_CHANGE_LIMIT;
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
     const headerCell = prevOfficeTable.getHeaderRowRange().getCell(0, 0);
     headerCell.load('address');
     await excelContext.sync();
     return officeApiHelper.getStartCellOfRange(headerCell.address);
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
   clearIfCrosstabHeadersChanged = async (prevOfficeTable, excelContext, tableChanged, startCell, mstrTable) => {
     const { prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab } = mstrTable;
     const { validColumnsY, validRowsX } = await officeApiCrosstabHelper.getCrosstabHeadersSafely(
       prevCrosstabDimensions,
       prevOfficeTable,
       excelContext,
     );

     if (isCrosstab && crosstabHeaderDimensions && prevCrosstabDimensions) {
       if (validRowsX !== crosstabHeaderDimensions.rowsX
      || validColumnsY !== crosstabHeaderDimensions.columnsY) {
         tableChanged = true;
         prevCrosstabDimensions.rowsX = validRowsX;
         prevCrosstabDimensions.columnsY = validColumnsY;
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
   }

   async getPreviousOfficeTable(excelContext, bindId, mstrTable) {
     const prevOfficeTable = await officeApiHelper.getTable(excelContext, bindId);
     await this.clearEmptyCrosstabRow(mstrTable, prevOfficeTable, excelContext);
     prevOfficeTable.showHeaders = true;
     prevOfficeTable.load('name');
     await excelContext.sync();
     return prevOfficeTable;
   }
}
const officeTableRefresh = new OfficeTableRefresh();
export default officeTableRefresh;
