import { MstrObjectTypes } from '../mstr-object/mstr-object-types';

import { DisplayAttrFormNames } from '../mstr-object/constants';

export type Axis = 'rows' | 'columns';

export type ValueMatrix = 'raw' | 'formatted' | 'extras';

export interface ObjectDetails {
  ancestors: any;
  certified: boolean;
  modifiedDate: string;
  owner: string;
  importedBy: string;
}

export interface TableDimensions {
  rows: number;
  columns: number;
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

export interface ObjectData {
  body?: any;
  objectWorkingId?: number;
  bindId?: string;
  id?: string;
  name?: string;
  mstrObjectType?: MstrObjectTypes;
  objectId: string;
  projectId: string;
  dossierData: DossierData;
  displayAttrFormNames?: DisplayAttrFormNames;
  refreshDate?: number;
  // TODO fix type
  visualizationInfo?: false | VisualizationInfo;
  isSelected?: boolean;
  // TODO remove when type is finalized
  [key: string]: any;
}
