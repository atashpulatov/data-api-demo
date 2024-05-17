import { PageByConfiguration } from '@mstr/connector-components';

import { PageByData } from '../page-by/page-by-types';
import { Body, DossierData, SubtotalsInfo, VisualizationInfo } from '../types/object-types';

import mstrObjectType from '../mstr-object/mstr-object-type-enum';
import { DisplayAttrFormNames, ObjectImportType } from '../mstr-object/constants';

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
  importType?: ObjectImportType;
  isPrompted?: boolean;
  promptsAnswers?: any;
  visualizationInfo?: VisualizationInfo;
  preparedInstanceId?: string;
  displayAttrFormNames?: DisplayAttrFormNames;
  projectId?: string;
  body?: Body;
  instanceId?: string;
  subtotalsInfo?: SubtotalsInfo;
  error?: any;
  filterDetails?: FilterDetails[];
  pageByData?: PageByData;
  pageByConfigurations?: PageByConfiguration[][];
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
  pageByData?: PageByData;
}
