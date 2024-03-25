import { officeApiHelper } from './office-api-helper';

import { ProtectedSheetError } from '../../error/protected-sheets-error';

class OfficeApiWorksheetHelper {
  /**
   * Returns true if specific worksheet is protected
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param sheet Excel Sheet
   */
  async isSheetProtected(
    excelContext: Excel.RequestContext,
    sheet: Excel.Worksheet
  ): Promise<boolean> {
    sheet.load('protection/protected');
    await excelContext.sync();
    return sheet.protection.protected;
  }

  /**
   * Returns true if any worksheet is protected
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param reportArray array of Mstr Tables
   * @returns true if any sheet is protected
   */
  async checkIfAnySheetProtected(
    excelContext: Excel.RequestContext,
    reportArray: any[]
  ): Promise<boolean> {
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
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   * @param sheet Excel Sheet
   */
  async isCurrentReportSheetProtected(
    excelContext: Excel.RequestContext,
    bindId: string,
    sheet?: Excel.Worksheet
  ): Promise<void> {
    let isProtected = false;
    if (bindId) {
      const currentExcelSheet = await officeApiHelper.getExcelSheetFromTable(excelContext, bindId);
      if (currentExcelSheet) {
        isProtected = await this.isSheetProtected(excelContext, currentExcelSheet);
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

  /**
   * Creates Excel worksheet and sets it as a active one. New worksheet name is based on added object name
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param objectName Name of the object added to the worksheet
   *
   */
  async createAndActivateNewWorksheet(
    excelContext: Excel.RequestContext,
    objectName: string
  ): Promise<void> {
    const newSheetName = await this.prepareWorksheetName(excelContext, objectName);

    const sheets = excelContext.workbook.worksheets;
    await excelContext.sync();

    const sheet = sheets.add(newSheetName);

    await excelContext.sync();
    sheet.activate();
    await excelContext.sync();
  }

  /**
   * Get address of the Excel cell based on value of insertNewWorksheet might also create new worksheet.
   *
   * @param insertNewWorksheet specify whether new worksheet should be create before getting startcell
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param objectName Name of the object added to the new worksheet
   * @return address of Excel cell
   */
  async getStartCell(
    insertNewWorksheet: boolean,
    excelContext: Excel.RequestContext,
    objectName: string
  ): Promise<string> {
    if (insertNewWorksheet) {
      await this.createAndActivateNewWorksheet(excelContext, objectName);
    }
    return officeApiHelper.getSelectedCell(excelContext);
  }

  /**
   * Prepares new Excel wooksheet name. Maximum name length is 31.
   * If name is over the limit '...' are added at the end.
   * If name already exists, counter is added at the end of the name.
   * Worksheet name restricted chars: \ / ? : [ ] are replaced with _
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param objectName Name of the object added to the worksheet
   * @returns New Excel worksheet name
   */
  async prepareWorksheetName(
    excelContext: Excel.RequestContext,
    objectName: string
  ): Promise<string> {
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

      const isLastWordACounter =
        lastWordLength > 2 &&
        lastWord[0] === '(' &&
        lastWord[lastWordLength - 1] === ')' &&
        !Number.isNaN(lastWordCounter);

      if (isLastWordACounter) {
        const counterIndex = newSheetName.lastIndexOf(' ');
        newSheetName = newSheetName.substring(0, counterIndex);
      }

      if (newSheetName.length + counterLength > EXCEL_WORKSHEET_CHAR_LIMIT) {
        newSheetName = `${newSheetName.slice(0, 28 - counterLength)} ...(${counter})`;
      } else {
        newSheetName = `${newSheetName} (${counter})`;
      }

      counter++;
    }

    return newSheetName;
  }

  /**
   * Renames active worksheet name to the object name
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param objectName Name of the object added to the worksheet
   *
   * @returns New Excel worksheet name
   */

  async renameExistingWorksheet(
    excelContext: Excel.RequestContext,
    objectName: string
  ): Promise<string> {
    const currentSheet = excelContext.workbook.worksheets.getActiveWorksheet();
    const newSheetName = await this.prepareWorksheetName(excelContext, objectName);

    currentSheet.name = newSheetName;
    await excelContext.sync();

    return newSheetName;
  }

  /**
   * Checks if active worksheet is empty.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns Flag indicating whether active worksheet is empty
   */
  async isActiveWorksheetEmpty(excelContext: Excel.RequestContext): Promise<boolean> {
    const activeSheet = excelContext.workbook.worksheets.getActiveWorksheet();
    const rangeOrNullObject = activeSheet.getUsedRangeOrNullObject();
    await excelContext.sync();

    return rangeOrNullObject.isNullObject;
  }
}

export const officeApiWorksheetHelper = new OfficeApiWorksheetHelper();
