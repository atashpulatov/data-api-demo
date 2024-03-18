import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';

const ROWS_NUMBER_CHANGE_LIMIT = 10000;
const CELLS_NUMBER_CHANGE_LIMIT = 100000;

class OfficeTableRefresh {
  /**
   * Gets data about table created on import based on bind Id.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param instanceDefinition
   * @param prevOfficeTable Reference to previous Excel table
   * @param previousTableDimensions Dimensions of the previously created table
   *
   * @returns object containing:
   *
   * - tableChanged - true if columns number changed, false otherwise
   * - startCell - starting cell address
   */
  async getExistingOfficeTableData(
    excelContext: Excel.RequestContext,
    instanceDefinition: any,
    prevOfficeTable: Excel.Table,
    previousTableDimensions: any
  ): Promise<{ tableChanged: boolean; startCell: string }> {
    let startCell = await this.getStartCellOnRefresh(prevOfficeTable, excelContext);

    let tableChanged = false;
    ({ tableChanged, startCell } = await this.handleColumnChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions,
      startCell
    ));

    // TODO rename startCell to startCellAddress in whole repo for celladress with string type
    return { tableChanged, startCell };
  }

  /**
   * Checks if the number of columns in report has changed and handles cases when crosstab headers were modified.
   *
   * @param prevOfficeTable Reference to previous Excel table
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param instanceDefinition
   * @param previousTableDimensions Dimensions of the previously created table
   * @param startCellAddress Address of starting cell of Table
   *
   * @returns object containing:
   *
   * - tableChanged - true if columns number changed, false otherwise
   * - startCell - modified starting cell address
   */
  async handleColumnChange(
    prevOfficeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    instanceDefinition: any,
    previousTableDimensions: any,
    startCellAddress: string
  ): Promise<{ tableChanged: boolean; startCell: string }> {
    const { mstrTable } = instanceDefinition;

    let tableChanged = await this.checkTableChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions
    );

    ({ tableChanged, startCell: startCellAddress } = await this.clearIfCrosstabHeadersChanged(
      prevOfficeTable,
      excelContext,
      tableChanged,
      startCellAddress,
      mstrTable
    ));

    return { tableChanged, startCell: startCellAddress };
  }

  /**
   * Clears the empty row in Crosstab Report if exists,
   * by calling function officeApiCrosstabHelper.clearCrosstabRowForTableHeader.
   *
   * @param mstrTable Contains information about mstr object
   * @param prevOfficeTable Reference to previous Excel table
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  async clearCrosstabRowForTableHeader(
    mstrTable: any,
    prevOfficeTable: Excel.Table,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    const { isCrosstab, toCrosstabChange, prevCrosstabDimensions } = mstrTable;

    if (isCrosstab && !toCrosstabChange) {
      const crosstabEmptyRowExist = await officeApiCrosstabHelper.getValidOffset(
        prevOfficeTable,
        prevCrosstabDimensions.columnsY,
        'getRowsAbove',
        excelContext
      );

      if (crosstabEmptyRowExist) {
        officeApiCrosstabHelper.clearCrosstabRowForTableHeader(prevOfficeTable);
      }
    }
  }

  /**
   * Compares if table structure has changed.
   *
   * @param prevOfficeTable Reference to previous Excel table
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param instanceDefinition
   * @param previousTableDimensions Dimensions of the previously created table
   *
   * @return Specify table structure changed
   */
  async checkTableChange(
    prevOfficeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    instanceDefinition: any,
    previousTableDimensions: any
  ): Promise<boolean> {
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
  }

  /**
   * Compares if the number of columns in table has changed.
   *
   * @param prevOfficeTable Reference to previous Excel table
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param columns  Number of columns in instance
   * @param previousTableDimensions Dimensions of the previously created table
   *
   * @return Specify if number of columns in table changed
   */
  async checkColumnsChange(
    prevOfficeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    columns: number,
    previousTableDimensions: any
  ): Promise<boolean> {
    const tableColumns = prevOfficeTable.columns;
    // for backward compatibility we assume that if no previousTableDimensions were stored columns didn not changed
    const prevTableColumns = previousTableDimensions ? previousTableDimensions.columns : columns;

    tableColumns.load('count');
    await excelContext.sync();

    const tableColumnsCount = tableColumns.count;

    return columns !== tableColumnsCount || columns !== prevTableColumns;
  }

  /**
   * Compares if the number of rows in table has changed.
   *
   * @param prevOfficeTable Reference to previous Excel table
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param rows Number of rows in instance
   *
   * @return Absolute value of difference between number of rows in instance and Excel table
   */
  async checkRowsNumberChange(
    prevOfficeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    rows: number
  ): Promise<number> {
    const tableRows = prevOfficeTable.rows;

    tableRows.load('count');
    await excelContext.sync();

    return Math.abs(rows - tableRows.count);
  }

  /**
   * Get top left cell from the excel table.
   *
   * @param prevOfficeTable Reference to previous Excel table
   * @param excelContext
   * @returns Address of starting cell of Table
   *
   */
  async getStartCellOnRefresh(
    prevOfficeTable: Excel.Table,
    excelContext: Excel.RequestContext
  ): Promise<string> {
    const headerCell = prevOfficeTable.getDataBodyRange().getCell(0, 0);
    headerCell.load('address');
    await excelContext.sync();
    const startCellOfRange = officeApiHelper.getStartCellOfRange(headerCell.address);
    return officeApiHelper.offsetCellBy(startCellOfRange, -1, 0);
  }

  /**
   * Get top left cell from the excel table. For crosstabs return the first cell of Excel table not crosstab headers.
   *
   * @param prevOfficeTable Reference to previous Excel table
   * @param excelContext excel context
   * @param tableChanged Specify if table columns has been changed.
   * @param startCellAddress Address of starting cell of Table
   * @param mstrTable Contains information about mstr object
   *
   */
  async clearIfCrosstabHeadersChanged(
    prevOfficeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    tableChanged: boolean,
    startCellAddress: string,
    mstrTable: any
  ): Promise<{ tableChanged: boolean; startCell: string }> {
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
        startCellAddress = officeApiHelper.offsetCellBy(
          startCellAddress,
          -prevCrosstabDimensions.columnsY,
          -prevCrosstabDimensions.rowsX
        );
      }
    }

    if (prevCrosstabDimensions) {
      officeApiCrosstabHelper.clearCrosstabRange(prevOfficeTable, mstrTable, excelContext);
    }

    await excelContext.sync();
    return { tableChanged, startCell: startCellAddress };
  }

  /**
   * Get previously imported Excel table
   *
   * @param excelContext excel context
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   * @returns Reference to previously imported Excel table
   *
   */
  async getPreviousOfficeTable(
    excelContext: Excel.RequestContext,
    bindId: string
  ): Promise<Excel.Table> {
    const prevOfficeTable = officeApiHelper.getTable(excelContext, bindId);
    prevOfficeTable.load('showTotals');
    // We can set showTotals value here, since the loaded value will not change until we load it again
    prevOfficeTable.showTotals = false;
    await excelContext.sync();
    return prevOfficeTable;
  }

  /**
   * Gets top left cell from the table. For crosstabs returns the first cell of crosstab headers.
   *
   * @param startCellAddress Top left corner cell
   * @param instanceDefinition Definition of an object instance
   * @param tableChanged Specifies if table has been changed
   *
   * @returns Addres of top left cell of the table
   */
  getCrosstabStartCell(
    startCellAddress: string,
    instanceDefinition: any,
    tableChanged: boolean
  ): string {
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
      return officeApiHelper.offsetCellBy(startCellAddress, -columnsY, -rowsX);
    }

    return startCellAddress;
  }
}
const officeTableRefresh = new OfficeTableRefresh();
export default officeTableRefresh;
