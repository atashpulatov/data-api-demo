import { errorMessages } from '../../error/constants';
import { OverlappingTablesError } from '../../error/overlapping-tables-error';

class OfficeTableHelperRange {
  /**
   * Checks if the range for the table is clear.
   *
   * @param {Office} prevOfficeTable Reference to previously imported Excel table
   * @param {Office} excelContext excelContext
   * @param {Office} range range of the resized table
   * @param {Object} instanceDefinition
   * @param {Boolean} isRepeatStep Specify if repeat creating of the table
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  async checkObjectRangeValidity(prevOfficeTable, excelContext, range, instanceDefinition, isRepeatStep) {
    if (prevOfficeTable) {
      if (isRepeatStep) {
        await this.checkRangeValidity(excelContext, range);
        await this.deletePrevOfficeTable(excelContext, prevOfficeTable);
      } else {
        await this.checkObjectRangeValidityOnRefresh(prevOfficeTable, excelContext, instanceDefinition);
      }
    } else {
      await this.checkRangeValidity(excelContext, range);
    }
  }

  /**
   * Checks if range is valid on refresh.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} instanceDefinition
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  async checkObjectRangeValidityOnRefresh(prevOfficeTable, excelContext, instanceDefinition) {
    const { rows, columns, mstrTable } = instanceDefinition;

    const { addedRows, addedColumns } = await this.calculateRowsAndColumnsSize(
      excelContext,
      mstrTable,
      prevOfficeTable,
      rows,
      columns
    );

    await this.checkExtendedRangeRows(addedColumns, prevOfficeTable, mstrTable, excelContext, addedRows);

    await this.checkExtendedRangeColumns(addedColumns, prevOfficeTable, mstrTable, excelContext);

    await this.deletePrevOfficeTable(excelContext, prevOfficeTable);
  }

  /**
   *
   * @param excelContext
   * @param mstrTable
   * @param prevOfficeTable
   * @param rows
   * @param columns
   * @returns {Promise<{addedRows, addedColumns}>}
   */
  async calculateRowsAndColumnsSize(excelContext, mstrTable, prevOfficeTable, rows, columns) {
    prevOfficeTable.columns.load('count');
    prevOfficeTable.rows.load('count');
    await excelContext.sync();

    const addedColumns = Math.max(0, columns - prevOfficeTable.columns.count);
    const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);

    return this.checkCrosstabAddedRowsAndColumns(mstrTable, addedRows, addedColumns);
  }

  /**
   * Removes table created on import during refresh/edit workflow.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} prevOfficeTable previous office table
   */
  deletePrevOfficeTable = async (excelContext, prevOfficeTable) => {
    excelContext.runtime.enableEvents = false;
    await excelContext.sync();

    prevOfficeTable.delete();

    excelContext.runtime.enableEvents = true;
    await excelContext.sync();
  };

  /**
   * Checks the added rows and columns for crosstab.
   *
   * @param {Object} mstrTable contains informations about mstr object
   * @param {number} addedColumns excelContext
   * @param {number} addedRows shows the number of added rows to the table
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  checkCrosstabAddedRowsAndColumns = (mstrTable, addedRows, addedColumns) => {
    const { isCrosstab, crosstabHeaderDimensions, prevCrosstabDimensions } = mstrTable;

    if (isCrosstab) {
      const { columnsY: prevColumnsY, rowsX: prevRowsX } = prevCrosstabDimensions;
      const { columnsY: crosstabColumnsY, rowsX: crosstabRowsX } = crosstabHeaderDimensions;

      if (!prevCrosstabDimensions) {
        addedRows += crosstabColumnsY;
        addedColumns += crosstabRowsX;
      } else if (prevColumnsY === crosstabColumnsY && prevRowsX === crosstabRowsX) {
        addedRows += (crosstabColumnsY - prevColumnsY);
        addedColumns += (crosstabRowsX - prevRowsX);
      }
    }

    return {
      addedRows,
      addedColumns
    };
  };

  /**
   * Checks if range is valid on refresh for added columns.
   *
   * @param {Number} addedColumns shows the number of added columns to the table
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} mstrTable contains informations about mstr object
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  async checkExtendedRangeColumns(addedColumns, prevOfficeTable, mstrTable, excelContext) {
    const { isCrosstab, prevCrosstabDimensions } = mstrTable;

    if (addedColumns) {
      const range = this.prepareRangeColumns(prevOfficeTable, addedColumns);
      const rangeCrosstab = this.prepareRangeColumnsCrosstab(range, prevCrosstabDimensions.columnsY, isCrosstab);

      await this.checkRangeValidity(excelContext, rangeCrosstab);
    }
  }

  /**
   * Extends the Excel table range for columns added during import/refresh.
   *
   * @param {Office} prevOfficeTable Reference to previously imported Excel table
   * @param {Number} addedColumns Number of added columns to the table
   *
   * @returns {Office} Reference to Excel range object
   */
  prepareRangeColumns = (prevOfficeTable, addedColumns) => prevOfficeTable.getRange().getColumnsAfter(addedColumns);

  /**
   * Extends the Excel range by crosstab header column dimension.
   *
   * For tabular report return range without changes.
   *
   * @param {Office} range Reference to Excel range object.
   * @param {number} columnsY Number of rows in crosstab column headers
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   *
   * @returns {Office} Reference to Excel range object
   */
  prepareRangeColumnsCrosstab = (range, columnsY, isCrosstab) => {
    if (isCrosstab) {
      return range
        .getOffsetRange(-columnsY, 0)
        .getResizedRange(columnsY, 0);
    }

    return range;
  };

  /**
   * Checks if range is valid on refresh for added rows.
   *
   * @param {Number} addedColumns shows the number of added columns to the table
   * @param {Office} prevOfficeTable Reference to previously imported Excel table
   * @param {Object} mstrTable contains informations about mstr object
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {number} addedRows shows the number of added rows to the table
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  async checkExtendedRangeRows(addedColumns, prevOfficeTable, mstrTable, excelContext, addedRows) {
    const { isCrosstab, prevCrosstabDimensions } = mstrTable;

    if (addedRows) {
      const range = this.prepareRangeRows(prevOfficeTable, addedColumns, addedRows);
      const rangeCrosstab = this.prepareRangeRowsCrosstab(range, prevCrosstabDimensions.rowsX, isCrosstab);

      await this.checkRangeValidity(excelContext, rangeCrosstab);
    }
  }

  /**
   * Extends the Excel table range for rows and columns added during import/refresh.
   *
   * @param {Office} prevOfficeTable Reference to previously imported Excel table
   * @param {Number} addedColumns Number of added columns to the table
   * @param {number} addedRows Number of added rows to the table
   *
   * @returns {Office} Reference to Excel range object
   */
  prepareRangeRows = (prevOfficeTable, addedColumns, addedRows) => prevOfficeTable
    .getRange().getRowsBelow(addedRows).getResizedRange(0, addedColumns);

  /**
   * Extends the Excel range by crosstab header row dimension.
   *
   * For tabular report returns range without changes.
   *
   * @param {Office} range Reference to Excel range object.
   * @param {number} rowsX Number of columns in crosstab row headers
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   *
   * @returns {Office} Reference to Excel range object
   */
  prepareRangeRowsCrosstab = (range, rowsX, isCrosstab) => {
    if (isCrosstab) {
      return range
        .getOffsetRange(0, -rowsX)
        .getResizedRange(0, rowsX);
    }

    return range;
  };

  /**
   * Checks if the range is empty.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} excelRange range in which table will be inserted
   *
   * @throws {OverlappingTablesError} when excelRange is not empty.
   */
  checkRangeValidity = async (excelContext, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await excelContext.sync();

    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError(errorMessages.TABLE_OVERLAP);
    }
  };
}

const officeTableHelperRange = new OfficeTableHelperRange();
export default officeTableHelperRange;
