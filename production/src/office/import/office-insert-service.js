import { PROMISE_LIMIT } from '../../mstr-object/mstr-object-rest-service';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import officeInsertSplitHelper from './office-insert-split-helper';

class OfficeInsertService {
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
  appendRowsToTable = async (excelRows, excelContext, officeTable, rowIndex, tableColumnsChanged, isRefresh) => {
    console.group('Append rows');
    const isOverLimit = officeInsertSplitHelper.checkIfSizeOverLimit(excelRows);
    const splitExcelRows = officeInsertSplitHelper.getExcelRows(excelRows, isOverLimit);
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
}

const officeInsertService = new OfficeInsertService();
export default officeInsertService;
