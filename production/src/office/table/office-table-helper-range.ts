import {
  InstanceDefinition,
  MstrTable,
} from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { CrosstabHeaderDimensions, ObjectData } from '../../types/object-types';

import { OverlappingTablesError } from '../../error/overlapping-tables-error';
import { ErrorMessages } from '../../error/constants';
import { ObjectImportType } from '../../mstr-object/constants';

class OfficeTableHelperRange {
  /**
   * Checks if the range for the table is clear.
   *
   * @param prevOfficeTable Reference to previously imported Excel table
   * @param excelContext excelContext
   * @param range range of the resized table
   * @param instanceDefinition
   * @param isRepeatStep Specify if repeat creating of the table
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  async checkObjectRangeValidity(
    prevOfficeTable: Excel.Table | null,
    excelContext: Excel.RequestContext,
    range: Excel.Range,
    instanceDefinition: InstanceDefinition,
    isRepeatStep: boolean,
    objectData: ObjectData,
    objectDetailsRange?: Excel.Range,
  ): Promise<void> {
    if (prevOfficeTable) {
      if (isRepeatStep) {
        await this.checkRangeValidity(excelContext, range);
        await this.deletePrevOfficeTable(excelContext, prevOfficeTable, objectData);
      } else {
        await this.checkObjectRangeValidityOnRefresh(
          prevOfficeTable,
          excelContext,
          instanceDefinition,
        );
        await this.deletePrevOfficeTable(excelContext, prevOfficeTable, objectData);
      }
    } else {
      await this.checkRangeValidity(excelContext, range);
      if (objectDetailsRange) {
        await this.checkRangeValidity(excelContext, objectDetailsRange);
      }
    }
  }

  /**
   * Checks if range is valid on refresh.
   *
   * @param prevOfficeTable previous office table
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param instanceDefinition
   *
   */
  async checkObjectRangeValidityOnRefresh(
    prevOfficeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    instanceDefinition: InstanceDefinition,
  ): Promise<void> {
    const { rows, columns, mstrTable } = instanceDefinition;

    const { addedRows, addedColumns } = await this.calculateRowsAndColumnsSize(
      excelContext,
      mstrTable,
      prevOfficeTable,
      rows,
      columns
    );

    await this.checkExtendedRangeRows(
      addedColumns,
      prevOfficeTable,
      mstrTable,
      excelContext,
      addedRows
    );

    await this.checkExtendedRangeColumns(addedColumns, prevOfficeTable, mstrTable, excelContext);
  }

  /**
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param mstrTable contains informations about mstr object
   * @param prevOfficeTable previous office table
   * @param rows number of rows in the table
   * @param columns number of columns in the table
   * @returns
   */
  async calculateRowsAndColumnsSize(
    excelContext: Excel.RequestContext,
    mstrTable: MstrTable,
    prevOfficeTable: Excel.Table,
    rows: number,
    columns: number
  ): Promise<{ addedRows: number; addedColumns: number }> {
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
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param prevOfficeTable previous office table
   */
  async deletePrevOfficeTable(
    excelContext: Excel.RequestContext,
    prevOfficeTable: Excel.Table,
    objectData: ObjectData,
  ): Promise<void> {
    excelContext.runtime.enableEvents = false;
    await excelContext.sync();

    const { importType, isCrosstab } = objectData;

    if (importType === ObjectImportType.FORMATTED_DATA && isCrosstab) {
      const range = prevOfficeTable.getRange().getOffsetRange(-1, 0).getResizedRange(1, 0);
      range.clear();
    } else {
      prevOfficeTable.delete();
    }

    excelContext.runtime.enableEvents = true;
    await excelContext.sync();
  }

  /**
   * Checks the added rows and columns for crosstab.
   *
   * @param mstrTable contains informations about mstr object
   * @param addedColumns excelContext
   * @param addedRows shows the number of added rows to the table
   * @returns Object containing differnce in crosstab headers rows and columns
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  checkCrosstabAddedRowsAndColumns(
    mstrTable: MstrTable,
    addedRows: number,
    addedColumns: number
  ): { addedRows: number; addedColumns: number } {
    const { isCrosstab, crosstabHeaderDimensions, prevCrosstabDimensions } = mstrTable;

    if (isCrosstab) {
      const { columnsY: prevColumnsY, rowsX: prevRowsX } =
        prevCrosstabDimensions as CrosstabHeaderDimensions;
      const { columnsY: crosstabColumnsY, rowsX: crosstabRowsX } = crosstabHeaderDimensions;

      if (!prevCrosstabDimensions) {
        addedRows += crosstabColumnsY;
        addedColumns += crosstabRowsX;
      } else if (prevColumnsY === crosstabColumnsY && prevRowsX === crosstabRowsX) {
        addedRows += crosstabColumnsY - prevColumnsY;
        addedColumns += crosstabRowsX - prevRowsX;
      }
    }

    return {
      addedRows,
      addedColumns,
    };
  }

  /**
   * Checks if range is valid on refresh for added columns.
   *
   * @param addedColumns shows the number of added columns to the table
   * @param prevOfficeTable previous office table
   * @param mstrTable contains informations about mstr object
   * @param excelContext Reference to Excel Context used by Excel API functions
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  async checkExtendedRangeColumns(
    addedColumns: number,
    prevOfficeTable: Excel.Table,
    mstrTable: MstrTable,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    const { isCrosstab, prevCrosstabDimensions } = mstrTable;

    if (addedColumns) {
      const range = this.prepareRangeColumns(prevOfficeTable, addedColumns);
      const rangeCrosstab = this.prepareRangeColumnsCrosstab(
        range,
        (prevCrosstabDimensions as CrosstabHeaderDimensions).columnsY,
        isCrosstab
      );

      await this.checkRangeValidity(excelContext, rangeCrosstab);
    }
  }

  /**
   * Extends the Excel table range for columns added during import/refresh.
   *
   * @param prevOfficeTable Reference to previously imported Excel table
   * @param addedColumns Number of added columns to the table
   *
   * @returns Reference to Excel range object
   */
  prepareRangeColumns(prevOfficeTable: Excel.Table, addedColumns: number): Excel.Range {
    return prevOfficeTable.getRange().getColumnsAfter(addedColumns);
  }

  /**
   * Extends the Excel range by crosstab header column dimension.
   *
   * For tabular report return range without changes.
   *
   * @param range Reference to Excel range object.
   * @param columnsY Number of rows in crosstab column headers
   * @param isCrosstab Specify if object is a crosstab
   *
   * @returns Reference to Excel range object
   */
  prepareRangeColumnsCrosstab(
    range: Excel.Range,
    columnsY: number,
    isCrosstab: boolean
  ): Excel.Range {
    if (isCrosstab) {
      return range.getOffsetRange(-columnsY, 0).getResizedRange(columnsY, 0);
    }

    return range;
  }

  /**
   * Checks if range is valid on refresh for added rows.
   *
   * @param addedColumns shows the number of added columns to the table
   * @param prevOfficeTable Reference to previously imported Excel table
   * @param mstrTable contains informations about mstr object
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param addedRows shows the number of added rows to the table
   *
   * @throws {OverlappingTablesError} when range is not empty.
   */
  async checkExtendedRangeRows(
    addedColumns: number,
    prevOfficeTable: Excel.Table,
    mstrTable: MstrTable,
    excelContext: Excel.RequestContext,
    addedRows: number
  ): Promise<void> {
    const { isCrosstab, prevCrosstabDimensions } = mstrTable;

    if (addedRows) {
      const range = this.prepareRangeRows(prevOfficeTable, addedColumns, addedRows);
      const rangeCrosstab = this.prepareRangeRowsCrosstab(
        range,
        (prevCrosstabDimensions as CrosstabHeaderDimensions).rowsX,
        isCrosstab
      );

      await this.checkRangeValidity(excelContext, rangeCrosstab);
    }
  }

  /**
   * Extends the Excel table range for rows and columns added during import/refresh.
   *
   * @param prevOfficeTable Reference to previously imported Excel table
   * @param addedColumns Number of added columns to the table
   * @param addedRows Number of added rows to the table
   *
   * @returns Reference to Excel range object
   */
  prepareRangeRows(
    prevOfficeTable: Excel.Table,
    addedColumns: number,
    addedRows: number
  ): Excel.Range {
    return prevOfficeTable.getRange().getRowsBelow(addedRows).getResizedRange(0, addedColumns);
  }

  /**
   * Extends the Excel range by crosstab header row dimension.
   *
   * For tabular report returns range without changes.
   *
   * @param range Reference to Excel range object.
   * @param rowsX Number of columns in crosstab row headers
   * @param isCrosstab Specify if object is a crosstab
   *
   * @returns Reference to Excel range object
   */
  prepareRangeRowsCrosstab(range: Excel.Range, rowsX: number, isCrosstab: boolean): Excel.Range {
    if (isCrosstab) {
      return range.getOffsetRange(0, -rowsX).getResizedRange(0, rowsX);
    }

    return range;
  }

  /**
   * Checks if the range is empty.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param excelRange range in which table will be inserted
   *
   * @throws when excelRange is not empty.
   */
  async checkRangeValidity(
    excelContext: Excel.RequestContext,
    excelRange: Excel.Range
  ): Promise<void> {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await excelContext.sync();

    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError(ErrorMessages.TABLE_OVERLAP);
    }
  }
}

const officeTableHelperRange = new OfficeTableHelperRange();
export default officeTableHelperRange;
