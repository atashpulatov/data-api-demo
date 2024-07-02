import { PageByData } from '@mstr/connector-components/lib/loaded-objects/object-tile/object-details/source-object-info/source-object-info';
import { Action } from 'redux';

import { MstrObjectTypes } from '../../mstr-object/mstr-object-types';
import { Definition, SubtotalsInfo } from '../../types/object-types';

import { DisplayAttrFormNames, ObjectImportType } from '../../mstr-object/constants';

export interface MstrData {
  chosenObjectId?: string;
  chosenObjectName?: string;
  chosenProjectId?: string;
  promptsAnswers?: any[]; // Replace 'any' with the appropriate type
}

export interface EditedObject {
  objectWorkingId?: number;
  name?: string;
  chosenObjectId?: string;
  projectId?: string;
  isEdit?: boolean;
  promptsAnswers?: { answers: any[] }[]; // Replace 'any' with the appropriate type
  chosenObjectSubtype?: number;
  chosenObjectName?: string;
  instanceId?: string;
  subtotalsInfo?: SubtotalsInfo;
  displayAttrFormNames?: DisplayAttrFormNames;
  selectedAttributes?: string[];
  selectedMetrics?: string[];
  selectedFilters?: any | any[]; // Replace 'any' with the appropriate type
  importType: ObjectImportType;
  mstrObjectType: MstrObjectTypes;
  pageByData?: PageByData;
  definition?: Definition;
}
export interface PopupState {
  editedObject?: EditedObject;
  preparedInstance?: any;
  isReprompt?: boolean;
  isEdit?: boolean;
  isDuplicate?: boolean;
}
export enum PopupActionTypes {
  RESET_STATE = 'POPUP_RESET_STATE',
  SET_REPORT_N_FILTERS = 'POPUP_SET_REPORT_N_FILTERS',
  SET_PREPARED_REPORT = 'POPUP_SET_PREPARED_REPORT',
  SWITCH_IMPORT_SUBTOTALS_ON_EDIT = 'POPUP_SWITCH_IMPORT_SUBTOTALS_ON_EDIT',
  CLEAR_EDITED_OBJECT = 'POPUP_CLEAR_EDITED_OBEJECT',
  UPDATE_DISPLAY_ATTR_FORM_ON_EDIT = 'POPUP_UPDATE_DISPLAY_ATTR_FORM_ON_EDIT',
  SET_IS_EDIT = 'POPUP_SET_IS_EDIT',
  SET_IS_DUPLICATE = 'POPUP_SET_IS_DUPLICATE',
}

export interface SetReportNFiltersAction extends Action {
  type: PopupActionTypes.SET_REPORT_N_FILTERS;
  editedObject: any; // Replace 'any' with the appropriate type
}

export interface SetPreparedReportAction extends Action {
  type: PopupActionTypes.SET_PREPARED_REPORT;
  chosenObjectData: any; // Replace 'any' with the appropriate type
  instanceId: string;
}

export interface ClearEditedObjectAction extends Action {
  type: PopupActionTypes.CLEAR_EDITED_OBJECT;
}

export interface SwitchImportSubtotalsOnEditAction extends Action {
  type: PopupActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_EDIT;
  data: any; // Replace 'any' with the appropriate type
}

export interface UpdateDisplayAttrFormOnEditAction extends Action {
  type: PopupActionTypes.UPDATE_DISPLAY_ATTR_FORM_ON_EDIT;
  data: DisplayAttrFormNames; // Replace 'any' with the appropriate type
}
export interface SetIsEditAction extends Action {
  type: PopupActionTypes.SET_IS_EDIT;
  isEdit: boolean;
}

export interface SetIsDuplicateAction extends Action {
  type: PopupActionTypes.SET_IS_DUPLICATE;
  isDuplicate: boolean;
}

export interface ResetStateAction extends Action {
  type: PopupActionTypes.RESET_STATE;
}

export type PopupActions =
  | SetReportNFiltersAction
  | SetPreparedReportAction
  | ClearEditedObjectAction
  | SetIsEditAction
  | SetIsDuplicateAction
  | SwitchImportSubtotalsOnEditAction
  | UpdateDisplayAttrFormOnEditAction
  | ResetStateAction;
