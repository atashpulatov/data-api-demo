
import { ProtectedSheetError } from '../../error/protected-sheets-error';
import { officeApiHelper } from './office-api-helper';


class OfficeApiWorksheetHelper {
  /**
    * Returns true if specific worksheet is protected
    *
    * @param {Office} excelContext Excel context
    * @param {Office} sheet Excel Sheet
  */
  isSheetProtected = async (excelContext, sheet) => {
    sheet.load('protection/protected');
    await excelContext.sync();
    return sheet.protection.protected;
  }

  /**
    * Returns true if specific worksheet is protected
    *
    * @param {Office} excelContext Excel context
    * @param {Array} reportArray array of Mstr Tables
  */
  checkIfAnySheetProtected = async (excelContext, reportArray) => {
    for (const report of reportArray) {
      const sheet = await officeApiHelper.getExcelSheetFromTable(excelContext, report.bindId);
      if (sheet) {
        await this.isCurrentReportSheetProtected(excelContext, undefined, sheet);
      } else {
        return false;
      }
    }
  }

  /**
      * Get sheet of the table. Return isSheetProtected
      *
      * @param {Office} excelContext Excel context
      * @param {String} report Report object
      * @param {Office} sheet Excel Sheet
      */
  isCurrentReportSheetProtected = async (excelContext, bindId, sheet) => {
    let isProtected = false;
    if (bindId) {
      const currentExcelSheet = await officeApiHelper.getExcelSheetFromTable(excelContext, bindId);
      if (currentExcelSheet) {
        isProtected = await this.isSheetProtected(excelContext, currentExcelSheet);
      } else {
        isProtected = false;
      }
    } else if (sheet && excelContext) {
      isProtected = await this.isSheetProtected(excelContext, sheet);
    } else {
      const currentSheet = await officeApiHelper.getCurrentExcelSheet(excelContext);
      isProtected = await this.isSheetProtected(excelContext, currentSheet);
    }
    if (isProtected) {
      throw new ProtectedSheetError();
    }
  }

  createAndActivateNewWorksheet = async (excelContext) => {
    const sheets = excelContext.workbook.worksheets;
    const sheet = sheets.add();
    await excelContext.sync();
    sheet.activate();
    await excelContext.sync();
  }
}

export const officeApiWorksheetHelper = new OfficeApiWorksheetHelper();
