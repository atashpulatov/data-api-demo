
import mstrNormalizedJsonHandler from '../../mstr-object/mstr-normalized-json-handler';
import { mergeHeaderColumns, mergeHeaderRows } from './office-api-header-merge-helper';

const EXCEL_XTABS_BORDER_COLOR = '#a5a5a5';

class OfficeApiCrosstabHelper {
  /**
   * Gets the total range of crosstab report - it sums table body range and headers ranges
   *
   * @param {Office} cellAddress Starting table body cell
   * @param {Object} headerDimensions Contains information about crosstab headers dimensions
   * @param {Office} sheet Active Excel spreadsheet
   * @return {Object}
   */
  getCrosstabRange = (cellAddress, headerDimensions, sheet) => {
    const {
      columnsY, columnsX, rowsX, rowsY,
    } = headerDimensions;
    const cell = typeof cellAddress === 'string' ? sheet.getRange(cellAddress) : cellAddress;
    const bodyRange = cell.getOffsetRange(rowsY, columnsX - 1);
    const startingCell = cell.getCell(0, 0).getOffsetRange(-(columnsY), -rowsX);
    return startingCell.getBoundingRect(bodyRange);
  }

  /**
   * Gets the total range of crosstab report - it sums table body range and headers ranges
   *
   * @param {Office} officeTable Reference to Excel Table
   * @param {Object} headerDimensions Contains information about crosstab headers dimensions
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @return {Object}
   */
  getCrosstabRangeSafely = async (officeTable, headerDimensions, excelContext) => {
    const { validColumnsY, validRowsX } = await this.getCrosstabHeadersSafely(
      headerDimensions,
      officeTable,
      excelContext,
    );
    const startingCell = officeTable.getRange().getCell(0, 0).getOffsetRange(-validColumnsY, -validRowsX);
    return startingCell.getBoundingRect(officeTable.getRange());
  }

  /**
   * Gets the biggest valid range by checking axis by axis
   *
   * @param {Office} officeTable Reference to Excel Table
   * @param {Number} limit Number of rows or columns to check
   * @param {String} getFunction Excel range function 'getRowsAbove'|'getColumnsBefore'
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @return {Number}
   */
  getValidOffset = async (officeTable, limit, getFunction, excelContext) => {
    for (let i = 0; i <= limit; i++) {
      try {
        officeTable.getRange()[getFunction](i + 1);
        await excelContext.sync();
      } catch (error) {
        return i;
      }
    }
    return limit;
  }

  /**
   * Clears the two crosstab report ranges
   *
   * @param {Office} officeTable Reference to Excel Table
   * @param {Object} crosstabHeaderDimensions Contains information about crosstab headers dimensions
   * @param {Object} prevheaderDimensions Contains information about previous crosstab headers dimensions
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   */
  clearCrosstabRange = async (officeTable, mstrTable, excelContext, isClear = false) => {
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
          .getRange()
          .getCell(0, 0)
          .getOffsetRange(0, -1)
          .getResizedRange(-(columnsY), -(rowsX - 1));

        excelContext.trackedObjects.add(titlesRange);
      }

      // Column headers
      if (columnsY) {
        topRange = officeTable.getRange().getRowsAbove(columnsY);
        excelContext.trackedObjects.add(topRange);
      }
      // Check if ranges are valid before clearing
      await excelContext.sync();

      if (isClear
        || (isCrosstab && (JSON.stringify(crosstabHeaderDimensions) === JSON.stringify(prevCrosstabDimensions)))) {
        if (columnsY) { topRange.clear('contents'); }
        if (rowsX) {
          leftRange.clear('contents');
          titlesRange.clear('contents');
        }
      } else {
        if (columnsY) { topRange.clear(); }
        if (rowsX) {
          leftRange.clear();
          titlesRange.clear();
        }
      }

      if (columnsY) { excelContext.trackedObjects.remove([topRange]); }
      if (rowsX) {
        excelContext.trackedObjects.remove([leftRange, titlesRange]);
      }
    } catch (error) {
      officeTable.showHeaders = false;
      throw error;
    }
  }

  /**
   *Prepares parameters for createHeaders
   *
   * @param {Office} reportStartingCell Address of the first cell in report (top left)
   * @param {Array} rows Contains headers structure and data
   */
  createRowsHeaders = (reportStartingCell, rows) => {
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
  }

  /**
   * Create column and title headers for crosstab.
   *
   * @param {string} tableStartCell  Top left corner cell of the table
   * @param {Object} mstrTable  contains information about mstr object
   * @param {Object} sheet  excel worksheet
   * @param {Object} crosstabHeaderDimensions contains dimension of crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   */
  createCrosstabHeaders = (tableStartCell, mstrTable, sheet, crosstabHeaderDimensions) => {
    const { attributesNames, headers: { columns } } = mstrTable;

    this.createColumnsHeaders(tableStartCell, columns, sheet);

    this.createRowsTitleHeaders(tableStartCell, attributesNames, sheet, crosstabHeaderDimensions);
  };

  /**
   *Prepares parameters for createHeaders
   *
   * @param {Office} cellAddress Address of the first cell in report (top left)
   * @param {Array} columns Contains headers structure and data
   * @param {Office} sheet Active Exccel spreadsheet
   * @return {Promise} Context.sync
   */
  createColumnsHeaders = (cellAddress, columns, sheet) => {
    const reportStartingCell = sheet.getRange(cellAddress);
    const columnOffset = columns.length;
    const rowOffset = 0;
    // we call getCell in case multiple cells are selected
    const startingCell = reportStartingCell.getCell(0, 0).getOffsetRange(-columnOffset, -rowOffset);
    const directionVector = [1, 0];
    const headerRange = startingCell.getResizedRange(columns.length - 1, columns[0].length - 1);
    this.insertHeadersValues(headerRange, columns, 'columns');
    return this.createHeaders(columns, startingCell, directionVector);
  }

  /**
  * Create Title headers for crosstab report
  *
  * @param {Office} cellAddress Address of the first cell in report (top left)
  * @param {Object} attributesNames Contains arrays of attributes names in crosstab report
  * @param {Office} sheet Active Exccel spreadsheet
  * @param {Object} crosstabHeaderDimensions Contains dimensions of crosstab report headers
  */
  createRowsTitleHeaders = (cellAddress, attributesNames, sheet, crosstabHeaderDimensions) => {
    const reportStartingCell = sheet.getRange(cellAddress);
    const titlesBottomCell = reportStartingCell.getOffsetRange(0, -1);
    const rowsTitlesRange = titlesBottomCell.getResizedRange(0, -(crosstabHeaderDimensions.rowsX - 1));

    const columnsTitlesRange = titlesBottomCell
      .getOffsetRange(-1, 0)
      .getResizedRange(-(crosstabHeaderDimensions.columnsY - 1), 0);

    const headerTitlesRange = columnsTitlesRange.getBoundingRect(rowsTitlesRange);
    headerTitlesRange.format.verticalAlignment = window.Excel.VerticalAlignment.bottom;
    this.formatCrosstabRange(headerTitlesRange);
    headerTitlesRange.values = '  ';

    // we are not inserting row attributes names if they do not exist
    if (attributesNames.rowsAttributes.length) {
      rowsTitlesRange.values = [attributesNames.rowsAttributes];
      mergeHeaderRows(attributesNames.rowsAttributes, rowsTitlesRange);
    }

    columnsTitlesRange.values = mstrNormalizedJsonHandler.transposeMatrix([attributesNames.columnsAttributes]);
    mergeHeaderColumns(attributesNames.columnsAttributes, columnsTitlesRange);
  };


  /**
  * Returns the number of rows and columns headers that are valid for crosstab
  *
  * @param {Object} headerDimensions Contains information about crosstab header dimensions
  * @param {Office} table Excel Object containig information about Excel Table
  * @param {Office} excelContext Reference to Excel Context used by Excel API functions
  */
  async getCrosstabHeadersSafely(headerDimensions, table, excelContext) {
    const { columnsY, rowsX } = headerDimensions;
    const validColumnsY = await this.getValidOffset(table, columnsY, 'getRowsAbove', excelContext);
    const validRowsX = await this.getValidOffset(table, rowsX, 'getColumnsBefore', excelContext);
    return { validColumnsY, validRowsX };
  }

  /**
   * Clear previous formatting and insert data in range
   *
   * @param {Office} headerRange Range of the header
   * @param {Array} headerArray Contains rows/headers structure and data
   * @param {String} axis - Axis to apply formatting columns or rows
   */
  insertHeadersValues(headerRange, headerArray, axis = 'rows') {
    headerRange.clear('contents'); // we are unmerging and removing formatting to avoid conflicts while merging cells
    headerRange.unmerge();
    // if there is no attributes in rows we insert empty string for whole range
    headerRange.values = axis === 'rows' && !headerArray[0].length ? '' : headerArray;
    const hAlign = axis === 'rows' ? 'left' : 'center';
    headerRange.format.horizontalAlignment = window.Excel.HorizontalAlignment[hAlign];
    headerRange.format.verticalAlignment = window.Excel.VerticalAlignment.top;
    this.formatCrosstabRange(headerRange);
  }

  /**
   * Format crosstab range
   *
   * @param {Office} range Range of the header
   */
  formatCrosstabRange = (range) => {
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
   * @param {Array} headerArray Contains rows/headers structure and data
   * @param {Office} startingCell Address of the first cell header (top left)
   * @param {number} directionVector direction vertor for the step size when iterating over cells
   */
  createHeaders = (headerArray, startingCell, directionVector) => {
    const [offsetForMoving1, offsetForMoving2] = directionVector;
    for (let i = 0; i < headerArray.length - 1; i++) {
      let currentCell = startingCell;
      for (let j = 0; j < headerArray[i].length - 1; j++) {
        if (headerArray[i][j] === headerArray[i][j + 1]) {
          // increasing size of selected range for cells that will be merged
          currentCell.getResizedRange(offsetForMoving2, offsetForMoving1).merge();
        }
        // moving to next attributr value (cell)
        currentCell = currentCell.getOffsetRange(offsetForMoving2, offsetForMoving1);
      }
      // moving to next attribute (row/column)
      startingCell = startingCell.getOffsetRange(offsetForMoving1, offsetForMoving2);
    }
  }

  /**
   * Clear the empty row in Crosstab Report
   * Since showing Excel table header dont override the data but insert new row,
   * we clear values from empty row in crosstab to prevent it
   *
   * @param {Office} officeTable Reference to Excel Table
   */
  clearEmptyCrosstabRow = (officeTable) => {
    const headerRange = officeTable.getDataBodyRange().getRow(0).getOffsetRange(-1, 0);
    headerRange.clear('Contents');
  }

  /**
   * Gets dimensions od the headers of crosstab report.
   *
   * @param {Object} instanceDefinition
   */
  getCrosstabHeaderDimensions = (instanceDefinition) => {
    const { rows, mstrTable: { isCrosstab, headers } } = instanceDefinition;

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
  };
}

export const officeApiCrosstabHelper = new OfficeApiCrosstabHelper();
