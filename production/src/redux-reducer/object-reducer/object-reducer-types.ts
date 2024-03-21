// TODO: refactor.
// this is a temporary initial version. it should be improved

export interface VisualizationInfo {
  chapterKey?: string;
  visualizationKey?: string;
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
  visualizationInfo?: boolean | VisualizationInfo;
  isSelected?: boolean;
  // TODO remove when type is finalized
  [key: string]: any;
}
