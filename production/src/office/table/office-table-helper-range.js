import { TABLE_OVERLAP } from '../../error/constants';
import { OverlappingTablesError } from '../../error/overlapping-tables-error';

class OfficeTableHelperRange {
  /**
   * Checks if the range for the table after refresh is cleared.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} context excelContext
   * @param {Object} range range of the resized table
   * @param {Object} instanceDefinition
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  async checkObjectRangeValidity(prevOfficeTable, context, range, instanceDefinition) {
    if (prevOfficeTable) {
      await this.checkObjectRangeValidityOnRefresh(prevOfficeTable, context, instanceDefinition);
    } else {
      await this.checkRangeValidity(context, range);
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

    const { addedRows, addedColumns } = this.calculateRowsAndColumnsSize(
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

  prepareRangeColumns = (prevOfficeTable, addedColumns) => {
    prevOfficeTable
      .getRange()
      .getColumnsAfter(addedColumns);
  };

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
   * @param {Object} prevOfficeTable previous office table
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

  prepareRangeRows = (prevOfficeTable, addedColumns, addedRows) => {
    prevOfficeTable
      .getRange()
      .getRowsBelow(addedRows)
      .getResizedRange(0, addedColumns);
  };

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
      throw new OverlappingTablesError(TABLE_OVERLAP);
    }
  };
}

const officeTableHelperRange = new OfficeTableHelperRange();
export default officeTableHelperRange;
