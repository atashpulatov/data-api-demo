import { ProtectedSheetError } from '../../error/protected-sheets-error';
import { officeApiHelper } from './office-api-helper';

class OfficeApiWorksheetHelper {
  /**
    * Returns true if specific worksheet is protected
    *
    * @param {Office} excelContext Reference to Excel Context used by Excel API functions
    * @param {Office} sheet Excel Sheet
  */
  isSheetProtected = async (excelContext, sheet) => {
    sheet.load('protection/protected');
    await excelContext.sync();
    return sheet.protection.protected;
  };

  /**
    * Returns true if specific worksheet is protected
    *
    * @param {Office} excelContext Reference to Excel Context used by Excel API functions
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
  };

  /**
  * Get sheet of the table. Return isSheetProtected
  *
  * @param {Office} excelContext Reference to Excel Context used by Excel API functions
  * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
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
  };

  /**
  * Get address of the Excel cell based on value of insertNewWorksheet might also create new worksheet.
  *
  * @param {Boolean} insertNewWorksheet specify whether new worksheet should be create before getting startcell
  * @param {Office} excelContext Reference to Excel Context used by Excel API functions
  * @param {String} objectName Name of the object added to the new worksheet
  * @return {String} address of Excel cell
  */
  getStartCell = async (insertNewWorksheet, excelContext, objectName) => {
    if (insertNewWorksheet) {
      await officeApiWorksheetHelper.createAndActivateNewWorksheet(excelContext, objectName);
    }
    const { getSelectedRangeWrapper, getSelectedCell } = officeApiHelper;
    return getSelectedRangeWrapper(excelContext, getSelectedCell);
  };

  /**
     * Prepares new Excel wooksheet name. Maximum name length is 31.
     * If name is over the limit '...' are added at the end.
     * If name already exists, counter is added at the end of the name.
     * Worksheet name restricted chars: \ / ? : [ ] are replaced with _
     *
     * @param {String} excelContext Reference to Excel Context used by Excel API functions
     * @param {Array} objectName Name of the object added to the worksheet
     * @returns {String} New Excel worksheet name
     */
  prepareWorksheetName = async (excelContext, objectName) => {
    const EXCEL_WORKSHEET_CHAR_LIMIT = 31;

    const sheets = excelContext.workbook.worksheets;

    sheets.load('items/name');
    await excelContext.sync();
    const sheetsNames = sheets.items.map(item => item.name);

    let newSheetName = objectName.replace(/[:?*\\/\][]/g, '_');

    // if objectName only contains whitespaces replace it with _
    if (!newSheetName.replace(/\s/g, '').length) {
      newSheetName = '_';
    }

    if (newSheetName.length > EXCEL_WORKSHEET_CHAR_LIMIT) {
      newSheetName = `${newSheetName.substring(0, 28)}...`;
    }

    let counter = 2;

    while (sheetsNames.includes(newSheetName)) {
      const counterLength = counter.toString().length + 3;

      const lastWord = newSheetName.split(' ').pop();
      const lastWordLength = lastWord.length;
      const lastWordCounter = Number(lastWord.substring(1, lastWordLength - 1));

      const isLastWordACounter = lastWordLength > 2
        && lastWord[0] === '('
        && lastWord[lastWordLength - 1] === ')'
        && !Number.isNaN(lastWordCounter);

      if (isLastWordACounter) {
        const counterIndex = newSheetName.lastIndexOf(' ');
        newSheetName = newSheetName.substring(0, counterIndex);
      }

      if ((newSheetName.length + counterLength) > EXCEL_WORKSHEET_CHAR_LIMIT) {
        newSheetName = `${newSheetName.slice(0, 28 - counterLength)} ...(${counter})`;
      } else {
        newSheetName = `${newSheetName} (${counter})`;
      }

      counter++;
    }

    return newSheetName;
  };

  /**
  * Creates Excel worksheet and sets it as a active one. New worksheet name is based on added object name
  *
  * @param {Office} excelContext Reference to Excel Context used by Excel API functions
  * @param {String} objectName Name of the object added to the worksheet
  *
  */
  createAndActivateNewWorksheet = async (excelContext, objectName) => {
    const newSheetName = await this.prepareWorksheetName(excelContext, objectName);

    const sheets = excelContext.workbook.worksheets;
    await excelContext.sync();

    const sheet = sheets.add(newSheetName);

    await excelContext.sync();
    sheet.activate();
    await excelContext.sync();
  };

  /**
   * Renames active worksheet name to the object name
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {String} objectName Name of the object added to the worksheet
   */

  renameExistingWorksheet = async (excelContext, objectName) => {
    const currentSheet = excelContext.workbook.worksheets.getActiveWorksheet();
    const newSheetName = await this.prepareWorksheetName(excelContext, objectName);
    currentSheet.name = newSheetName;
    await excelContext.sync();
  };

  /**
   * Checks if active worksheet is empty.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @returns Flag indicating whether active worksheet is empty
   */
  isActiveWorksheetEmpty = async (excelContext) => {
    const activeSheet = excelContext.workbook.worksheets.getActiveWorksheet();
    const rangeOrNullObject = activeSheet.getUsedRangeOrNullObject();
    await excelContext.sync();

    return rangeOrNullObject.isNullObject;
  };
}

export const officeApiWorksheetHelper = new OfficeApiWorksheetHelper();
