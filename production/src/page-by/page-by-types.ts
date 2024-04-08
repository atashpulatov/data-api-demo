export enum PageByDisplayType {
  DEFAULT_PAGE = 'defaultPage',
  ALL_PAGES = 'allPages',
  SELECT_PAGES = 'selectPages',
}

interface PageByForm {
  id: string;
  name: string;
  dataType: string;
  baseFormCategory: string;
  baseFormType: string;
}

interface PageByElement {
  id: string;
  formValues: string[];
}

export interface PageBy {
  id: string;
  name: string;
  type: string;
  forms: PageByForm[];
  elements: PageByElement[];
}

export interface PageByPaging {
  total: number;
  current: number;
  offset: number;
  limit: number;
}

export interface ValidPageByElements {
  paging?: PageByPaging;
  items: number[][];
}

export interface PageByResponse {
  pageBy: PageBy[];
  validPageByElements: ValidPageByElements;
}

export interface PageByDataElement {
  name: string;
  value: string;
  valueId: string;
}

export interface PageByData {
  pageByLinkId: string;
  pageByDisplayType: PageByDisplayType;
  elements: PageByDataElement[];
}

// TODO: Replace with actual setting from the user when implemented
export enum PageByWorksheetNaming {
  USE_REPORT_NAME = 'useReportName',
  USE_PAGE_NAME = 'usePageName',
  USE_REPORT_NAME_AND_PAGE_NAME = 'useReportNameAndPageName',
  USE_PAGE_NAME_AND_REPORT_NAME = 'usePageNameAndReportName',
}
