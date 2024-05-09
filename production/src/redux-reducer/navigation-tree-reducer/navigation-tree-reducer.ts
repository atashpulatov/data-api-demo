/* eslint-disable @typescript-eslint/no-use-before-define */
import { PromptsAnswer } from '../answers-reducer/answers-reducer-types';
import { DialogType } from '../popup-state-reducer/popup-state-reducer-types';
import {
  NavigationTreeActions,
  NavigationTreeActionTypes,
  NavigationTreeState,
  RequestPageByModalOpenData,
} from './navigation-tree-reducer-types';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';

export const initialState: NavigationTreeState = {
  chosenObjectId: null,
  chosenProjectId: null,
  chosenSubtype: null,
  chosenObjectName: DEFAULT_PROJECT_NAME,
  isPrompted: false,
  importRequested: false,
  pageByModalOpenRequested: false,
  dossierData: null,
  promptsAnswers: [],
  mstrObjectType: null,
  chosenChapterKey: null,
  chosenVisualizationKey: null,
  dossierOpenRequested: false,
  isEdit: false,
  chosenLibraryDossier: null,
  chosenLibraryElement: {},
  chosenEnvElement: {},
  selectedMenu: { pageKey: 'all', groupId: null },
};

export const navigationTree = (
  // eslint-disable-next-line default-param-last
  state = initialState,
  action: NavigationTreeActions
): NavigationTreeState => {
  switch (action.type) {
    case NavigationTreeActionTypes.SELECT_OBJECT:
      return selectObject(state, action.data);

    case NavigationTreeActionTypes.SET_PROMPT_OBJECTS:
      return setPromptObjects(state, action.data);

    case NavigationTreeActionTypes.REQUEST_IMPORT:
      return requestImport(state, action.data);

    case NavigationTreeActionTypes.REQUEST_PAGE_BY_MODAL_OPEN:
      return requestPageByModalOpen(state, action.data);

    case NavigationTreeActionTypes.REQUEST_PAGE_BY_MODAL_CLOSE:
      return requestPageByModalClose(state);

    case NavigationTreeActionTypes.PROMPTS_ANSWERED:
      return promptsAnswered(state, action.data);

    case NavigationTreeActionTypes.CLEAR_PROMPTS_ANSWERS:
      return clearPromptsAnswers(state);

    case NavigationTreeActionTypes.CANCEL_REQUEST_IMPORT:
      return cancelRequestImport(state);

    case NavigationTreeActionTypes.START_IMPORT:
      return startImport(state);

    case NavigationTreeActionTypes.REQUEST_DOSSIER_OPEN:
      return requestDossierOpen(state, action.data);

    case NavigationTreeActionTypes.CANCEL_DOSSIER_OPEN:
      return cancelDossierOpen(state);

    case NavigationTreeActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_IMPORT:
      return switchImportSubtotalsOnImport(state, action.data);

    case NavigationTreeActionTypes.UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT:
      return updateDisplayAttrFormOnImport(state, action.data);

    case NavigationTreeActionTypes.UPDATE_SELECTED_MENU:
      return updateSelectedMenu(state, action.data);

    case NavigationTreeActionTypes.SET_POPUP_TYPE:
      return setPopupType(state, action.popupType);

    default:
      return state;
  }
};

function makeSelection(
  newState: NavigationTreeState,
  data: NavigationTreeState
): NavigationTreeState {
  newState.chosenObjectId = data.chosenObjectId || null;
  newState.chosenProjectId = data.chosenProjectId || null;
  newState.chosenSubtype = data.chosenSubtype || null;
  newState.chosenObjectName = data.chosenObjectName || DEFAULT_PROJECT_NAME;
  newState.mstrObjectType = data.mstrObjectType;
  newState.chosenChapterKey = data.chosenChapterKey || null;
  newState.chosenVisualizationKey = data.chosenVisualizationKey || null;
  newState.preparedInstanceId = data.preparedInstanceId || null;
  newState.isEdit = data.isEdit;
  newState.chosenLibraryDossier = data.chosenLibraryDossier || null;
  return newState;
}

const selectObject = (
  state: NavigationTreeState,
  data: Partial<NavigationTreeState>
): NavigationTreeState => {
  const newData: Partial<NavigationTreeState> = {
    chosenObjectId: null,
    chosenProjectId: null,
    chosenSubtype: null,
    chosenObjectName: DEFAULT_PROJECT_NAME,
    mstrObjectType: null,
    ...data,
  };
  const newState = { ...state };
  return makeSelection(newState, newData as NavigationTreeState);
};

const setPromptObjects = (
  state: NavigationTreeState,
  data: { promptObjects: any[] }
): NavigationTreeState => {
  const newState = { ...state };
  if (!!data && data.promptObjects) {
    newState.promptObjects = data.promptObjects;
  }
  return newState;
};

const requestImport = (
  state: NavigationTreeState,
  data: { isPrompted: boolean; promptObjects: any[] }
): NavigationTreeState => {
  const newState = { ...state };
  newState.importRequested = true;
  if (!!data && data.promptObjects) {
    newState.promptObjects = data.promptObjects;
  }

  if (!!data && data.isPrompted) {
    newState.isPrompted = data.isPrompted;
  }
  return newState;
};

const requestPageByModalOpen = (
  state: NavigationTreeState,
  data: RequestPageByModalOpenData
): NavigationTreeState => {
  const newState = { ...state };
  newState.pageByModalOpenRequested = true;
  newState.pageByResponse = data.pageByResponse;
  newState.importPageByConfigurations = data.importPageByConfigurations;
  return newState;
};

const requestPageByModalClose = (state: NavigationTreeState): NavigationTreeState => {
  const newState = { ...state };
  newState.pageByModalOpenRequested = false;
  newState.importRequested = false;
  newState.pageByResponse = null;
  return newState;
};

const promptsAnswered = (
  state: NavigationTreeState,
  data: { dossierData: string; promptsAnswers: PromptsAnswer[] }
): NavigationTreeState => {
  const newState = { ...state };
  if (data) {
    newState.importRequested = false;
    newState.promptsAnswers = data.promptsAnswers;
    newState.dossierData = data.dossierData;
  }
  newState.isPrompted = true;
  return newState;
};

const clearPromptsAnswers = (state: NavigationTreeState): NavigationTreeState => {
  const newState = { ...state };
  newState.promptsAnswers = [];
  newState.dossierData = null;
  newState.isPrompted = false;
  return newState;
};

const cancelRequestImport = (state: NavigationTreeState): NavigationTreeState => {
  const newState = { ...state };
  newState.importRequested = false;
  return newState;
};

const startImport = (state: NavigationTreeState): NavigationTreeState => {
  const newState = { ...state };
  newState.importRequested = false;
  newState.promptsAnswers = [];
  newState.dossierData = null;
  return newState;
};

const requestDossierOpen = (
  state: NavigationTreeState,
  data: { isPrompted: boolean; promptObjects: any[] }
): NavigationTreeState => {
  const newState = { ...state };
  newState.dossierOpenRequested = true;
  newState.isPrompted = data?.isPrompted;
  if (!!data && data.promptObjects) {
    newState.promptObjects = data.promptObjects;
  }
  return newState;
};

const cancelDossierOpen = (state: NavigationTreeState): NavigationTreeState => {
  const newState = { ...state };
  newState.dossierOpenRequested = false;
  return newState;
};

const switchImportSubtotalsOnImport = (
  state: NavigationTreeState,
  data: any
): NavigationTreeState => {
  const newState = { ...state };
  newState.importSubtotal = data;
  return newState;
};

const updateDisplayAttrFormOnImport = (
  state: NavigationTreeState,
  data: any
): NavigationTreeState => {
  const newState = { ...state };
  newState.displayAttrFormNames = data;
  return newState;
};

const updateSelectedMenu = (state: NavigationTreeState, data: any): NavigationTreeState => {
  const newState = { ...state };
  newState.selectedMenu = data;
  return makeSelection(newState, {} as NavigationTreeState);
};

const setPopupType = (state: NavigationTreeState, popupType: DialogType): NavigationTreeState => {
  const newState = { ...state };
  newState.isPreparedDataRequested = !!popupType && popupType === DialogType.dataPreparation;
  return newState;
};
