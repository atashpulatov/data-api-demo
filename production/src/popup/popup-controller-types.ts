import { Body, DossierData, SubtotalsInfo, VisualizationInfo } from '../types/object-types';

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
  dossierData?: DossierData;
  importType?: string;
  isPrompted?: boolean;
  promptsAnswers?: any;
  visualizationInfo?: VisualizationInfo;
  preparedInstanceId?: string;
  displayAttrFormNames?: string;
  projectId?: string;
  body?: Body;
  instanceId?: number;
  subtotalsInfo?: SubtotalsInfo;
  error?: any;
  filterDetails?: FilterDetails[];
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
