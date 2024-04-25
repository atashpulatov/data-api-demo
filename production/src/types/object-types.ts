import { PageByConfiguration } from '@mstr/connector-components';

import { Attribute } from '../mstr-object/mstr-object-response-types';
import { MstrObjectTypes } from '../mstr-object/mstr-object-types';
import { PageByData } from '../page-by/page-by-types';

import { DisplayAttrFormNames, ObjectImportType } from '../mstr-object/constants';

export interface ObjectDetails {
  ancestors: any;
  certified: boolean;
  modifiedDate: string;
  owner: string;
  importedBy: string;
  excelTableSize?: TableDimensions;
}

export interface TableDimensions {
  rows: number;
  columns: number;
}

export interface CrosstabHeaderDimensions {
  rowsY: number;
  rowsX: number;
  columnsY: number;
  columnsX: number;
}

export interface VisualizationInfo {
  chapterKey?: string;
  pageKey?: string;
  visualizationKey?: string;
  nameAndFormatShouldUpdate?: boolean;
  vizDimensions?: {
    height: number;
    width: number;
  };
  dossierStructure?: {
    chapterName: string;
    dossierName: string;
    pageName: string;
  };
}

export interface DossierData {
  chapterKey: string;
  dossierKey: string;
  pageKey: string;
}

export interface ManipulationsXML {
  manipulations: string;
  promptAnswers: any;
}

export interface SubtotalsInfo {
  subtotalsAddresses?: any[];
  importSubtotal: boolean;
}

export interface EnvUrl {
  envUrl: string;
  username: string;
}

interface RequestedObjects {
  attributes: Attribute[];
  metrics: { id: string }[];
}

export interface Body {
  viewFilter: {
    operands: any[];
    operator: string;
  };
  manipulations?: string;
  promptAnswers?: string;
  requestedObjects?: RequestedObjects;
  template?: RequestedObjects;
}

export interface Worksheet {
  id: string;
  name: string;
  index: number;
}

export interface GroupData {
  key: number;
  title: string;
}

export interface ObjectData {
  body?: Body;
  objectWorkingId?: number;
  bindId?: string;
  pivotTableId?: string;
  name: string;
  envUrl?: EnvUrl;
  mstrObjectType?: MstrObjectTypes;
  objectType?: MstrObjectTypes;
  objectId: string;
  projectId: string;
  dossierData: DossierData;
  displayAttrFormNames?: DisplayAttrFormNames;
  refreshDate?: number;
  manipulationsXML?: ManipulationsXML;
  promptsAnswers?: any;
  definition?: any;
  isPrompted?: boolean;
  subtotalsInfo?: false | SubtotalsInfo;
  importType?: ObjectImportType;
  preparedInstanceId?: string;
  crosstabHeaderDimensions?: CrosstabHeaderDimensions;
  isCrosstab?: boolean;
  details?: ObjectDetails;
  tableName?: string;
  worksheet?: Worksheet;
  startCell?: string;
  response?: any;
  pageByData?: PageByData;
  groupData?: GroupData;
  previousTableDimensions?: TableDimensions;
  insertNewWorksheet?: boolean;
  bindIdToBeDuplicated?: string;
  shapeProps?: any;
  // TODO fix type
  visualizationInfo?: false | VisualizationInfo;
  objectSettings?: ObjectSettings;
  pageByConfigurations?: PageByConfiguration[][];
}

export interface ObjectSettings {
  mergeCrosstabColumns?: boolean;
  importAttributesAsText?: boolean;
  objectDetailsSize?: number;
}
