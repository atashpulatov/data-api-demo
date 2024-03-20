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

interface PageBy {
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

interface ValidPageByElements {
  paging: PageByPaging;
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
  pageByLink: string;
  elements: PageByDataElement[];
}
