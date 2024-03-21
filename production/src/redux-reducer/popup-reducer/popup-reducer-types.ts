import { ObjectImportType } from '../../mstr-object/constants';

// TODO: refactor.
// this is a temporary initial version. it should be improved
interface SubtotalsInfo {
  subtotalsAddresses?: any[]; // Replace 'any' with the appropriate type
}

export interface MstrData {
  chosenObjectId?: string;
  chosenObjectName?: string;
  chosenProjectId?: string;
  promptsAnswers?: any[]; // Replace 'any' with the appropriate type
}

export interface PopupState {
  chosenObjectId?: string;
  isReprompt?: boolean;
  isEdit?: boolean;
}

export interface EditedObject {
  chosenObjectId?: string;
  projectId?: string;
  isEdit?: boolean;
  promptsAnswers?: { answers: any[] }[]; // Replace 'any' with the appropriate type
  chosenObjectSubtype?: number;
  chosenObjectName?: string;
  instanceId?: string;
  subtotalsInfo?: SubtotalsInfo;
  displayAttrFormNames?: string;
  selectedAttributes?: string[];
  selectedMetrics?: string[];
  selectedFilters?: any | any[]; // Replace 'any' with the appropriate type
  importType: ObjectImportType;
}
