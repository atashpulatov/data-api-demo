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

export interface envUrl {
  envUrl: string;
  username: string;
}

export interface ObjectData {
  body?: any;
  objectWorkingId?: number;
  bindId?: string;
  name: string;
  envUrl: envUrl;
  mstrObjectType?: MstrObjectTypes;
  objectType: MstrObjectTypes;
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
  worksheet?: any;
  startCell?: string;
  response?: any;
  pageByData?: PageByData;
  previousTableDimensions?: TableDimensions;
  insertNewWorksheet?: boolean;
  bindIdToBeDuplicated?: string;
  shapeProps?: any;
  // TODO fix type
  visualizationInfo?: false | VisualizationInfo;
}
