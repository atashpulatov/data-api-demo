export enum ObjectAndWorksheetNamingOption {
  REPORT_NAME = 'reportName',
  PAGE_NAME = 'pageName',
  REPORT_NAME_AND_PAGE_NAME = 'reportNameAndPageName',
  PAGE_NAME_AND_REPORT_NAME = 'pageNameAndReportName',
}

export enum ImportFormattingOption {
  IMPORT_ATTRIBUTES_AS_TEXT = 'importAttributesAsText',
  MERGE_CROSSTAB_COLUMNS = 'mergeCrosstabColumns',
  DEFAULT_IMPORT_TYPE = 'defaultImportType',
}

export enum PivotTableOption {
  ADD_ATTRIBUTES_TO_COLUMNS = 'addAttributesToColumns',
  ADD_METRICS_TO_VALUES = 'addMetricsToValues',
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
  EXCEL_PIVOT_TABLE_ADD_ATTRIBUTES_TO_COLUMNS = 'excelPivotTableAddAttributesToColumns',
  EXCEL_PIVOT_TABLE_ADD_METRICS_TO_VALUES = 'excelPivotTableAddMetricsToValues',
}

export const EXCEL_IMPORT_ATTRIBUTES_AS_TEXT = 'excelImportAttributesAsText';

export const OBJECT_INFO_KEY_VALUE = {
  importedBy: 'Imported By',
  owner: 'Owner',
  modifiedDate: 'Date Modified',
  dateModified: 'Date Modified',
  createdDate: 'Date Created',
  dateCreated: 'Date Created',
  description: 'Description',
  ancestors: 'Location',
  location: 'Location',
  version: 'Version',
  id: 'ID',
  name: 'Name',
  filters: 'Filter',
  filter: 'Filter',
  pageBy: 'Page-By Information',
};
