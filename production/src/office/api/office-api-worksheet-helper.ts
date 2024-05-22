import { pageByHelper } from '../../page-by/page-by-helper';
import { officeApiHelper } from './office-api-helper';

import { PageByData } from '../../page-by/page-by-types';

import { ProtectedSheetError } from '../../error/protected-sheets-error';
import { ObjectImportType } from '../../mstr-object/constants';

class OfficeApiWorksheetHelper {
  reduxStore: any;

  init(reduxStore: any): void {
    this.reduxStore = reduxStore;
  }

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
      const currentSheet = officeApiHelper.getCurrentExcelSheet(excelContext);
      isProtected = await this.isSheetProtected(excelContext, currentSheet);
    }
    if (isProtected) {
      throw new ProtectedSheetError();
    }
  }

  /**
   * Creates Excel worksheet and sets it visiblity. New worksheet name is based on added object name.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param worksheetName Name of the object added to the worksheet
   * @param pageByData Contains information about page-by elements
   * @param visibility Visibility of the worksheet
   * @returns New Excel worksheet
   */
  async createNewWorksheet({
    excelContext,
    worksheetName,
    pageByData,
    visibility = Excel.SheetVisibility.visible,
  }: {
    excelContext: Excel.RequestContext;
    worksheetName: string;
    pageByData?: PageByData;
    visibility?: Excel.SheetVisibility;
  }): Promise<Excel.Worksheet> {
    const newWorksheetName = await this.prepareWorksheetName(
      excelContext,
      worksheetName,
      pageByData
    );
    const sheets = excelContext.workbook.worksheets;
    const sheet = sheets.add(newWorksheetName);

    sheet.visibility = visibility;
    await excelContext.sync();

    return sheet;
  }

  /**
   * Gets existing worksheet or creates new one.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param importType Type of the import
   * @param name Name of the object
   * @param pageByData Contains information about page-by elements
   * @param prevOfficeTable Previous office table
   * @param insertNewWorksheet Flag indicating whether new worksheet should be created
   * @return Excel worksheet
   */
  async getWorksheet(
    excelContext: Excel.RequestContext,
    importType: ObjectImportType,
    name: string,
    pageByData: PageByData,
    prevOfficeTable: Excel.Table,
    insertNewWorksheet: boolean
  ): Promise<Excel.Worksheet> {
    const isPivotTableImport = importType === ObjectImportType.PIVOT_TABLE;
    let worksheet;

    if (insertNewWorksheet) {
      worksheet = await this.createNewWorksheet({
        excelContext,
        worksheetName: isPivotTableImport ? `${name} data source` : name,
        pageByData,
        visibility: isPivotTableImport
          ? Excel.SheetVisibility.veryHidden
          : Excel.SheetVisibility.visible,
      });

      if (!isPivotTableImport) {
        worksheet.activate();
        await excelContext.sync();
      }
    } else if (prevOfficeTable) {
      worksheet = prevOfficeTable.worksheet;
    } else {
      worksheet = excelContext.workbook.worksheets.getActiveWorksheet();
    }

    return worksheet;
  }

  /**
   * Prepares new Excel wooksheet name. Maximum name length is 31.
   * If name is over the limit '...' are added at the end.
   * If name already exists, counter is added at the end of the name.
   * Worksheet name restricted chars: \ / ? : [ ] are replaced with _
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param objectName Name of the object added to the worksheet
   * @param pageByData Contains information about page-by elements
   * @returns New Excel worksheet name
   */
  async prepareWorksheetName(
    excelContext: Excel.RequestContext,
    objectName: string,
    pageByData?: PageByData
  ): Promise<string> {
    const EXCEL_WORKSHEET_CHAR_LIMIT = 31;

    const sheets = excelContext.workbook.worksheets;
    sheets.load('items/name');
    await excelContext.sync();
    const sheetsNames = sheets.items.map(item => item.name);

    let newSheetName = objectName;

    if (pageByData) {
      newSheetName = pageByHelper.prepareNameBasedOnPageBySettings(newSheetName, pageByData);
    }

    // Worksheet names cannot:
    // Be blank
    // Contain more than 31 characters
    // Contain any of the following characters: / \ ? * : [ ]
    // Begin or end with an apostrophe ('), but they can be used in between text or numbers in a name
    // Be named "History". This is a reserved word Excel uses internally

    newSheetName = newSheetName
      ?.replace(/[:?*\\/\][]|^'|'$/g, '_')
      .replace(/^History$/i, 'History_');

    // if objectName only contains whitespaces replace it with _
    if (!newSheetName?.replace(/\s/g, '').length) {
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
   * @param pageByData Contains information about page-by elements
   *
   * @returns New Excel worksheet name
   */

  async renameExistingWorksheet(
    excelContext: Excel.RequestContext,
    objectName: string,
    pageByData?: PageByData
  ): Promise<string> {
    const currentSheet = excelContext.workbook.worksheets.getActiveWorksheet();
    const newSheetName = await this.prepareWorksheetName(excelContext, objectName, pageByData);

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
