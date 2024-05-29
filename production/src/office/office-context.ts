const EXCEL_SHAPE_API_VERSION = 1.9;
const EXCEL_INSERT_WORKSHEET_API_VERSION = 1.13;
const EXCEL_PIVOT_TABLE_API_VERSION = 1.8;
const EXCEL_ADVANCED_WORKSHEET_TRACKING_API_VERSION = 1.17;

const EXCEL_OVERVIEW_WINDOW_DIALOG_API_VERSION = 1.2;

enum ExcelApiRequirementSetType {
  ExcelApi = 'ExcelApi',
  DialogApi = 'DialogApi',
}

class OfficeContext {
  getOffice(): typeof Office {
    return window.Office;
  }

  getExcel(): typeof Excel {
    return window.Excel;
  }

  /**
   * Returns the highest requirement sets supported by the current platform.
   *
   * @returns Requirement set
   */
  getRequirementSet(): { excelApi: string; dialogApi: string } {
    const excelApi = this.getSupportedVersion(ExcelApiRequirementSetType.ExcelApi);
    const dialogApi = this.getSupportedVersion(ExcelApiRequirementSetType.DialogApi);

    return {
      excelApi,
      dialogApi,
    };
  }

  /**
   * Returns the highest requirement set supported by the current platform.
   * @param Office
   *
   *
   * @returns Requirement set
   */
  private getSupportedVersion(apiName: string): string {
    const { Office } = window;
    let isSupported = true;
    let apiVersion = 0;

    while (isSupported && Office) {
      isSupported = Office.context.requirements.isSetSupported(apiName, `1.${apiVersion}`);
      if (isSupported) {
        apiVersion += 1;
      }
    }

    return `1.${apiVersion - 1}`;
  }

  /**
   * Check if requirement set is supported.
   *
   * @param version version of respective API type
   * @param apiType API type
   * @returns Whether requirement set is supported
   */
  isSetSupported(version: number, apiType: string = ExcelApiRequirementSetType.ExcelApi): boolean {
    const { Office } = window;
    if (Office) {
      return Office.context.requirements.isSetSupported(apiType, `${version}`);
    }
    return false;
  }

  /**
   * Checks whether the Overview Window API is supported in the current office environment
   * and updates the redux store with the API support status
   *
   * @returns true if the Excel Shape API is supported
   */
  isOverviewWindowAPISupported(): boolean {
    return this.isSetSupported(
      EXCEL_OVERVIEW_WINDOW_DIALOG_API_VERSION,
      ExcelApiRequirementSetType.DialogApi
    );
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
