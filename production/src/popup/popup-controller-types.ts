import mstrObjectType from '../mstr-object/mstr-object-type-enum';

// TODO: Fix any types
export interface DialogResponse {
  command: string;
  objectWorkingId?: number;
  objectWorkingIds?: number[];
  insertNewWorksheet?: boolean;
  withEdit?: boolean;
  newName?: string;
  chosenObjectId?: string;
  chosenObject?: string;
  chosenObjectName?: string;
  chosenProject?: string;
  chosenObjectSubtype?: string;
  chosenSubtype?: number;
  dossierData?: any;
  importType?: string;
  isPrompted?: boolean;
  promptsAnswers?: any;
  visualizationInfo?: VisualizationInfo;
  preparedInstanceId?: string;
  displayAttrFormNames?: string;
  projectId?: string;
  body?: Body;
  instanceId?: number;
  subtotalsInfo?: SubTotalsInfo;
  error?: any;
  filterDetails?: FilterDetails[];
}

export interface VisualizationInfo {
  chapterKey: string;
  visualizationKey: string;
  vizDimensions: {
    height: number;
    width: number;
  };
}

export interface Body {
  viewFilter: {
    operands: any[];
    operator: string;
  };
}

export interface SubTotalsInfo {
  importSubtotal: boolean;
}

export interface FilterDetails {
  items: string[];
  name: string;
}

export interface ReportParams {
  bindId?: string;
  mstrObjectType?: typeof mstrObjectType;
  duplicateMode?: any;
  object?: any;
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
  numberOfSiblings: number;
  elements: PageByDataElement[];
}
