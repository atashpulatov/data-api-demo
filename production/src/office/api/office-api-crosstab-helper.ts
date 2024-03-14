import { officeApiHeaderMergeHelper } from './office-api-header-merge-helper';

import mstrNormalizedJsonHandler from '../../mstr-object/handler/mstr-normalized-json-handler';

const EXCEL_XTABS_BORDER_COLOR = '#a5a5a5';

// TODO replace any with proper types
class OfficeApiCrosstabHelper {
  /**
   * Gets the total range of crosstab report - it sums table body range and headers ranges
   *
   * @param cellAddress Starting table body cell
   * @param headerDimensions Contains information about crosstab headers dimensions
   * @param sheet Active Excel spreadsheet
   * @return Range for whole crosstab object (table + headers)
   */
  getCrosstabRange = (
    cellAddress: Excel.Range,
    headerDimensions: any,
    sheet: Excel.Worksheet
  ): Excel.Range => {
    const { columnsY, columnsX, rowsX, rowsY } = headerDimensions;
    const cell = typeof cellAddress === 'string' ? sheet.getRange(cellAddress) : cellAddress;
    const bodyRange = cell.getOffsetRange(rowsY, columnsX - 1);
    const startingCell = cell.getCell(0, 0).getOffsetRange(-columnsY, -rowsX);
    return startingCell.getBoundingRect(bodyRange);
  };

  /**
   * Gets the total range of crosstab report - it sums table body range and headers ranges
   *
   * @param officeTable Reference to Excel Table
   * @param headerDimensions Contains information about crosstab headers dimensions
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @return Range for whole crosstab object (table + headers)
   */
  getCrosstabRangeSafely = async (
    officeTable: Excel.Table,
    headerDimensions: any,
    excelContext: Excel.RequestContext
  ): Promise<Excel.Range> => {
    const { validColumnsY, validRowsX } = await this.getCrosstabHeadersSafely(
      headerDimensions,
      officeTable,
      excelContext
    );
    const startingCell = officeTable
      .getRange()
      .getCell(0, 0)
      .getOffsetRange(-validColumnsY, -validRowsX);
    return startingCell.getBoundingRect(officeTable.getRange());
  };

  /**
   * Gets the biggest valid range by checking axis by axis
   *
   * @param officeTable Reference to Excel Table
   * @param limit Number of rows or columns to check
   * @param getFunction Excel range function 'getRowsAbove'|'getColumnsBefore'
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @return maximum number of rows/columns that can referenced
   */
  getValidOffset = async (
    officeTable: Excel.Table,
    limit: number,
    getFunction: 'getRowsAbove' | 'getColumnsBefore',
    excelContext: Excel.RequestContext
  ): Promise<number> => {
    for (let i = 0; i <= limit; i++) {
      try {
        officeTable.getDataBodyRange()[getFunction](i + 1);
        await excelContext.sync();
      } catch (error) {
        return i;
      }
    }
    return limit;
  };

  /**
   * Clears the two crosstab report ranges
   *
   * @param officeTable Reference to Excel Table
   * @param crosstabHeaderDimensions Contains information about crosstab headers dimensions
   * @param prevheaderDimensions Contains information about previous crosstab headers dimensions
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  clearCrosstabRange = async (
    officeTable: Excel.Table,
    mstrTable: any,
    excelContext: Excel.RequestContext,
    isClear = false
  ): Promise<void> => {
    try {
      const { prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab } = mstrTable;
      let leftRange;
      let topRange;
      let titlesRange;

      const { rowsX, columnsY } = prevCrosstabDimensions;

      if (rowsX) {
        // Row headers
        leftRange = officeTable.getRange().getColumnsBefore(rowsX);
        excelContext.trackedObjects.add(leftRange);
        // Title headers
        titlesRange = officeTable
          .getDataBodyRange()
          .getCell(0, 0)
          .getOffsetRange(0, -1)
          .getResizedRange(-(columnsY + 1), -(rowsX - 1));

        excelContext.trackedObjects.add(titlesRange);
      }

      // Column headers
      if (columnsY) {
        topRange = officeTable.getDataBodyRange().getRowsAbove(columnsY + 1);
        excelContext.trackedObjects.add(topRange);
      }
      // Check if ranges are valid before clearing
      await excelContext.sync();

      if (
        isClear ||
        (isCrosstab &&
          JSON.stringify(crosstabHeaderDimensions) === JSON.stringify(prevCrosstabDimensions))
      ) {
        if (columnsY) {
          topRange.clear('Contents');
        }
        if (rowsX) {
          leftRange.clear('Contents');
          titlesRange.clear('Contents');
        }
      } else {
        if (columnsY) {
          topRange.clear();
        }
        if (rowsX) {
          leftRange.clear();
          titlesRange.clear();
        }
      }

      if (columnsY) {
        excelContext.trackedObjects.remove([topRange]);
      }
      if (rowsX) {
        excelContext.trackedObjects.remove([leftRange, titlesRange]);
      }
    } catch (error) {
      officeTable.showHeaders = false;
      throw error;
    }
  };

  /**
   *Prepares parameters for createHeaders
   *
   * @param reportStartingCell Address of the first cell in report (top left)
   * @param rows Contains headers structure and data
   */
  createRowsHeaders = (reportStartingCell: Excel.Range, rows: any[]): void => {
    const rowOffset = rows[0].length || 1; // we put 1 as offset if there are no attribue in rows
    let headerArray = [];
    // we call getCell in case multiple cells are selected
    const startingCell = reportStartingCell.getCell(0, 0).getOffsetRange(0, -rowOffset);
    headerArray = mstrNormalizedJsonHandler.transposeMatrix(rows);
    // transposed array length is 0 if there is no attributes in rows
    const colOffset = !headerArray.length ? rows.length - 1 : headerArray[0].length - 1;
    const headerRange = startingCell.getResizedRange(colOffset, rowOffset - 1);
    this.insertHeadersValues(headerRange, rows, 'rows');
    // TODO: Move merge cells after we import the whole table
    // const directionVector = [0, 1];
    // this.createHeaders(headerArray, startingCell, directionVector);
  };

  /**
   * Create column and title headers for crosstab.
   *
   * @param tableStartCell  Top left corner cell of the table
   * @param mstrTable  contains information about mstr object
   * @param sheet  excel worksheet
   * @param crosstabHeaderDimensions contains dimension of crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   */
  createCrosstabHeaders = (
    tableStartCell: string,
    mstrTable: any,
    sheet: Excel.Worksheet,
    crosstabHeaderDimensions: any
  ): void => {
    const {
      attributesNames,
      headers: { columns },
    } = mstrTable;

    this.createColumnsHeaders(tableStartCell, columns, sheet);

    this.createRowsTitleHeaders(tableStartCell, attributesNames, sheet, crosstabHeaderDimensions);
  };

  /**
   *Prepares parameters for createHeaders
   *
   * @param cellAddress Address of the first cell in report (top left)
   * @param columns Contains headers structure and data
   * @param sheet Active Exccel spreadsheet
   * @return Context.sync
   */
  createColumnsHeaders = (cellAddress: string, columns: any[], sheet: Excel.Worksheet): void => {
    const reportStartingCell = sheet.getRange(cellAddress);
    const columnOffset = columns.length;
    const rowOffset = 0;

    // we call getCell in case multiple cells are selected
    const startingCell = reportStartingCell.getCell(0, 0).getOffsetRange(-columnOffset, -rowOffset);
    const directionVector = [1, 0];

    const headerRange = startingCell.getResizedRange(columns.length - 1, columns[0].length - 1);
    this.insertHeadersValues(headerRange, columns, 'columns');

    return this.createHeaders(columns, startingCell, directionVector);
  };

  /**
   * Create Title headers for crosstab report
   *
   * @param cellAddress Address of the first cell in report (top left)
   * @param attributesNames Contains arrays of attributes names in crosstab report
   * @param sheet Active Exccel spreadsheet
   * @param crosstabHeaderDimensions Contains dimensions of crosstab report headers
   */
  createRowsTitleHeaders = (
    cellAddress: string,
    attributesNames: any,
    sheet: Excel.Worksheet,
    crosstabHeaderDimensions: any
  ): void => {
    const { rowsAttributes, columnsAttributes } = attributesNames;
    const reportStartingCell = sheet.getRange(cellAddress);
    const titlesBottomCell = reportStartingCell.getOffsetRange(0, -1);
    const rowsTitlesRange = titlesBottomCell.getResizedRange(
      0,
      -(crosstabHeaderDimensions.rowsX - 1)
    );

    const columnsTitlesRange = titlesBottomCell
      .getOffsetRange(-1, 0)
      .getResizedRange(-(crosstabHeaderDimensions.columnsY - 1), 0);

    const headerTitlesRange = columnsTitlesRange.getBoundingRect(rowsTitlesRange);
    headerTitlesRange.format.verticalAlignment = window.Excel.VerticalAlignment.bottom;
    this.formatCrosstabRange(headerTitlesRange);
    headerTitlesRange.values = '  ' as unknown as any[][];

    // we are not inserting row attributes names if they do not exist
    if (rowsAttributes && rowsAttributes.length) {
      rowsTitlesRange.values = [rowsAttributes];
      officeApiHeaderMergeHelper.mergeHeaderRows(rowsAttributes, rowsTitlesRange);
    }

    if (columnsAttributes && columnsAttributes.length) {
      columnsTitlesRange.values = mstrNormalizedJsonHandler.transposeMatrix([columnsAttributes]);
      officeApiHeaderMergeHelper.mergeHeaderColumns(columnsAttributes, columnsTitlesRange);
    }
  };

  /**
   * Returns the number of rows and columns headers that are valid for crosstab
   *
   * @param crosstabHeaderDimensions Contains information about crosstab header dimensions
   * @param officeTable Excel Object containig information about Excel Table
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  async getCrosstabHeadersSafely(
    crosstabHeaderDimensions: any,
    officeTable: Excel.Table,
    excelContext: Excel.RequestContext
  ): Promise<any> {
    const { columnsY, rowsX } = crosstabHeaderDimensions;
    const validColumnsY = await this.getValidOffset(
      officeTable,
      columnsY + 1,
      'getRowsAbove',
      excelContext
    );
    const validRowsX = await this.getValidOffset(
      officeTable,
      rowsX,
      'getColumnsBefore',
      excelContext
    );

    return { validColumnsY, validRowsX };
  }

  /**
   * Clear previous formatting and insert data in range
   *
   * @param headerRange Range of the header
   * @param headerArray Contains rows/headers structure and data
   * @param axis - Axis to apply formatting columns or rows
   */
  insertHeadersValues(headerRange: Excel.Range, headerArray: any[][], axis = 'rows'): void {
    headerRange.clear('Contents'); // we are unmerging and removing formatting to avoid conflicts while merging cells
    headerRange.unmerge();
    // if there is no attributes in rows we insert empty string for whole range
    headerRange.values = (axis === 'rows' && !headerArray[0].length ? '' : headerArray) as any[][];
    const hAlign = axis === 'rows' ? 'left' : 'center';
    headerRange.format.horizontalAlignment = window.Excel.HorizontalAlignment[hAlign];
    headerRange.format.verticalAlignment = window.Excel.VerticalAlignment.top;
    this.formatCrosstabRange(headerRange);
  }

  /**
   * Format crosstab range
   *
   * @param range Range of the header
   */
  formatCrosstabRange(range: Excel.Range): void {
    const { borders } = range.format;
    borders.getItem('EdgeTop').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('EdgeRight').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('EdgeBottom').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('EdgeLeft').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('InsideVertical').color = EXCEL_XTABS_BORDER_COLOR;
    borders.getItem('InsideHorizontal').color = EXCEL_XTABS_BORDER_COLOR;
  }

  /**
   * Create Headers structure in Excel
   *
   * @param headerArray Contains rows/headers structure and data
   * @param startingCell Address of the first cell header (top left)
   * @param directionVector direction vertor for the step size when iterating over cells
   */
  createHeaders(headerArray: any[][], startingCell: Excel.Range, directionVector: number[]): void {
    const [offsetForMoving1, offsetForMoving2] = directionVector;
    for (let i = 0; i < headerArray.length - 1; i++) {
      let currentCell = startingCell;
      let rangeToMerge = currentCell;
      for (let j = 0; j < headerArray[i].length; j++) {
        // moving to next attributr value (cell)
        currentCell = currentCell.getOffsetRange(offsetForMoving2, offsetForMoving1);
        if (headerArray[i][j + 1] !== undefined && headerArray[i][j] === headerArray[i][j + 1]) {
          // increasing size of selected range for cells that will be merged
          rangeToMerge = rangeToMerge.getResizedRange(offsetForMoving2, offsetForMoving1);
        } else {
          rangeToMerge.merge();
          rangeToMerge = currentCell;
        }
      }
      // moving to next attribute (row/column)
      startingCell = startingCell.getOffsetRange(offsetForMoving1, offsetForMoving2);
    }
  }

  /**
   * Delete the empty row in Crosstab Report
   * Since showing Excel table header dont override the data but insert new row
   *
   * @param officeTable Reference to Excel Table
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  clearEmptyCrosstabRow = async (
    officeTable: Excel.Table,
    excelContext: Excel.RequestContext
  ): Promise<void> => {
    try {
      officeTable.load('showHeaders');
      await excelContext.sync();
      const { showHeaders } = officeTable;

      if (!showHeaders) {
        const headerRange = officeTable.getDataBodyRange().getRow(0).getOffsetRange(-1, 0);
        headerRange.delete('Up');
        await excelContext.sync();
      }
    } catch (error) {
      const headerRange = officeTable.getDataBodyRange().getRow(0).getOffsetRange(-1, 0);
      headerRange.unmerge();
      headerRange.clear('Contents');
      return error;
    }
  };

  /**
   * Gets dimensions od the headers of crosstab report.
   *
   * @param instanceDefinition
   */
  getCrosstabHeaderDimensions(instanceDefinition: any): any {
    const {
      rows,
      mstrTable: { isCrosstab, headers },
    } = instanceDefinition;

    if (isCrosstab) {
      return {
        columnsY: headers.columns.length,
        columnsX: headers.columns[0].length,
        // if there is no attributes in rows we need to setup 1 for offset for column attributes names
        rowsX: headers.rows[0].length || 1,
        rowsY: rows,
      };
    }

    return {
      columnsY: 0,
      columnsX: 0,
      rowsX: 0,
      rowsY: 0,
    };
  }
}

export const officeApiCrosstabHelper = new OfficeApiCrosstabHelper();