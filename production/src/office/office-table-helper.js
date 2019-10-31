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
   *
   * @memberOf OfficeDisplayService
   */
  createOfficeTable = async (instanceDefinition, context, startCell, officeTableId, prevOfficeTable) => {
    const { rows, columns, mstrTable } = instanceDefinition;
    const { isCrosstab, toCrosstabChange, fromCrosstabChange, prevCrosstabDimensions, crosstabHeaderDimensions } = mstrTable;
    const { rowsX: prevRowsX, columnsY: prevColumnsY } = prevCrosstabDimensions;
    const { rowsX, columnsY } = crosstabHeaderDimensions;

    const sheet = this.getExcelWorksheet(prevOfficeTable, context);
    const tableStartCell = this.getTableStartCell(startCell, sheet, instanceDefinition, prevOfficeTable, toCrosstabChange, fromCrosstabChange, prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab, columnsY, prevColumnsY, rowsX, prevRowsX);
    const tableRange = officeApiHelper.getRange(columns, tableStartCell, rows);
    const range = this.getObjectRange(isCrosstab, tableStartCell, crosstabHeaderDimensions, sheet, tableRange);

    context.trackedObjects.add(range);
    await this.checkObjectRangeValidity(prevOfficeTable, context, columns, rows, range);
    if (isCrosstab) {
      this.createCrosstabHeaders(tableStartCell, mstrTable, sheet, range, crosstabHeaderDimensions);
    }

    const officeTable = sheet.tables.add(tableRange, true);
    this.styleHeaders(officeTable, TABLE_HEADER_FONT_COLOR, TABLE_HEADER_FILL_COLOR);
    return this.bindOfficeTable(officeTable, officeTableId, mstrTable, sheet, context, isCrosstab)
  };

  updateOfficeTable = async (
    instanceDefinition,
    context,
    startCell,
    prevOfficeTable,
  ) => {
    try {
      const { rows, mstrTable } = instanceDefinition;
      const { isCrosstab, subtotalsAddresses } = mstrTable;
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

      if (mstrTable.isCrosstab) {
        try {
          const range = officeApiHelper.getCrosstabRange(startCell, crosstabHeaderDimensions, prevOfficeTable.worksheet);
          officeApiHelper.createColumnsHeaders(startCell, mstrTable.headers.columns, prevOfficeTable.worksheet, range);
          officeApiHelper.createRowsTitleHeaders(startCell, mstrTable.attributesNames, prevOfficeTable.worksheet, crosstabHeaderDimensions);
        } catch (error) {
          console.log(error);
        }
      }
      context.workbook.application.suspendApiCalculationUntilNextSync();
      prevOfficeTable.clearFilters();
      prevOfficeTable.sort.clear();
      if (!mstrTable.isCrosstab) {
        prevOfficeTable.getHeaderRowRange().values = [
          mstrTable.headers.columns[mstrTable.headers.columns.length - 1],
        ];
      }
      await context.sync();
      await this.updateRows(prevOfficeTable, context, rows);
      return prevOfficeTable;
    } catch (error) {
      await context.sync();
      throw error;
    }
  };

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

  styleHeaders = (officeTable, fontColor, fillColor) => {
    officeTable.style = DEFAULT_TABLE_STYLE;
    // Temporarily disabling header formatting
    // const headerRowRange = officeTable.getHeaderRowRange();
    // headerRowRange.format.fill.color = fillColor;
    // headerRowRange.format.font.color = fontColor;
  };

  getOfficeTable = async (isRefresh, excelContext, bindingId, instanceDefinition, startCell) => {
    console.time('Create or get table');
    const newOfficeTableId = bindingId || officeApiHelper.findAvailableOfficeTableId();
    const { mstrTable, columns, rows } = instanceDefinition;
    const { prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab } = mstrTable;
    mstrTable.toCrosstabChange = !prevCrosstabDimensions && isCrosstab;
    mstrTable.fromCrosstabChange = prevCrosstabDimensions && !isCrosstab;
    let officeTable;
    let shouldFormat = true;
    let tableColumnsChanged;
    if (isRefresh) {
      const prevOfficeTable = await officeApiHelper.getTable(excelContext,
        bindingId);
      if (isCrosstab && !mstrTable.toCrosstabChange) officeApiHelper.clearEmptyCrosstabRow(prevOfficeTable); // Since showing Excel table header dont override the data but insert new row, we clear values from empty row in crosstab to prevent it
      prevOfficeTable.showHeaders = true;
      await excelContext.sync();
      tableColumnsChanged = await this.checkColumnsChange(prevOfficeTable, excelContext, instanceDefinition);
      const headerCell = prevOfficeTable.getHeaderRowRange().getCell(0, 0);
      headerCell.load('address');
      await excelContext.sync();
      startCell = officeApiHelper.getStartCell(headerCell.address);
      officeApiHelper.getRange(columns, startCell, rows);
      if (prevCrosstabDimensions) {
        officeApiHelper.clearCrosstabRange(prevOfficeTable, crosstabHeaderDimensions, prevCrosstabDimensions, isCrosstab, excelContext);
      }
      await excelContext.sync();
      if (tableColumnsChanged) {
        console.log('Instance definition changed, creating new table');
        officeTable = await this.createOfficeTable(instanceDefinition, excelContext, startCell, newOfficeTableId, prevOfficeTable);
      } else {
        shouldFormat = false;
        console.time('Validate existing table');
        officeTable = await this.updateOfficeTable(instanceDefinition, excelContext, startCell, prevOfficeTable);
        console.timeEnd('Validate existing table');
      }
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

  checkRangeValidity = async (context, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await context.sync();
    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError(TABLE_OVERLAP);
    }
  };

  checkColumnsChange = async (prevOfficeTable, context, instanceDefinition) => {
    const { columns } = instanceDefinition;
    const tableColumns = prevOfficeTable.columns;
    tableColumns.load('count');
    await context.sync();
    const tableColumnsCount = tableColumns.count;
    return columns !== tableColumnsCount;
  };

  getTableStartCell = (startCell, sheet, instanceDefinition, prevOfficeTable, toCrosstabChange, fromCrosstabChange, prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab, columnsY, prevColumnsY, rowsX, prevRowsX) => {
    let tableStartCell = officeApiHelper.getTableStartCell({ startCell, sheet, instanceDefinition, prevOfficeTable, toCrosstabChange, fromCrosstabChange });
    if (prevCrosstabDimensions && prevCrosstabDimensions !== crosstabHeaderDimensions && isCrosstab) {
      tableStartCell = officeApiHelper.offsetCellBy(tableStartCell, columnsY - prevColumnsY, rowsX - prevRowsX);
    }
    return tableStartCell;
  }

  getExcelWorksheet = (prevOfficeTable, context) => (prevOfficeTable ? prevOfficeTable.worksheet : context.workbook.worksheets.getActiveWorksheet())

  getObjectRange = (isCrosstab, tableStartCell, crosstabHeaderDimensions, sheet, tableRange) => {
    if (isCrosstab) {
      return officeApiHelper.getCrosstabRange(tableStartCell, crosstabHeaderDimensions, sheet);
    }
    return sheet.getRange(tableRange);
  }

  createCrosstabHeaders = (tableStartCell, mstrTable, sheet, range, crosstabHeaderDimensions) => {
    officeApiHelper.createColumnsHeaders(tableStartCell, mstrTable.headers.columns, sheet, range);
    officeApiHelper.createRowsTitleHeaders(tableStartCell, mstrTable.attributesNames, sheet, crosstabHeaderDimensions);
  }

  async checkObjectRangeValidity(prevOfficeTable, context, columns, rows, range) {
    if (prevOfficeTable) {
      prevOfficeTable.rows.load('count');
      await context.sync();
      const addedColumns = Math.max(0, columns - prevOfficeTable.columns.count);
      const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);
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

  bindOfficeTable = async (officeTable, officeTableId, mstrTable, sheet, context, isCrosstab) => {
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
