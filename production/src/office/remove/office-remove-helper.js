
import officeStoreObject from '../store/office-store-object';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';
import officeApiDataLoader from '../api/office-api-data-loader';

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
  }

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
      officeApiCrosstabHelper.clearEmptyCrosstabRow(officeTable);
      officeTable.showHeaders = true;
      await excelContext.sync();

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

      await this.deleteBy10kTake2(excelContext, officeTable);

      excelContext.runtime.enableEvents = true;
    } else {
      tableRange.clear('contents');
    }

    excelContext.trackedObjects.remove(tableRange);
    await excelContext.sync();
  }

  deleteBy10kTake2 = async (excelContext, officeTable) => {
    const tableRows = officeTable.rows;
    const rowsToDeleteCount = 10000;
    let tableRowCount = await officeApiDataLoader.loadSingleExcelData(excelContext, tableRows, 'count');
    excelContext.workbook.application.suspendApiCalculationUntilNextSync();

    while (tableRowCount > rowsToDeleteCount) {
      console.log('deleting rows');
      officeTable
        .getRange()
        .getLastRow()
        .getRowsAbove(rowsToDeleteCount)
        .delete('Up');
      await excelContext.sync();
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      tableRowCount = await officeApiDataLoader.loadSingleExcelData(excelContext, tableRows, 'count');
      console.log(tableRowCount);
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
    }
    officeTable.delete();
    await excelContext.sync();
  }

  deleteBy10k = async (context) => {
    console.log('in delete by 10k');
    const startIndex = 1;
    const sheet = context.workbook.worksheets.getItem('Sheet1');
    let range = `A9000${startIndex}:O10000${startIndex}`;
    for (let i = 9; i > 0; i--) {
      console.log(range);
      const contextRange = sheet.getRange(range);
      contextRange.delete();
      await context.sync();
      range = `A${(startIndex + ((i - 1) * 10000) - (10 - i))}:O${(startIndex + (i * 10000) - (10 - i))}`;
    }
    const contextRange = sheet.getRange('A2:O9992');
    contextRange.delete();
    await context.sync();
  }

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
      // TODO check when object notification will not be connected to operations
      // await this.removeObjectNotExistingInExcel(object, officeContext);
      return false;
    }
  }

  /**
   * Remove objects that no longer exists in the Excel workbook from the store
   *
   * @param {Object} object Contains information obout the object
   * @param {Office} officeContext Excel context
   */
  removeObjectNotExistingInExcel = async (object, officeContext) => {
    officeStoreObject.removeObjectFromStore(object.objectWorkingId);
    await officeContext.document.bindings.releaseByIdAsync(object.bindId, () => { console.log('released binding'); });
  }
}

export const officeRemoveHelper = new OfficeRemoveHelper();
