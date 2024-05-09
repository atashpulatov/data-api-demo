const EXCEL_SHAPE_API_VERSION = 1.9;
const EXCEL_INSERT_WORKSHEET_API_VERSION = 1.13;
const EXCEL_PIVOT_TABLE_API_VERSION = 1.8;
const EXCEL_ADVANCED_WORKSHEET_TRACKING_API_VERSION = 1.17;

class OfficeContext {
  getOffice(): typeof Office {
    return window.Office;
  }

  getExcel(): typeof Excel {
    return window.Excel;
  }

  /**
   * Returns the highest requirement set supported by the current platform.
   *
   * @returns Requirement set
   */
  getRequirementSet(): string {
    const { Office } = window;
    let isSupported = true;
    let api = 0;
    while (isSupported && !!Office) {
      isSupported = Office.context.requirements.isSetSupported('ExcelAPI', `1.${api}`);
      if (isSupported) {
        api += 1;
      }
    }
    return `1.${api - 1}`;
  }

  /**
   * Check if requirement set is supported.
   *
   * @param version ExcelAPI version
   * @returns Requirement set supported
   */
  isSetSupported(version: number): boolean {
    const { Office } = window;
    if (Office) {
      return Office.context.requirements.isSetSupported('ExcelAPI', `${version}`);
    }
    return false;
  }

  /**
   * Checks whether the Excel Shape API is supported in the current office environment
   * and updates the redux store with the API support status
   *
   * @returns true if the Excel Shape API is supported
   */
  isShapeAPISupported(): boolean {
    return this.isSetSupported(EXCEL_SHAPE_API_VERSION);
  }

  /**
   * Checks whether the Excel.Workbook insertWorksheetsFromBase64() API is supported in the current
   * office environment and updates the redux store with the API support status.
   *
   * @returns true if the Excel.Workbook insertWorksheetsFromBase64() API is supported
   */
  isInsertWorksheetAPISupported(): boolean {
    return this.isSetSupported(EXCEL_INSERT_WORKSHEET_API_VERSION);
  }

  /** Checks whether the Excel Pivot table API is supported in the current office environment
   * and updates the redux store with the API support status
   *
   * @returns true if the Excel Pivot table API is supported
   */
  isPivotTableSupported(): boolean {
    return this.isSetSupported(EXCEL_PIVOT_TABLE_API_VERSION);
  }

  /**
   * Checks whether the Excel.WorksheetCollection onNameChanged() and onMoved() APIs are supported
   * in the current Office environment and updates the redux store with the API support status.
   *
   * @returns true if the Excel.WorksheetCollection onNameChanged() and onMoved() APIs are supported
   */
  isAdvancedWorksheetTrackingSupported(): boolean {
    return this.isSetSupported(EXCEL_ADVANCED_WORKSHEET_TRACKING_API_VERSION);
  }
}

export const officeContext = new OfficeContext();
