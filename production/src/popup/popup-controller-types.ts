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
  visualizationInfo?: any;
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
