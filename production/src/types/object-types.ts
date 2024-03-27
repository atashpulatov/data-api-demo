import { DisplayAttrFormNames } from '../mstr-object/constants';

export type Axis = 'rows' | 'columns';

export type ValueMatrix = 'raw' | 'formatted' | 'extras';
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

export interface dossierData {
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
  mstrObjectType?: {
    name: string;
    request: string;
    subtypes: number[];
    type: number | string;
  };
  objectId: string;
  projectId: string;
  dossierData: dossierData;
  displayAttrFormNames?: DisplayAttrFormNames;
  refreshDate?: number;
  // TODO fix type
  visualizationInfo?: false | VisualizationInfo;
  isSelected?: boolean;
  // TODO remove when type is finalized
  [key: string]: any;
}
