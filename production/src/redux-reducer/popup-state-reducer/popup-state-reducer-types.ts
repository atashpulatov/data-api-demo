import { Action } from 'redux';

import { ObjectImportType } from '../../mstr-object/constants';

export interface PopupStateState {
  popupType?: PopupTypeEnum;
  isDataOverviewOpen?: boolean;
  filteredPageByLinkId?: string;
  isReprompt?: boolean;
  isPrompted?: boolean | any;
  importType?: ObjectImportType;
}

export enum PopupStateActionTypes {
  SET_POPUP_TYPE = 'POPUP_STATE_SET_POPUP_TYPE',
  SET_MSTR_DATA = 'POPUP_STATE_SET_MSTR_DATA',
  SET_OBJECT_DATA = 'POPUP_STATE_SET_OBJECT_DATA',
  ON_POPUP_BACK = 'POPUP_STATE_ON_POPUP_BACK',
  CLEAR_POPUP_STATE = 'POPUP_STATE_CLEAR_POPUP_STATE',
  SET_IS_DATA_OVERVIEW_OPEN = 'POPUP_STATE_SET_IS_DATA_OVERVIEW_OPEN',
  SET_FILTERED_PAGE_BY_LINK_ID = 'SET_FILTERED_PAGE_BY_LINK_ID',
  SET_IMPORT_TYPE = 'POPUP_STATE_SET_IMPORT_TYPE',
}

export enum PopupTypeEnum {
  dataPreparation = 'data-preparation',
  editFilters = 'edit-filters',
  loadingPage = 'loading-page',
  refreshAllPage = 'refresh-all-page',
  promptsWindow = 'prompts-window',
  repromptingWindow = 'reprompting-window',
  libraryWindow = 'library-window',
  dossierWindow = 'dossier-window',
  obtainInstanceHelper = 'obtain-instance-helper',
  multipleRepromptTransitionPage = 'multiple-reprompt-transition-page',
  importedDataOverview = 'imported-data-overview',
  repromptDossierDataOverview = 'reprompt-dossier-data-overview',
  repromptReportDataOverview = 'reprompt-report-data-overview',
}

interface SetPopupTypeAction extends Action {
  type: PopupStateActionTypes.SET_POPUP_TYPE;
  popupType: PopupTypeEnum;
}

interface SetMstrDataAction extends Action {
  type: PopupStateActionTypes.SET_MSTR_DATA;
  payload: any; // Replace 'any' with the appropriate type
}

interface SetObjectDataAction extends Action {
  type: PopupStateActionTypes.SET_OBJECT_DATA;
  payload: any; // Replace 'any' with the appropriate type
}

interface OnPopupBackAction extends Action {
  type: PopupStateActionTypes.ON_POPUP_BACK;
}

interface ClearPopupStateAction extends Action {
  type: PopupStateActionTypes.CLEAR_POPUP_STATE;
}

interface SetIsDataOverviewOpenAction extends Action {
  type: PopupStateActionTypes.SET_IS_DATA_OVERVIEW_OPEN;
  payload: boolean;
}

interface SetFilteredPageByLinkIdAction extends Action {
  type: PopupStateActionTypes.SET_FILTERED_PAGE_BY_LINK_ID;
  payload: string;
}

interface SetImportTypeAction extends Action {
  type: PopupStateActionTypes.SET_IMPORT_TYPE;
  importType: ObjectImportType;
}

export type PopupStateActions =
  | SetPopupTypeAction
  | SetMstrDataAction
  | SetObjectDataAction
  | OnPopupBackAction
  | ClearPopupStateAction
  | SetIsDataOverviewOpenAction
  | SetFilteredPageByLinkIdAction
  | SetImportTypeAction;
