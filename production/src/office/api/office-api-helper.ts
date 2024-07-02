class OfficeApiHelper {
  /**
   * Gets range of the Excel table added to Workbook binded item collection.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   * @returns Reference to Excel Range
   */
  getBindingRange(excelContext: Excel.RequestContext, bindId: string): Excel.Range {
    return excelContext.workbook.bindings.getItem(bindId).getTable().getRange();
  }

  /**
   * Gets Excel table added to Workbook binded item collection.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   * @returns Reference to Excel Table
   */
  getTable(excelContext: Excel.RequestContext, bindId: string): Excel.Table {
    return excelContext.workbook.bindings.getItem(bindId).getTable();
  }

  /**
   * Gets a new Excel Context.
   *
   * @returns Reference to a new Excel Context used by Excel API functions
   */
  async getExcelContext(): Promise<Excel.RequestContext> {
    return window.Excel.run({ delayForCellEdit: true }, async excelContext => excelContext);
  }

  /**
   * Gets Office Context.
   *
   * @returns Reference to Office Context used by Office API functions
   */
  async getOfficeContext(): Promise<Office.Context> {
    return window.Office.context;
  }

  /**
   * Checks the status of Excel session.
   *
   * @returns Returns true if the Excel session is active, false otherwise
   */
  async getExcelSessionStatus(): Promise<boolean> {
    return !!(await this.getExcelContext());
  }

  /**
   * Returns top left cell from passed address.
   *
   * @param excelAddress Reference to Excel Context used by Excel API functions
   * @returns Address of the cell.
   */
  getStartCellOfRange(excelAddress: string): string {
    const regexCellAddress = /!(\w+\d+)(:|$)/; // NO SONAR
    return excelAddress.match(regexCellAddress)[1];
  }

  /**
   * Returns excel sheet from specific table.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   *
   * @returns Excel sheet or false in case of error
   */
  async getExcelSheetFromTable(
    excelContext: Excel.RequestContext,
    bindId: string
  ): Promise<Excel.Worksheet | false> {
    try {
      const officeTable = excelContext.workbook.tables.getItem(bindId);
      await excelContext.sync();
      return officeTable.getRange().worksheet;
    } catch (error) {
      return false;
    }
  }

  /**
   * Returns current excel sheet.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns Reference to active Excel Worksheet
   */
  getCurrentExcelSheet(excelContext: Excel.RequestContext): Excel.Worksheet {
    return excelContext.workbook.worksheets.getActiveWorksheet();
  }

  /**
   * Retrieves the excel sheet by sheet id.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param worksheetId Worksheet id
   *
   * @returns Reference to active Excel Worksheet
   */
  getExcelSheetById(excelContext: Excel.RequestContext, worksheetId: string): Excel.Worksheet {
    return excelContext.workbook.worksheets.getItemOrNullObject(worksheetId);
  }

  /**
   * Hides the excel worksheet as soft hidden.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param worksheetId Worksheet id
   *
   * @returns Reference to active Excel Worksheet
   */
  async hideExcelWorksheet(
    worksheetId: string,
    excelContext: Excel.RequestContext
  ): Promise<Excel.Worksheet> {
    const worksheet = excelContext.workbook.worksheets.getItem(worksheetId);
    worksheet.visibility = Excel.SheetVisibility.hidden;

    await excelContext.sync();

    return worksheet;
  }
}

export const officeApiHelper = new OfficeApiHelper();
