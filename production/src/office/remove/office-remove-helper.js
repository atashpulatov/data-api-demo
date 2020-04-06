
import { officeStoreService } from '../store/office-store-service';
import { notificationService } from '../../notification/notification-service';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';

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
     excelContext.runtime.enableEvents = false;
     await excelContext.sync();
     const isClearContentOnly = isClear ? 'contents' : '';
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
     tableRange.clear(isClearContentOnly);
     if (!isClear) { officeTable.delete(); }
     excelContext.runtime.enableEvents = true;
     await excelContext.sync();
     excelContext.trackedObjects.remove(tableRange);
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
    const officeContext = await officeApiHelper.getOfficeContext();
    try {
      await officeApiHelper.getTable(excelContext, object.bindId);
      await excelContext.sync();
      return true;
    } catch (error) {
      await this.removeObjectNotExistingInExcel(object, officeContext);
      return false;
    }
  }

  /**
   * Remove object from the redux store, Excel settings, Excel bindings and then display message
   *
   * @param {Office} object
   * @param {Office} officeContext office context
   * @param {Object} t i18n translating function
   */
  removeObjectAndDisplaytNotification = (object, officeContext, t) => {
    const { name } = object;
    this.removeObjectNotExistingInExcel(object, officeContext);
    // TODO check after new notifications
    // const message = t('{{name}} has been removed from the workbook.', { name });
    // notificationService.displayTranslatedNotification({ type: 'success', content: message });
  }

  /**
   * Remove objects that no longer exists in the Excel workbook from the store
   *
   * @param {Function} t i18n translating function
   * @param {Object} object Contains information obout the object
   * @param {Office} officeContext Excel context
   */
  removeObjectNotExistingInExcel = async (object, officeContext) => {
    officeStoreService.removeObjectFromStore(object.objectWorkingId);
    await officeContext.document.bindings.releaseByIdAsync(object.bindId, () => { console.log('released binding'); });
  }
}

export const officeRemoveHelper = new OfficeRemoveHelper();
