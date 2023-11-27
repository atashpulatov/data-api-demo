import officeStoreObject from '../store/office-store-object';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';
import officeApiDataLoader from '../api/office-api-data-loader';
import { homeHelper } from '../../home/home-helper';

class OfficeRemoveHelper {
  /**
   * Get object from store based on bindId and remove it from workbook
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} object Contains information obout the object
   * @param {Boolean} isClear specify if object should be cleared or deleted
   */
  removeOfficeTableBody = async (excelContext, object, isClear) => {
    const { isCrosstab, crosstabHeaderDimensions } = object;
    const officeTable = excelContext.workbook.tables.getItem(object.bindId);
    await this.removeExcelTable(officeTable, excelContext, isCrosstab, crosstabHeaderDimensions, isClear);
  };

  /**
  * Remove Excel table object from workbook. For crosstab reports will also clear the headers
  *
  * @param {Office} officeTable Address of the first cell in report (top left)
  * @param {Office} excelContext Reference to Excel Context used by Excel API functions
  * @param {Boolean} isCrosstab Specify if object is a crosstab
  * @param {Object} crosstabHeaderDimensions Contains dimensions of crosstab report headers
  * @param {Boolean} isClear Specify if object should be cleared or deleted. False by default
  */
  removeExcelTable = async (officeTable, excelContext, isCrosstab, crosstabHeaderDimensions = {}, isClear = false) => {
    const tableRange = officeTable.getDataBodyRange();
    excelContext.trackedObjects.add(tableRange);

    if (isCrosstab) {
      await officeApiCrosstabHelper.clearCrosstabRange(
        officeTable,
        {
          crosstabHeaderDimensions: {},
          isCrosstab,
          prevCrosstabDimensions: crosstabHeaderDimensions
        },
        excelContext,
        isClear
      );
      await excelContext.sync();
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
      tableRange.clear('contents');
    }

    excelContext.trackedObjects.remove(tableRange);
    await excelContext.sync();
  };

  deleteTableInChunks = async (excelContext, officeTable) => {
    const deleteChunkSize = 10000;
    this.deleteRowsInChunks(excelContext, officeTable, deleteChunkSize, deleteChunkSize);

    officeTable.delete();
    await excelContext.sync();
  };

  /**
 * Deletes redundant rows in office table.
 *
 * @param {Office} excelContext Reference to Excel Context used by Excel API functions
 * @param {Object} officeTable Previous office table to refresh
 * @param {number} chunkSize Number of rows to delete in one chunk
 * @param {number} rowsToPreserveCount Number of rows to preserve
 *
 */
  deleteRowsInChunks = async (excelContext, officeTable, chunkSize, rowsToPreserveCount) => {
    const tableRows = officeTable.rows;

    let tableRowCount = await officeApiDataLoader.loadSingleExcelData(excelContext, tableRows, 'count');
    excelContext.workbook.application.suspendApiCalculationUntilNextSync();

    while (tableRowCount > rowsToPreserveCount) {
      const sumOfRowsToDeleteInNextStep = tableRowCount - rowsToPreserveCount;
      const rowsToDeleteCount = sumOfRowsToDeleteInNextStep > chunkSize
        ? chunkSize
        : sumOfRowsToDeleteInNextStep;

      officeTable
        .getRange()
        .getLastRow()
        .getResizedRange(-(rowsToDeleteCount - 1), 0)
        .delete('Up');

      await excelContext.sync();

      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      tableRowCount = await officeApiDataLoader.loadSingleExcelData(excelContext, tableRows, 'count');
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
    }
  };

  /**
   * Checks if the object existing in Excel workbook
   *
   * @param {Function} t i18n translating function
   * @param {Object} object Contains information obout the object
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @return {Boolean}
   */
  checkIfObjectExist = async (object, excelContext) => {
    try {
      await officeApiHelper.getTable(excelContext, object.bindId);
      await excelContext.sync();
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Remove objects that no longer exists in the Excel workbook from the store
   *
   * @param {Object} object Contains information obout the object
   * @param {Office} officeContext Excel context
   */
  removeObjectNotExistingInExcel = async (object, officeContext) => {
    officeStoreObject.removeObjectFromStore(object.objectWorkingId);
    await officeContext.document.bindings.releaseByIdAsync(object.bindId, () => { console.log('released binding'); });
  };
}

export const officeRemoveHelper = new OfficeRemoveHelper();
