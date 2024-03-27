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

interface PageByPaging {
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
