import { officeApiHelper } from '../api/office-api-helper';
import { PROMISE_LIMIT } from '../../mstr-object/mstr-object-rest-service';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';

export class OfficeInsertService {
  /**
   * Synchronise all changes to Excel up to this point. Clears stored promises after sync.
   *
   * @param {Array} contextPromises Array excel context sync promises.
   * @param {Boolean} finalsync Specify whether this will be last sync after inserting data into table.
   */
  syncChangesToExcel = async (contextPromises, finalsync) => {
    if (contextPromises.length % PROMISE_LIMIT === 0) {
      console.time('Waiting for pending context syncs');
      await Promise.all(contextPromises);
      console.timeEnd('Waiting for pending context syncs');
      contextPromises = [];
    } else if (finalsync) {
      console.time('Context sync');
      await Promise.all(contextPromises);
      console.timeEnd('Context sync');
    }
  }

  /**
   * Appends rows with data and attributes to object in Excel.
   *
   * @param {Office} officeData Contains Excel context and Excel table reference.
   * @param {Array} excelRows Array of table data
   * @param {Number} rowIndex Specify from row we should append rows
   * @param {Boolean} isRefresh
   * @param {Boolean} tableColumnsChanged
   * @param {Array} contextPromises Array excel context sync promises.
   * @param {Object} header Contains data for crosstab headers.
   * @param {Object} mstrTable Contains informations about mstr object
   */
  appendRows = async (
    officeData,
    excelRows,
    rowIndex,
    isRefresh = false,
    tableColumnsChanged,
    contextPromises,
    header,
    mstrTable) => {
    const { excelContext, officeTable } = officeData;
    await this.appendRowsToTable(excelRows, excelContext, officeTable, rowIndex, tableColumnsChanged, isRefresh);

    if (mstrTable.isCrosstab) { this.appendCrosstabRowsToRange(officeTable, header.rows, rowIndex); }
    contextPromises.push(excelContext.sync());
  }

  /**
   * Appends rows with data to Excel table only.
   *
   * @param {Array} excelRows Array of table data
   * @param {Office} excelContext
   * @param {Office} officeTable reference to Excel table
   * @param {Number} rowIndex Specify from row we should append rows
   * @param {Boolean} tableColumnsChanged
   * @param {Boolean} isRefresh
   */
  async appendRowsToTable(excelRows, excelContext, officeTable, rowIndex, tableColumnsChanged, isRefresh) {
    console.group('Append rows');
    const isOverLimit = this.checkIfSizeOverLimit(excelRows);
    const splitExcelRows = this.getExcelRows(excelRows, isOverLimit);
    for (let i = 0; i < splitExcelRows.length; i += 1) {
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      // Get resize range: The number of rows/cols by which to expand the bottom-right corner,
      // relative to the current range.
      const rowRange = officeTable
        .getDataBodyRange()
        .getRow(rowIndex)
        .getResizedRange(splitExcelRows[i].length - 1, 0);
      rowIndex += splitExcelRows[i].length;
      if (!tableColumnsChanged && isRefresh) { rowRange.clear('Contents'); }
      rowRange.values = splitExcelRows[i];
      if (isOverLimit) {
        console.time(`Sync for ${splitExcelRows[i].length} rows`);
        // eslint-disable-next-line no-await-in-loop
        await excelContext.sync();
        console.timeEnd(`Sync for ${splitExcelRows[i].length} rows`);
      }
    }
    console.groupEnd('Append rows');
  }

  /**
  * Appends crosstab row headers to imported object.
  *
  * @param {Office} officeTable Reference to Ecxcel table.
  * @param {Array} header Contains data for crosstab row headers.
  * @param {Number} rowIndex Specify from row we should append rows
  */
 appendCrosstabRowsToRange = (officeTable, headerRows, rowIndex) => {
   console.time('Append crosstab rows');
   const startCell = officeTable
     .getDataBodyRange()
     .getRow(0)
     .getCell(0, 0)
     .getOffsetRange(rowIndex, 0);
   officeApiCrosstabHelper.createRowsHeaders(startCell, headerRows);
   console.timeEnd('Append crosstab rows');
 }

 /**
   * Return Excel Rows that will be added to table if needed rows will be splitted into chunks that meets limit of 5MB
   *
   * @param {Array} excelRows Array of table data
   * @param {Boolean} isOverLimit Specify if the passed Excel rows are over 5MB limit
   * @returns {Array} Array with sub-arrays with size not more than 5MB
   */
 getExcelRows(excelRows, isOverLimit) {
   let splitExcelRows = [excelRows];
   if (isOverLimit) { splitExcelRows = this.splitExcelRows(excelRows); }
   return splitExcelRows;
 }

  /**
   * Split Excel Rows into chunks that meets limit of 5MB
   *
   * @param {Array} excelRows Array of table data
   * @returns {Array} Array with sub-arrays with size not more than 5MB
   */
  splitExcelRows = (excelRows) => {
    let splitRows = [excelRows];
    let isFitSize = false;
    console.time('Split Rows');
    do {
      const tempSplit = [];
      let changed = false;
      for (let i = 0; i < splitRows.length; i += 1) {
        // 5 MB is a limit for excel
        if (this.checkIfSizeOverLimit(splitRows[i])) {
          const { length } = splitRows[i];
          tempSplit.push(splitRows[i].slice(0, length / 2));
          tempSplit.push(splitRows[i].slice(length / 2, length));
          changed = true;
        } else {
          tempSplit.push(splitRows[i]);
        }
      }
      splitRows = [...tempSplit];
      if (!changed) { isFitSize = true; }
    } while (!isFitSize);
    console.timeEnd('Split Rows');
    return splitRows;
  }

  /**
   * Check size of passed object in MB
   *
   * @param {Object} object Item to check size of
   * @returns {Boolean} information whether the size of passed object is bigger than 5MB
   */
  checkIfSizeOverLimit = (chunk) => {
    let bytes = 0;
    for (let i = 0; i < chunk.length; i++) {
      for (let j = 0; j < chunk[0].length; j++) {
        if (typeof chunk[i][j] === 'string') {
          bytes += chunk[i][j].length * 2;
        } else if (typeof chunk[i][j] === 'number') {
          bytes += 8;
        } else {
          bytes += 2;
        }
        if (bytes / 1000000 > 5) { return true; } // we return true when the size is bigger than 5MB
      }
    }
    return false;
  }
}

const officeInsertService = new OfficeInsertService();
export default officeInsertService;
