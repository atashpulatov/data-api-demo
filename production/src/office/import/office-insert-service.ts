import { PROMISE_LIMIT } from '../../mstr-object/mstr-object-rest-service';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import officeInsertSplitHelper from './office-insert-split-helper';

class OfficeInsertService {
  /**
   * Synchronise all changes to Excel up to this point. Clears stored promises after sync.
   *
   * @param contextPromises Array excel context sync promises.
   * @param finalsync Specify whether this will be last sync after inserting data into table.
   */
  async syncChangesToExcel(contextPromises: any[], finalsync: boolean): Promise<void> {
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
   * @param officeData Contains Excel context and Excel table reference.
   * @param excelRows Array of table data
   * @param rowIndex Specify from row we should append rows
   * @param isRefresh
   * @param tableChanged Specify if table columns has been changed
   * @param contextPromises Array excel context sync promises.
   * @param header Contains data for crosstab headers.
   * @param mstrTable Contains informations about mstr object
   */
  async appendRows({
    officeTable,
    excelContext,
    excelRows,
    rowIndex,
    contextPromises,
    header,
    mstrTable,
  }: {
    officeTable: Excel.Table;
    excelContext: Excel.RequestContext;
    excelRows: any[];
    rowIndex: number;
    contextPromises: any[];
    header: any;
    mstrTable: any;
  }): Promise<void> {
    await this.appendRowsToTable(excelRows, excelContext, officeTable, rowIndex);

    if (mstrTable.isCrosstab) {
      this.appendCrosstabRowsToRange(officeTable, header.rows, rowIndex);
    }
    contextPromises.push(excelContext.sync());
  }

  /**
   * Appends rows with data to Excel table only.
   *
   * @param excelRows Array of table data
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param officeTable Reference to Excel table
   * @param rowIndex Specify from row we should append rows
   * @param tableChanged Specify if table columns has been changed
   * @param isRefresh
   */
  async appendRowsToTable(
    excelRows: any[],
    excelContext: Excel.RequestContext,
    officeTable: Excel.Table,
    rowIndex: number
  ): Promise<void> {
    console.group('Append rows');
    const isOverLimit = officeInsertSplitHelper.checkIfSizeOverLimit(excelRows);
    const splitExcelRows = officeInsertSplitHelper.getExcelRows(excelRows, isOverLimit);
    for (const splitRow of splitExcelRows) {
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      const rowRange = officeTable
        .getDataBodyRange()
        .getRow(0)
        .getOffsetRange(rowIndex, 0)
        .getResizedRange(splitRow.length - 1, 0);

      rowIndex += splitRow.length;
      rowRange.values = splitRow;
      if (isOverLimit) {
        console.time(`Sync for ${splitRow.length} rows`);
        await excelContext.sync();
        console.timeEnd(`Sync for ${splitRow.length} rows`);
      }
    }

    console.groupEnd();
  }

  /**
   * Appends crosstab row headers to imported object.
   *
   * @param officeTable Reference to Ecxcel table.
   * @param header Contains data for crosstab row headers.
   * @param rowIndex Specify from row we should append rows
   */
  appendCrosstabRowsToRange(officeTable: Excel.Table, headerRows: any[], rowIndex: number): void {
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
