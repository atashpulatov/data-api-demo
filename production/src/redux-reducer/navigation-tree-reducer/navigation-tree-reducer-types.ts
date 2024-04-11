import { Action } from 'redux';

import { MstrObjectTypes } from '../../mstr-object/mstr-object-types';
import { PromptsAnswer } from '../answers-reducer/answers-reducer-types';
import { PopupTypeEnum } from '../popup-state-reducer/popup-state-reducer-types';

import { DisplayAttrFormNames } from '../../mstr-object/constants';

export enum NavigationTreeActionTypes {
  SELECT_OBJECT = 'NAV_TREE_SELECT_OBJECT',
  REQUEST_IMPORT = 'NAV_TREE_REQUEST_IMPORT',
  PROMPTS_ANSWERED = 'NAV_TREE_PROMPTS_ANSWERED',
  CANCEL_REQUEST_IMPORT = 'NAV_TREE_CANCEL_REQUEST_IMPORT',
  START_IMPORT = 'NAV_TREE_START_IMPORT',
  REQUEST_DOSSIER_OPEN = 'NAV_TREE_REQUEST_DOSSIER_OPEN',
  CANCEL_DOSSIER_OPEN = 'NAV_TREE_CANCEL_DOSSIER_OPEN',
  SWITCH_IMPORT_SUBTOTALS_ON_IMPORT = 'NAV_TREE_SWITCH_IMPORT_SUBTOTALS_ON_IMPORT',
  CLEAR_PROMPTS_ANSWERS = 'NAV_TREE_CLEAR_PROMPTS_ANSWERS',
  UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT = 'NAV_TREE_UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT',
  SET_PROMPT_OBJECTS = 'SET_PROMPT_OBJECTS',
  UPDATE_SELECTED_MENU = 'UPDATE_SELECTED_MENU',
  SET_POPUP_TYPE = 'SET_POPUP_TYPE',
}

export interface NavigationTreeState {
  chosenObjectId: string | null;
  chosenProjectId: string | null;
  chosenSubtype: string | null;
  chosenObjectName: string;
  isPrompted: boolean;
  importRequested: boolean;
  dossierData: any | null; // Replace 'any' with the appropriate type
  promptsAnswers: any | null; // Replace 'any' with the appropriate type
  mstrObjectType: MstrObjectTypes | null;
  chosenChapterKey: string | null;
  chosenVisualizationKey: string | null;
  dossierOpenRequested: boolean;
  isEdit: boolean;
  chosenLibraryDossier: any | null; // Replace 'any' with the appropriate type
  chosenLibraryElement: any; // Replace 'any' with the appropriate type
  chosenEnvElement: any; // Replace 'any' with the appropriate type
  selectedMenu: { pageKey: string; groupId: string | null };
  preparedInstanceId?: string;
  isPreparedDataRequested?: boolean;
  displayAttrFormNames?: DisplayAttrFormNames;
  importSubtotal?: string;
  promptObjects?: string[];
}

export interface SelectObjectAction extends Action {
  type: NavigationTreeActionTypes.SELECT_OBJECT;
  data: { chosenObjectId: string };
}

export interface SetPromptObjectsAction extends Action {
  type: NavigationTreeActionTypes.SET_PROMPT_OBJECTS;
  data: { promptObjects: string[] };
}

export interface RequestImportAction extends Action {
  type: NavigationTreeActionTypes.REQUEST_IMPORT;
  data: { isPrompted: boolean; promptObjects: any[] };
}

export interface PromptsAnsweredAction extends Action {
  type: NavigationTreeActionTypes.PROMPTS_ANSWERED;
  data: { dossierData: string; promptsAnswers: PromptsAnswer[] };
}

export interface ClearPromptsAnswersAction extends Action {
  type: NavigationTreeActionTypes.CLEAR_PROMPTS_ANSWERS;
}

export interface CancelRequestImportAction extends Action {
  type: NavigationTreeActionTypes.CANCEL_REQUEST_IMPORT;
}

export interface StartImportAction extends Action {
  type: NavigationTreeActionTypes.START_IMPORT;
}

export interface RequestDossierOpenAction extends Action {
  type: NavigationTreeActionTypes.REQUEST_DOSSIER_OPEN;
  data: { isPrompted: boolean; promptObjects: any[] };
}

export interface CancelDossierOpenAction extends Action {
  type: NavigationTreeActionTypes.CANCEL_DOSSIER_OPEN;
}

export interface SwitchImportSubtotalsOnImportAction extends Action {
  type: NavigationTreeActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_IMPORT;
  data: { import: string };
}

export interface UpdateDisplayAttrFormOnImportAction extends Action {
  type: NavigationTreeActionTypes.UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT;
  data: { import: string };
}

export interface UpdateSelectedMenuAction extends Action {
  type: NavigationTreeActionTypes.UPDATE_SELECTED_MENU;
  data: { name: string };
}

interface SetPopupTypeAction extends Action {
  type: NavigationTreeActionTypes.SET_POPUP_TYPE;
  popupType: PopupTypeEnum;
}

export type NavigationTreeActions =
  | SelectObjectAction
  | SetPromptObjectsAction
  | RequestImportAction
  | PromptsAnsweredAction
  | ClearPromptsAnswersAction
  | CancelRequestImportAction
  | StartImportAction
  | RequestDossierOpenAction
  | CancelDossierOpenAction
  | SwitchImportSubtotalsOnImportAction
  | UpdateDisplayAttrFormOnImportAction
  | UpdateSelectedMenuAction
  | SetPopupTypeAction;
