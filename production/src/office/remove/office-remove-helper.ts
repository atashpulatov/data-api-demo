import { homeHelper } from '../../home/home-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeShapeApiHelper } from '../shapes/office-shape-api-helper';

import { ObjectData } from '../../types/object-types';

import officeApiDataLoader from '../api/office-api-data-loader';
import { ObjectImportType } from '../../mstr-object/constants';

class OfficeRemoveHelper {
  /**
   * Get object from store based on bindId and remove it from workbook
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param objectData Contains information obout the object
   * @param isClear specify if object should be cleared or deleted
   */
  async removeOfficeTableBody(
    excelContext: Excel.RequestContext,
    objectData: ObjectData,
    isClear: boolean
  ): Promise<void> {
    const officeTable = excelContext.workbook.tables.getItem(objectData.bindId);
    await this.removeExcelTable(officeTable, excelContext, objectData, isClear);
  }

  /**
   * Remove Excel table object from workbook. For crosstab reports will also clear the headers
   *
   * @param officeTable Address of the first cell in report (top left)
   * @param objectData Contains information obout the object
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param isClear Specify if object should be cleared or deleted. False by default
   */
  async removeExcelTable(
    officeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    objectData: ObjectData,
    isClear = false
  ): Promise<void> {
    let tableRange = officeTable.getDataBodyRange();

    // Get the entire table range except the last row to prevent the whole formatted crosstab table being cleared out on 'clear data'.
    // Otherwise, table can not be restored (refresh operation will fail) on 'view data', due to bind id being lost (entire table being deleted).
    if (objectData.importType === ObjectImportType.FORMATTED_DATA && objectData.isCrosstab) {
      tableRange = tableRange.getResizedRange(-1, 0);
    }

    excelContext.trackedObjects.add(tableRange);

    // Delete threshold shape group before deleting the entire table
    if (objectData?.shapeGroupId) {
      await officeShapeApiHelper.deleteShapeGroupLinkedToOfficeTable(officeTable, objectData.shapeGroupId, excelContext);
      delete objectData.shapeGroupId;
    }

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
      if (!object.bindId) {
        return false;
      }
      officeApiHelper.getTable(excelContext, object.bindId);
      await excelContext.sync();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const officeRemoveHelper = new OfficeRemoveHelper();
