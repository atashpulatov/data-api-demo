import { homeHelper } from '../../home/home-helper';
import { officeApiHelper } from '../api/office-api-helper';

import officeApiDataLoader from '../api/office-api-data-loader';

class OfficeRemoveHelper {
  /**
   * Get object from store based on bindId and remove it from workbook
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param object Contains information obout the object
   * @param isClear specify if object should be cleared or deleted
   */
  async removeOfficeTableBody(
    excelContext: Excel.RequestContext,
    object: any,
    isClear: boolean
  ): Promise<void> {
    const officeTable = excelContext.workbook.tables.getItem(object.bindId);
    await this.removeExcelTable(officeTable, excelContext, isClear);
  }

  /**
   * Remove Excel table object from workbook. For crosstab reports will also clear the headers
   *
   * @param officeTable Address of the first cell in report (top left)
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param isClear Specify if object should be cleared or deleted. False by default
   */
  async removeExcelTable(
    officeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    isClear = false
  ): Promise<void> {
    const tableRange = officeTable.getDataBodyRange();
    excelContext.trackedObjects.add(tableRange);

    if (!isClear) {
      excelContext.runtime.enableEvents = false;
      await excelContext.sync();
      if (homeHelper.isMacAndSafariBased()) {
        await this.deleteTableInChunks(excelContext, officeTable);
      } else {
        officeTable.delete();
      }

      excelContext.runtime.enableEvents = true;
    } else {
      tableRange.clear('Contents');
    }

    excelContext.trackedObjects.remove(tableRange);
    await excelContext.sync();
  }

  async deleteTableInChunks(
    excelContext: Excel.RequestContext,
    officeTable: Excel.Table
  ): Promise<void> {
    const deleteChunkSize = 10000;
    this.deleteRowsInChunks(excelContext, officeTable, deleteChunkSize, deleteChunkSize);

    officeTable.delete();
    await excelContext.sync();
  }

  /**
   * Deletes redundant rows in office table.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param officeTable Previous office table to refresh
   * @param chunkSize Number of rows to delete in one chunk
   * @param rowsToPreserveCount Number of rows to preserve
   *
   */
  async deleteRowsInChunks(
    excelContext: Excel.RequestContext,
    officeTable: Excel.Table,
    chunkSize: number,
    rowsToPreserveCount: number
  ): Promise<void> {
    const tableRows = officeTable.rows;

    let tableRowCount = await officeApiDataLoader.loadSingleExcelData(
      excelContext,
      tableRows,
      'count'
    );
    excelContext.workbook.application.suspendApiCalculationUntilNextSync();

    while (tableRowCount > rowsToPreserveCount) {
      const sumOfRowsToDeleteInNextStep = tableRowCount - rowsToPreserveCount;
      const rowsToDeleteCount =
        sumOfRowsToDeleteInNextStep > chunkSize ? chunkSize : sumOfRowsToDeleteInNextStep;

      officeTable
        .getRange()
        .getLastRow()
        .getResizedRange(-(rowsToDeleteCount - 1), 0)
        .delete('Up');

      await excelContext.sync();

      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      tableRowCount = await officeApiDataLoader.loadSingleExcelData(
        excelContext,
        tableRows,
        'count'
      );
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
    }
  }

  /**
   * Checks if the object existing in Excel workbook
   *
   * @param object Contains information obout the object
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @return True if object exists, false otherwise
   */
  async checkIfObjectExist(object: any, excelContext: Excel.RequestContext): Promise<boolean> {
    try {
      officeApiHelper.getTable(excelContext, object.bindId);
      await excelContext.sync();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const officeRemoveHelper = new OfficeRemoveHelper();