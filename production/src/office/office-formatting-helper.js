import { officeApiHelper } from './office-api-helper';

class OfficeFormattingHelper {
  applyFormatting = async (officeTable, instanceDefinition, isCrosstab, excelContext,) => {
    try {
      console.time('Apply formatting');
      officeApiHelper.formatNumbers(officeTable,
        instanceDefinition.mstrTable,
        isCrosstab);
      await excelContext.sync();
    } catch (error) {
      // TODO: Inform the user?
      console.log('Cannot apply formatting, skipping');
    } finally {
      console.timeEnd('Apply formatting');
    }
  }

  applySubtotalFormatting = async (isCrosstab, subtotalsAddresses, officeTable, excelContext, mstrTable, shouldbold = true) => {
    console.time('Subtotal Formatting');
    if (isCrosstab) { subtotalsAddresses = new Set(subtotalsAddresses); }
    const reportstartCell = officeTable.getRange().getCell(0, 0);
    excelContext.trackedObjects.add(reportstartCell);
    await officeApiHelper.formatSubtotals(reportstartCell, subtotalsAddresses, mstrTable, excelContext, shouldbold);
    excelContext.trackedObjects.remove(reportstartCell);
    console.timeEnd('Subtotal Formatting');
  }
}
export const officeFormattingHelper = new OfficeFormattingHelper();
export default officeFormattingHelper;
