import { officeApiHelper } from './office-api-helper';
import { CONTEXT_LIMIT } from '../mstr-object/mstr-object-rest-service';
import { TABLE_OVERLAP } from '../error/constants';
import { OverlappingTablesError } from '../error/overlapping-tables-error';
import { officeFormattingHelper } from './office-formatting-helper';

const DEFAULT_TABLE_STYLE = 'TableStyleLight11';
const TABLE_HEADER_FONT_COLOR = '#000000';
const TABLE_HEADER_FILL_COLOR = '#ffffff';

class OfficeTableHelper {
  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {Object} instanceDefinition
   * @param {Object} excelContext ExcelContext
   * @param {string} startCell  Top left corner cell
   * @param {string} newOfficeTableName Excel Binding ID
   * @param {Object} prevOfficeTable Previous office table to refresh
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed. False by default
   *
   * @memberOf OfficeTableHelper
   */
  createOfficeTable = async (
    instanceDefinition,
    excelContext,
    startCell,
    newOfficeTableName,
    prevOfficeTable,
    tableColumnsChanged = false) => {
    const {
      rows, columns, mstrTable, mstrTable:{ isCrosstab, crosstabHeaderDimensions }
    } = instanceDefinition;

    const sheet = this.getExcelWorksheet(prevOfficeTable, excelContext);
    const tableStartCell = this.getTableStartCell(
      startCell,
      sheet,
      instanceDefinition,
      prevOfficeTable,
      tableColumnsChanged
    );

    const tableRange = officeApiHelper.getRange(columns, tableStartCell, rows);
    const range = this.getObjectRange(tableStartCell, sheet, tableRange, mstrTable);
    excelContext.trackedObjects.add(range);
    await this.checkObjectRangeValidity(prevOfficeTable, excelContext, range, instanceDefinition);

    if (isCrosstab) {
      this.createCrosstabHeaders(tableStartCell, mstrTable, sheet, crosstabHeaderDimensions);
    }

    const officeTable = sheet.tables.add(tableRange, true); // create office table based on the range
    this.styleHeaders(officeTable, TABLE_HEADER_FONT_COLOR, TABLE_HEADER_FILL_COLOR);
    return this.setOfficeTableProperties(officeTable, newOfficeTableName, mstrTable, sheet, excelContext);
  };

  /**
   * Updates office table if the number of columns or rows of an existing table changes.
   *
   * @param {Object} instanceDefinition
   * @param {Object} excelContext ExcelContext
   * @param {string} startCell  Top left corner cell
   * @param {Object} prevOfficeTable Previous office table to refresh
   *
   * @memberOf OfficeTableHelper
   */
  updateOfficeTable = async (instanceDefinition, excelContext, startCell, prevOfficeTable) => {
    try {
      const { rows, mstrTable, mstrTable:{ isCrosstab, subtotalsInfo:{ subtotalsAddresses } } } = instanceDefinition;
      const crosstabHeaderDimensions = this.getCrosstabHeaderDimensions(instanceDefinition);

      prevOfficeTable.rows.load('count');
      await excelContext.sync();
      if (subtotalsAddresses.length) {
        await officeFormattingHelper.applySubtotalFormatting(
          { officeTable:prevOfficeTable, excelContext },
          mstrTable,
          false
        );
      }
      const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);
      // If the new table has more rows during update check validity
      if (addedRows) {
        const bottomRange = prevOfficeTable.getRange().getRowsBelow(addedRows);
        await this.checkRangeValidity(excelContext, bottomRange);
      }
      if (isCrosstab) {
        try {
          const sheet = prevOfficeTable.worksheet;
          this.createCrosstabHeaders(startCell, mstrTable, sheet, crosstabHeaderDimensions);
        } catch (error) {
          console.log(error);
        }
      }
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      if (!mstrTable.isCrosstab) {
        prevOfficeTable.getHeaderRowRange().values = [mstrTable.headers.columns[mstrTable.headers.columns.length - 1]];
      }
      await excelContext.sync();
      await this.updateRows(prevOfficeTable, excelContext, rows);
      return prevOfficeTable;
    } catch (error) {
      await excelContext.sync();
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
      // if there is no attributes in rows we need to setup 1 for offset for column attributes names
      rowsX: isCrosstab ? (headers.rows[0].length || 1) : 0,
      rowsY: isCrosstab ? instanceDefinition.rows : 0,
    };
  }

  /**
   * Updates number of rows in office table.
   *
   * @param {Object} prevOfficeTable Previous office table to refresh
   * @param {Object} excelContext ExcelContext
   * @param {number} rows  number of rows in the object
   *
   * @memberOf OfficeTableHelper
   */
  updateRows = async (prevOfficeTable, excelContext, rows) => {
    const tableRows = prevOfficeTable.rows;
    tableRows.load('count');
    await excelContext.sync();
    const tableRowCount = tableRows.count;
    // Delete extra rows if new report is smaller
    if (rows < tableRowCount) {
      prevOfficeTable
        .getRange()
        .getRow(rows + 1)
        .getResizedRange(tableRowCount - rows, 0)
        .clear();
      await excelContext.sync();
      tableRows.load('items');
      await excelContext.sync();
      const rowsToRemove = tableRows.items;
      for (let i = tableRowCount - 1; i >= rows; i--) {
        rowsToRemove[i].delete();
        if (i === rows || i % CONTEXT_LIMIT === 0) {
          // eslint-disable-next-line no-await-in-loop
          await excelContext.sync();
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
  getOfficeTable = async (
    isRefresh,
    excelContext,
    bindingId,
    instanceDefinition,
    startCell,
    tableName,
    previousTableDimensions,
    visualizationInfo
  ) => {
    console.time('Create or get table');
    let newBindingId;
    const { mstrTable } = instanceDefinition;

    const newOfficeTableName = this.createTableName(mstrTable, tableName);

    this.checkReportTypeChange(instanceDefinition);

    let officeTable;
    let shouldFormat = true;
    let tableColumnsChanged = false;

    if (isRefresh) {
      ({
        tableColumnsChanged,
        startCell,
        officeTable,
        shouldFormat,
        newBindingId
      } = await this.changeOfficeTableOnRefresh(
        excelContext,
        bindingId,
        instanceDefinition,
        startCell,
        officeTable,
        newOfficeTableName,
        shouldFormat,
        previousTableDimensions,
        visualizationInfo
      ));
    } else {
      ({ officeTable, newBindingId } = await this.createOfficeTable(
        instanceDefinition,
        excelContext,
        startCell,
        newOfficeTableName
      ));
    }
    console.timeEnd('Create or get table');
    return {
      officeTable,
      newOfficeTableName,
      shouldFormat,
      tableColumnsChanged,
      newBindingId,
    };
  }

  /**
   * Checks if the range is empty
   *
   * @param {Object} excelContext excelContext
   * @param {Object} excelRange range in which table will be inserted
   *
   * @memberOf OfficeTableHelper
   */
  checkRangeValidity = async (excelContext, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await excelContext.sync();
    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError(TABLE_OVERLAP);
    }
  };

  /**
   * Compares if the number of columns in table has changed.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext excelContext
   * @param {Object} instanceDefinition
   *
   * @memberOf OfficeTableHelper
   */
  checkColumnsChange = async (prevOfficeTable, excelContext, instanceDefinition, previousTableDimensions) => {
    const { columns } = instanceDefinition;
    const tableColumns = prevOfficeTable.columns;
    const prevTableColumns = previousTableDimensions.columns;
    tableColumns.load('count');
    await excelContext.sync();
    const tableColumnsCount = tableColumns.count;
    return columns !== tableColumnsCount || columns !== prevTableColumns;
  };

  /**
   * Get excel worksheet of previous office table or acxtive if no table was passed.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext excelContext
   *
   * @memberOf OfficeTableHelper
   */
  getExcelWorksheet = (prevOfficeTable, excelContext) => {
    if (prevOfficeTable) {
      return prevOfficeTable.worksheet;
    }
    return excelContext.workbook.worksheets.getActiveWorksheet();
  }

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
  getObjectRange = (tableStartCell, sheet, tableRange, mstrTable) => {
    const { isCrosstab, crosstabHeaderDimensions } = mstrTable;
    if (isCrosstab) {
      return officeApiHelper.getCrosstabRange(tableStartCell, crosstabHeaderDimensions, sheet);
    }
    return sheet.getRange(tableRange);
  };

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

  createTableName = (mstrTable, tableName) => {
    if (tableName) {
      return tableName;
    }
    const excelCompatibleTableName = mstrTable.name.replace(/(\.|•|‼| |!|#|\$|%|&|'|\(|\)|\*|\+|,|-|\/|:|;|<|=|>|@|\^|`|\{|\||\}|~|¢|£|¥|¬|«|»)/g, '_');
    return `_${excelCompatibleTableName.slice(0, 239)}_${Date.now().toString()}`;
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
   * @param {String} newOfficeTableName new name for office table
   * @param {Boolean} shouldFormat
   *
   * @memberOf OfficeTableHelper
   */
  async changeOfficeTableOnRefresh(
    excelContext,
    bindingId,
    instanceDefinition,
    startCell,
    officeTable,
    newOfficeTableName,
    shouldFormat,
    previousTableDimensions,
    visualizationInfo
  ) {
    const { mstrTable, mstrTable:{ isCrosstab, prevCrosstabDimensions } } = instanceDefinition;
    const prevOfficeTable = await officeApiHelper.getTable(excelContext, bindingId);

    if (isCrosstab && !mstrTable.toCrosstabChange) {
      const crosstabEmptyRowExist = await officeApiHelper.getValidOffset(prevOfficeTable, prevCrosstabDimensions.columnsY, 'getRowsAbove', excelContext);
      if (crosstabEmptyRowExist) {
        officeApiHelper.clearEmptyCrosstabRow(prevOfficeTable);
      }
    }
    prevOfficeTable.showHeaders = true;
    prevOfficeTable.load('name');
    await excelContext.sync();

    let tableColumnsChanged = await this.checkColumnsChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions
    );
    startCell = await this.getStartCellOnRefresh(prevOfficeTable, excelContext);

    ({ tableColumnsChanged, startCell } = await this.clearIfCrosstabHeadersChanged(
      prevOfficeTable,
      excelContext,
      tableColumnsChanged,
      startCell,
      mstrTable
    ));

    let newBindingId = bindingId;
    if (tableColumnsChanged) {
      console.log('Instance definition changed, creating new table');

      newOfficeTableName = prevOfficeTable.name;
      ({ officeTable, newBindingId } = await this.createOfficeTable(
        instanceDefinition,
        excelContext,
        startCell,
        newOfficeTableName,
        prevOfficeTable,
        tableColumnsChanged,
      ));
    } else {
      shouldFormat = visualizationInfo.formatShouldUpdate || false;
      console.time('Validate existing table');
      officeTable = await this.updateOfficeTable(
        instanceDefinition,
        excelContext,
        startCell,
        prevOfficeTable,
        tableColumnsChanged
      );
      console.timeEnd('Validate existing table');
    }
    return {
      tableColumnsChanged, startCell, officeTable, shouldFormat, newBindingId
    };
  }


  /**
   * Get top left cell from the excel table.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext
   *
   * @memberOf OfficeTableHelper
   */
   getStartCellOnRefresh = async (prevOfficeTable, excelContext) => {
     const headerCell = prevOfficeTable.getHeaderRowRange().getCell(0, 0);
     headerCell.load('address');
     await excelContext.sync();
     return officeApiHelper.getStartCellOfRange(headerCell.address);
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

    let tableStartCell = officeApiHelper.getTableStartCell({
      startCell,
      sheet,
      instanceDefinition,
      prevOfficeTable,
      tableColumnsChanged
    });


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
   * @param {Object} excelContext excel context
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed
   * @param {string} startCell  Starting cell of Table
   * @param {Object} mstrTable  contains informations about mstr object
   *
   * @memberOf OfficeTableHelper
   */
   clearIfCrosstabHeadersChanged = async (prevOfficeTable, excelContext, tableColumnsChanged, startCell, mstrTable) => {
     const { prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab } = mstrTable;
     const { validColumnsY, validRowsX } = await officeApiHelper.getCrosstabHeadersSafely(
       prevOfficeTable,
       prevCrosstabDimensions.columnsY,
       excelContext,
       prevCrosstabDimensions.rowsX
     );

     if (isCrosstab && crosstabHeaderDimensions && prevCrosstabDimensions) {
       if (validRowsX !== crosstabHeaderDimensions.rowsX
      || validColumnsY !== crosstabHeaderDimensions.columnsY) {
         tableColumnsChanged = true;
         prevCrosstabDimensions.rowsX = validRowsX;
         prevCrosstabDimensions.columnsY = validColumnsY;
       } if (tableColumnsChanged) {
         startCell = officeApiHelper.offsetCellBy(
           startCell,
           -prevCrosstabDimensions.columnsY,
           -prevCrosstabDimensions.rowsX
         );
       }
     }

     if (prevCrosstabDimensions) {
       officeApiHelper.clearCrosstabRange(prevOfficeTable, mstrTable, excelContext);
     }

     await excelContext.sync();
     return { tableColumnsChanged, startCell };
   }

   /**
   * Checks if the range for the table after refresh is cleared.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} context excelContext
   * @param {Object} range range of the resized table
   * @param {Object} instanceDefinition
   *
   * @memberOf OfficeTableHelper
   */
   async checkObjectRangeValidity(prevOfficeTable, context, range, instanceDefinition) {
     if (prevOfficeTable) {
       await this.checkObjectRangeValidityOnRefresh(prevOfficeTable, context, instanceDefinition);
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
   * @param {Object} excelContext excelContext
   *
   * @memberOf OfficeTableHelper
   */
  setOfficeTableProperties = async (officeTable, newOfficeTableName, mstrTable, sheet, excelContext) => {
    const { isCrosstab } = mstrTable;
    try {
      officeTable.load(['name', 'id']);
      officeTable.name = newOfficeTableName;
      if (isCrosstab) {
        officeTable.showFilterButton = false;
        officeTable.showHeaders = false;
      } else {
        officeTable.getHeaderRowRange().values = [mstrTable.headers.columns[mstrTable.headers.columns.length - 1]];
      }
      sheet.activate();
      await excelContext.sync();
      const newBindingId = officeTable.id;

      return { officeTable, newBindingId };
    } catch (error) {
      await excelContext.sync();
      throw error;
    }
  }

  /**
   * checks if range is valid on refresh
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext excelContext
   * @param {Object} instanceDefinition
   * @memberOf OfficeTableHelper
   */
  async checkObjectRangeValidityOnRefresh(prevOfficeTable, excelContext, instanceDefinition) {
    const { rows, columns, mstrTable } = instanceDefinition;

    prevOfficeTable.rows.load('count');
    await excelContext.sync();

    let addedColumns = Math.max(0, columns - prevOfficeTable.columns.count);
    let addedRows = Math.max(0, rows - prevOfficeTable.rows.count);

    ({ addedRows, addedColumns } = this.checkCrosstabAddedRowsAndColumns(mstrTable, addedRows, addedColumns));

    await this.checkExtendedRange(addedColumns, prevOfficeTable, mstrTable, excelContext, addedRows);
    excelContext.runtime.enableEvents = false;
    await excelContext.sync();
    prevOfficeTable.delete();
    excelContext.runtime.enableEvents = true;
    await excelContext.sync();
  }

  /**
   * checks the added rows and columns for crosstab.
   *
   * @param {Object} mstrTable contains informations about mstr object
   * @param {number} addedColumns excelContext
   * @param {number} addedRows shows the number of added rows to the table
   *
   * @memberOf OfficeTableHelper
   */
  checkCrosstabAddedRowsAndColumns = (mstrTable, addedRows, addedColumns) => {
    const { isCrosstab, crosstabHeaderDimensions, prevCrosstabDimensions } = mstrTable;
    const { columnsY: prevColumnsY, rowsX: prevRowsX } = prevCrosstabDimensions;
    const { columnsY: crosstabColumnsY, rowsX: crosstabRowsX } = crosstabHeaderDimensions;

    if (isCrosstab) {
      if (!prevCrosstabDimensions) {
        addedRows += crosstabColumnsY;
        addedColumns += crosstabRowsX;
      } else if (prevColumnsY === crosstabColumnsY && prevRowsX === crosstabRowsX) {
        addedRows += (crosstabColumnsY - prevColumnsY);
        addedColumns += (crosstabRowsX - prevRowsX);
      }
    }
    return { addedRows, addedColumns };
  }

  /**
   * checks if range is valid on refresh for added columns and rows
   *
   * @param {Number} addedColumns shows the number of added columns to the table
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} mstrTable contains informations about mstr object
   * @param {Object} context excelContext
   * @param {number} addedRows shows the number of added rows to the table
   *
   * @memberOf OfficeTableHelper
   */
  async checkExtendedRange(addedColumns, prevOfficeTable, mstrTable, context, addedRows) {
    const { isCrosstab, prevCrosstabDimensions } = mstrTable;

    if (addedColumns) {
      let rightRange = prevOfficeTable
        .getRange()
        .getColumnsAfter(addedColumns);

      if (isCrosstab) {
        rightRange = rightRange
          .getOffsetRange(-prevCrosstabDimensions.columnsY, 0)
          .getResizedRange(prevCrosstabDimensions.columnsY, 0);
      }

      await this.checkRangeValidity(context, rightRange);
    }
    if (addedRows) {
      let bottomRange = prevOfficeTable
        .getRange()
        .getRowsBelow(addedRows)
        .getResizedRange(0, addedColumns);

      if (isCrosstab) {
        bottomRange = bottomRange
          .getOffsetRange(0, -prevCrosstabDimensions.rowsX)
          .getResizedRange(0, prevCrosstabDimensions.rowsX);
      }

      await this.checkRangeValidity(context, bottomRange);
    }
  }
}
export const officeTableHelper = new OfficeTableHelper();
export default officeTableHelper;
