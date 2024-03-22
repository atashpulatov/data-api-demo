export interface VisualizationInfo {
  chapterKey?: string;
  pageKey?: string;
  visualizationKey?: string;
  nameAndFormatShouldUpdate?: boolean;
  dossierStructure?: {
    chapterName: string;
    dossierName: string;
    pageName: string;
  };
}

export interface ObjectData {
  body?: object;
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
  refreshDate?: number;
  visualizationInfo?: false | VisualizationInfo;
  isSelected?: boolean;
  // TODO remove when type is finalized
  [key: string]: any;
}
