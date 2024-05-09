export enum ObjectAndWorksheetNamingOption {
  REPORT_NAME = 'reportName',
  PAGE_NAME = 'pageName',
  REPORT_NAME_AND_PAGE_NAME = 'reportNameAndPageName',
  PAGE_NAME_AND_REPORT_NAME = 'pageNameAndReportName',
}

export enum PageByDisplayOption {
  DEFAULT_PAGE = 'defaultPage',
  ALL_PAGES = 'allPages',
  SELECT_PAGES = 'selectPages',
}

export enum ImportFormattingOption {
  IMPORT_ATTRIBUTES_AS_TEXT = 'importAttributesAsText',
  MERGE_CROSSTAB_COLUMNS = 'mergeCrosstabColumns',
  DEFAULT_IMPORT_TYPE = 'defaultImportType',
}

export enum UserPreferenceKey {
  EXCEL_REUSE_PROMPT_ANSWERS = 'excelReusePromptAnswers',
  EXCEL_OBJECT_INFO_SIDE_PANEL_PREFERENCES = 'excelObjectInfoSidePanelPreferences',
  EXCEL_OBJECT_INFO_WORKSHEET_PREFERENCES = 'excelObjectInfoWorksheetPreferences',
  EXCEL_PAGE_BY_SELECTION = 'excelPageBySelection',
  EXCEL_PAGE_BY_AND_WORKSHEET_NAMING = 'excelPageByObjectAndWorksheetNaming',
  EXCEL_IMPORT_MERGE_CROSSTAB_COLUMNS = 'excelImportMergeCrosstabColumns',
  EXCEL_IMPORT_ATTRIBUTES_AS_TEXT = 'excelImportAttributesAsText',
  EXCEL_DEFAULT_IMPORT_TYPE = 'excelDefaultImportFormat',
}

export const EXCEL_IMPORT_ATTRIBUTES_AS_TEXT = 'excelImportAttributesAsText';
