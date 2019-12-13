import { officeApiHelper } from './office-api-helper';
import { CONTEXT_LIMIT } from '../mstr-object/mstr-object-rest-service';
import { TABLE_OVERLAP } from '../error/constants';
import { OverlappingTablesError } from '../error/overlapping-tables-error';
import officeFormattingHelper from './office-formatting-helper';

const DEFAULT_TABLE_STYLE = 'TableStyleLight11';
const TABLE_HEADER_FONT_COLOR = '#000000';
const TABLE_HEADER_FILL_COLOR = '#ffffff';

class OfficeTableHelper {
  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {Object} instanceDefinition
   * @param {Object} context ExcelContext
   * @param {string} startCell  Top left corner cell
   * @param {string} officeTableId Excel Binding ID
   * @param {Object} prevOfficeTable Previous office table to refresh
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed. False by default
   *
   * @memberOf OfficeTableHelper
   */
  createOfficeTable = async (instanceDefinition, context, startCell, officeTableId, prevOfficeTable, tableColumnsChanged = false) => {
    const { rows, columns, mstrTable, mstrTable:{ isCrosstab, crosstabHeaderDimensions, prevCrosstabDimensions } } = instanceDefinition;

    const sheet = this.getExcelWorksheet(prevOfficeTable, context);
    const tableStartCell = this.getTableStartCell(startCell, sheet, instanceDefinition, prevOfficeTable, tableColumnsChanged);
    const tableRange = officeApiHelper.getRange(columns, tableStartCell, rows);
    const range = this.getObjectRange(isCrosstab, tableStartCell, crosstabHeaderDimensions, sheet, tableRange);

    context.trackedObjects.add(range);
    await this.checkObjectRangeValidity(prevOfficeTable, context, columns, rows, range, isCrosstab, crosstabHeaderDimensions, prevCrosstabDimensions);
    if (isCrosstab) {
      this.createCrosstabHeaders(tableStartCell, mstrTable, sheet, crosstabHeaderDimensions);
    }

    const officeTable = sheet.tables.add(tableRange, true); // create office table based on the range
    this.styleHeaders(officeTable, TABLE_HEADER_FONT_COLOR, TABLE_HEADER_FILL_COLOR);
    return this.setOfficeTableProperties(officeTable, officeTableId, mstrTable, sheet, context);
  };

  /**
   * Updates office table if the number of columns or rows of an existing table changes.
   *
   * @param {Object} instanceDefinition
   * @param {Object} context ExcelContext
   * @param {string} startCell  Top left corner cell
   * @param {Object} prevOfficeTable Previous office table to refresh
   *
   * @memberOf OfficeTableHelper
   */
  updateOfficeTable = async (instanceDefinition, context, startCell, prevOfficeTable) => {
    try {
      const { rows, mstrTable, mstrTable:{ isCrosstab, subtotalsAddresses } } = instanceDefinition;
      const crosstabHeaderDimensions = this.getCrosstabHeaderDimensions(instanceDefinition);

      prevOfficeTable.rows.load('count');
      await context.sync();
      if (subtotalsAddresses.length) await officeFormattingHelper.applySubtotalFormatting(isCrosstab, subtotalsAddresses, prevOfficeTable, context, mstrTable, false);
      const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);
      // If the new table has more rows during update check validity
      if (addedRows) {
        const bottomRange = prevOfficeTable.getRange().getRowsBelow(addedRows);
        await this.checkRangeValidity(context, bottomRange);
      }
      if (isCrosstab) {
        try {
          const sheet = prevOfficeTable.worksheet;
          this.createCrosstabHeaders(startCell, mstrTable, sheet, crosstabHeaderDimensions);
        } catch (error) {
          console.log(error);
        }
      }
      context.workbook.application.suspendApiCalculationUntilNextSync();
      this.clearTableFilters(prevOfficeTable);
      if (!mstrTable.isCrosstab) {
        prevOfficeTable.getHeaderRowRange().values = [mstrTable.headers.columns[mstrTable.headers.columns.length - 1]];
      }
      await context.sync();
      await this.updateRows(prevOfficeTable, context, rows);
      return prevOfficeTable;
    } catch (error) {
      await context.sync();
      throw error;
    }
  };

  /**
   * Gets dimensions od the headers of crosstab report
   *
   * @param {Object} instanceDefinition
   *
   * @memberOf OfficeTableHelper
   */
  getCrosstabHeaderDimensions = (instanceDefinition) => {
    const { mstrTable } = instanceDefinition;
    const { isCrosstab, headers } = mstrTable;
    return {
      columnsY: isCrosstab ? headers.columns.length : 0,
      columnsX: isCrosstab ? headers.columns[0].length : 0,
      rowsX: isCrosstab ? (headers.rows[0].length || 1) : 0, // if there is no attributes in rows we need to setup 1 for offset for column attributes names
      rowsY: isCrosstab ? instanceDefinition.rows : 0,
    };
  }

  /**
   * Updates number of rows in office table.
   *
   * @param {Object} prevOfficeTable Previous office table to refresh
   * @param {Object} context ExcelContext
   * @param {number} rows  number of rows in the object
   *
   * @memberOf OfficeTableHelper
   */
  updateRows = async (prevOfficeTable, context, rows) => {
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

  /**
   * Set style for office table
   *
   * @param {Object} officeTable
   * @param {string} fontColor
   * @param {string} fillColor
   *
   * @memberOf OfficeTableHelper
   */
  styleHeaders = (officeTable, fontColor, fillColor) => {
    officeTable.style = DEFAULT_TABLE_STYLE;
    // Temporarily disabling header formatting
    // const headerRowRange = officeTable.getHeaderRowRange();
    // headerRowRange.format.fill.color = fillColor;
    // headerRowRange.format.font.color = fontColor;
  };

  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {boolean} isRefresh
   * @param {Object} excelContext
   * @param {string} bindingId
   * @param {Object} instanceDefinition
   * @param {string} startCell  Top left corner cell
   *
   * @memberOf OfficeTableHelper
   */
  getOfficeTable = async (isRefresh, excelContext, bindingId, instanceDefinition, startCell) => {
    console.time('Create or get table');
    const newOfficeTableId = bindingId || officeApiHelper.findAvailableOfficeTableId();
    this.checkReportTypeChange(instanceDefinition);
    let officeTable;
    let shouldFormat = true;
    let tableColumnsChanged;
    if (isRefresh) {
      ({ tableColumnsChanged, startCell, officeTable, shouldFormat } = await this.changeOfficeTableOnRefresh(
        excelContext, bindingId, instanceDefinition, startCell, officeTable, newOfficeTableId, shouldFormat
      ));
    } else {
      officeTable = await this.createOfficeTable(instanceDefinition, excelContext, startCell, newOfficeTableId);
    }
    console.timeEnd('Create or get table');
    return {
      officeTable,
      newOfficeTableId,
      shouldFormat,
      tableColumnsChanged,
    };
  }

  /**
   * Checks if the range is empty
   *
   * @param {Object} context excelContext
   * @param {Object} excelRange range in which table will be inserted
   *
   * @memberOf OfficeTableHelper
   */
  checkRangeValidity = async (context, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await context.sync();
    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError(TABLE_OVERLAP);
    }
  };

  /**
   * Compares if the number of columns in table has changed.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} context excelContext
   * @param {Object} instanceDefinition
   *
   * @memberOf OfficeTableHelper
   */
  checkColumnsChange = async (prevOfficeTable, context, instanceDefinition) => {
    const { columns } = instanceDefinition;
    const tableColumns = prevOfficeTable.columns;
    tableColumns.load('count');
    await context.sync();
    const tableColumnsCount = tableColumns.count;
    return columns !== tableColumnsCount;
  };


  /**
   * Get excel worksheet of previous office table or acxtive if no table was passed.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} context excelContext
   *
   * @memberOf OfficeTableHelper
   */
  getExcelWorksheet = (prevOfficeTable, context) => (prevOfficeTable ? prevOfficeTable.worksheet : context.workbook.worksheets.getActiveWorksheet())

  /**
   * Get range of the table. For crosstabs range is extended by headers.
   *
   * @param {Boolean} isCrosstab  Specified if object is crosstab report
   * @param {Object} tableStartCell  Top left corner cell
   * @param {Object} crosstabHeaderDimensions contains dimension of crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   * @param {Object} sheet  excel worksheet
   * @param {Object} tableRange range of the table
   *
   * @memberOf OfficeTableHelper
   */
  getObjectRange = (isCrosstab, tableStartCell, crosstabHeaderDimensions, sheet, tableRange) => {
    if (isCrosstab) {
      return officeApiHelper.getCrosstabRange(tableStartCell, crosstabHeaderDimensions, sheet);
    }
    return sheet.getRange(tableRange);
  }

  /**
   * Create column and title headers for crosstab
   *
   * @param {string} tableStartCell  Top left corner cell of the table
   * @param {Object} mstrTable  contains informations about mstr object
   * @param {Object} sheet  excel worksheet
   * @param {Object} range range of the table
   * @param {Object} crosstabHeaderDimensions contains dimension of crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   *
   * @memberOf OfficeTableHelper
   */
   createCrosstabHeaders = (tableStartCell, mstrTable, sheet, crosstabHeaderDimensions) => {
     officeApiHelper.createColumnsHeaders(tableStartCell, mstrTable.headers.columns, sheet);
     officeApiHelper.createRowsTitleHeaders(tableStartCell, mstrTable.attributesNames, sheet, crosstabHeaderDimensions);
   }

  /**
   * Clears filters and sorting in the table
   *
   * @param {Object} prevOfficeTable previous office table
   *
   * @memberOf OfficeTableHelper
   */
  clearTableFilters =(prevOfficeTable) => {
    prevOfficeTable.clearFilters();
    prevOfficeTable.sort.clear();
  }

  /**
   * Checks if the report changes to or from crosstab
   *
   * @param {Object} instanceDefinition
   *
   * @memberOf OfficeTableHelper
   */
  checkReportTypeChange=(instanceDefinition) => {
    const { mstrTable, mstrTable: { prevCrosstabDimensions, isCrosstab } } = instanceDefinition;
    mstrTable.toCrosstabChange = !prevCrosstabDimensions && isCrosstab;
    mstrTable.fromCrosstabChange = prevCrosstabDimensions && !isCrosstab;
  }

  /**
   * Creates an office table if the number of columns of an existing table changes.
   * If the new definiton range is not empty we keep the original table.
   *
   * @param {Object} excelContext
   * @param {String} bindingId
   * @param {Object} instanceDefinition
   * @param {Object} startCell  Top left corner cell
   * @param {Object} OfficeTable
   * @param {String} newOfficeTableId new name for office table
   * @param {Boolean} shouldFormat
   *
   * @memberOf OfficeTableHelper
   */
  async changeOfficeTableOnRefresh(excelContext, bindingId, instanceDefinition, startCell, officeTable, newOfficeTableId, shouldFormat) {
    const { mstrTable, mstrTable:{ prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab } } = instanceDefinition;
    const prevOfficeTable = await officeApiHelper.getTable(excelContext, bindingId);
    // Since showing Excel table header dont override the data but insert new row, we clear values from empty row in crosstab to prevent it
    if (isCrosstab && !mstrTable.toCrosstabChange) officeApiHelper.clearEmptyCrosstabRow(prevOfficeTable);

    prevOfficeTable.showHeaders = true;
    await excelContext.sync();
    let tableColumnsChanged = await this.checkColumnsChange(prevOfficeTable, excelContext, instanceDefinition);
    startCell = await this.getStartCell(prevOfficeTable, excelContext);
    ({ tableColumnsChanged, startCell } = await this.clearIfCrosstabHeadersChanged(prevOfficeTable, prevCrosstabDimensions, excelContext, isCrosstab, crosstabHeaderDimensions, tableColumnsChanged, startCell));

    if (tableColumnsChanged) {
      console.log('Instance definition changed, creating new table');
      officeTable = await this.createOfficeTable(instanceDefinition, excelContext, startCell, newOfficeTableId, prevOfficeTable, tableColumnsChanged);
    } else {
      shouldFormat = false;
      console.time('Validate existing table');
      officeTable = await this.updateOfficeTable(instanceDefinition, excelContext, startCell, prevOfficeTable);
      console.timeEnd('Validate existing table');
    }
    return { tableColumnsChanged, startCell, officeTable, shouldFormat };
  }


  /**
   * Get top left cell from the excel table.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext
   *
   * @memberOf OfficeTableHelper
   */
   getStartCell = async(prevOfficeTable, excelContext) => {
     const headerCell = prevOfficeTable.getHeaderRowRange().getCell(0, 0);
     headerCell.load('address');
     await excelContext.sync();
     return officeApiHelper.getStartCell(headerCell.address);
   }

  /**
   * Get top left cell from the excel table. For crosstabs return the first cell of Excel table not crosstab headers.
   *
   * @param {string} startCell  Top left corner cell
   * @param {Object} sheet  excel worksheet
   * @param {Object} instanceDefinition
   * @param {Object} prevOfficeTable previous office table
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed
   *
   * @memberOf OfficeTableHelper
   */
  getTableStartCell = (startCell, sheet, instanceDefinition, prevOfficeTable, tableColumnsChanged) => {
    const { mstrTable } = instanceDefinition;
    const { isCrosstab, prevCrosstabDimensions, crosstabHeaderDimensions } = mstrTable;
    const { rowsX: prevRowsX, columnsY: prevColumnsY } = prevCrosstabDimensions;
    const { rowsX, columnsY } = crosstabHeaderDimensions;
    let tableStartCell = officeApiHelper.getTableStartCell({ startCell, sheet, instanceDefinition, prevOfficeTable, tableColumnsChanged });
    if (prevCrosstabDimensions && prevCrosstabDimensions !== crosstabHeaderDimensions && isCrosstab) {
      if (tableColumnsChanged) {
        tableStartCell = officeApiHelper.offsetCellBy(tableStartCell, columnsY, rowsX);
      } else {
        tableStartCell = officeApiHelper.offsetCellBy(tableStartCell, columnsY - prevColumnsY, rowsX - prevRowsX);
      }
    }
    return tableStartCell;
  }

  /**
   * Get top left cell from the excel table. For crosstabs return the first cell of Excel table not crosstab headers.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} prevCrosstabDimensions contains dimension of previous crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   * @param {Object} excelContext
   * @param {Boolean} isCrosstab  Specified if object is crosstab report
   * @param {Object} crosstabHeaderDimensions contains dimension of crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed
   * @param {string} startCell  Starting cell of Table
   *
   * @memberOf OfficeTableHelper
   */
  async clearIfCrosstabHeadersChanged(prevOfficeTable, prevCrosstabDimensions, excelContext, isCrosstab, crosstabHeaderDimensions, tableColumnsChanged, startCell) {
    const safeHeaders = await officeApiHelper.getCrosstabHeadersSafely(prevOfficeTable, prevCrosstabDimensions.columnsY, excelContext, prevCrosstabDimensions.rowsX);
    if (isCrosstab && crosstabHeaderDimensions && (safeHeaders.validRowsX !== crosstabHeaderDimensions.rowsX || safeHeaders.validColumnsY !== crosstabHeaderDimensions.columnsY)) {
      tableColumnsChanged = true;
      prevCrosstabDimensions.rowsX = safeHeaders.validRowsX;
      prevCrosstabDimensions.columnsY = safeHeaders.validColumnsY;
      if (tableColumnsChanged) {
        startCell = officeApiHelper.offsetCellBy(startCell, -prevCrosstabDimensions.columnsY, -prevCrosstabDimensions.rowsX);
      }
    }
    if (prevCrosstabDimensions) { officeApiHelper.clearCrosstabRange(prevOfficeTable, crosstabHeaderDimensions, prevCrosstabDimensions, isCrosstab, excelContext); }
    await excelContext.sync();
    return { tableColumnsChanged, startCell };
  }

  /**
   * Checks if the range for the table after refresh is cleared.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} context excelContext
   * @param {number} columns number of columns in the table
   * @param {number} rows number of rows in the table
   * @param {Object} range range of the resized table
   * @param {Object} crosstabHeaderDimensions contains dimension of crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   * @param {Object} prevCrosstabDimensions contains dimension of  previous crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   * @param {Boolean} isCrosstab specifies if the report is crosstab
   *
   * @memberOf OfficeTableHelper
   */
  async checkObjectRangeValidity(prevOfficeTable, context, columns, rows, range, isCrosstab, crosstabHeaderDimensions, prevCrosstabDimensions) {
    if (prevOfficeTable) {
      prevOfficeTable.rows.load('count');
      await context.sync();
      let addedColumns = Math.max(0, columns - prevOfficeTable.columns.count);
      let addedRows = Math.max(0, rows - prevOfficeTable.rows.count);
      if (isCrosstab && prevCrosstabDimensions) {
        addedRows += (crosstabHeaderDimensions.columnsY - prevCrosstabDimensions.columnsY);
        addedColumns += (crosstabHeaderDimensions.rowsX - prevCrosstabDimensions.rowsX);
      }
      if (addedColumns) {
        const rightRange = prevOfficeTable
          .getRange()
          .getColumnsAfter(addedColumns);
        await this.checkRangeValidity(context, rightRange);
      }
      if (addedRows) {
        const bottomRange = prevOfficeTable
          .getRange()
          .getRowsBelow(addedRows)
          .getResizedRange(0, addedColumns);
        await this.checkRangeValidity(context, bottomRange);
      }
      context.runtime.enableEvents = false;
      await context.sync();
      prevOfficeTable.delete();
      context.runtime.enableEvents = true;
      await context.sync();
    } else {
      await this.checkRangeValidity(context, range);
    }
  }

  /**
   * Set name of the table and format office table headers
   *
   * @param {Object} officeTable previous office table
   * @param {Object} officeTableId office table name
   * @param {Object} mstrTable  contains informations about mstr object
   * @param {Object} sheet  excel worksheet
   * @param {Object} context excelContext
   *
   * @memberOf OfficeTableHelper
   */
  setOfficeTableProperties = async (officeTable, officeTableId, mstrTable, sheet, context) => {
    const { isCrosstab } = mstrTable;
    try {
      officeTable.load('name');
      officeTable.name = officeTableId;
      if (isCrosstab) {
        officeTable.showFilterButton = false;
        officeTable.showHeaders = false;
      } else {
        officeTable.getHeaderRowRange().values = [mstrTable.headers.columns[mstrTable.headers.columns.length - 1]];
      }
      sheet.activate();
      await context.sync();
      return officeTable;
    } catch (error) {
      await context.sync();
      throw error;
    }
  }
}
export const officeTableHelper = new OfficeTableHelper();
export default officeTableHelper;
