import {
  SELECT_OBJECT, START_IMPORT, REQUEST_IMPORT, CANCEL_REQUEST_IMPORT, PROMPTS_ANSWERED,
  CLEAR_PROMPTS_ANSWERS, REQUEST_DOSSIER_OPEN, CANCEL_DOSSIER_OPEN, UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT,
  SWITCH_IMPORT_SUBTOTALS_ON_IMPORT, SET_PROMPT_OBJECTS, UPDATE_SELECTED_MENU
} from './navigation-tree-actions';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';

export const initialState = {
  chosenObjectId: null,
  chosenProjectId: null,
  chosenSubtype: null,
  chosenObjectName: DEFAULT_PROJECT_NAME,
  isPrompted: false,
  importRequested: false,
  dossierData: null,
  promptsAnswers: null,
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

function makeSelection(newState, data) {
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

export const navigationTree = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case SELECT_OBJECT: {
      const newData = {
        chosenObjectId: null,
        chosenProjectId: null,
        chosenSubtype: null,
        chosenObjectName: DEFAULT_PROJECT_NAME,
        mstrObjectType: null,
        ...data
      };
      const newState = { ...state };
      return makeSelection(newState, newData);
    }

    case SET_PROMPT_OBJECTS: {
      const newState = { ...state };
      if (!!data && data.promptObjects) {
        newState.promptObjects = data.promptObjects;
      }
      return newState;
    }

    case REQUEST_IMPORT: {
      const newState = { ...state };
      newState.importRequested = true;
      newState.isPrompted = data.isPrompted;
      if (!!data && data.promptObjects) {
        newState.promptObjects = data.promptObjects;
      }
      return newState;
    }

    case PROMPTS_ANSWERED: {
      const newState = { ...state };
      if (data) {
        newState.promptsAnswers = data.promptsAnswers;
        newState.dossierData = data.dossierData;
      }
      newState.isPrompted = true;
      return newState;
    }

    case CLEAR_PROMPTS_ANSWERS: {
      const newState = { ...state };
      newState.promptsAnswers = null;
      newState.dossierData = null;
      return newState;
    }

    case CANCEL_REQUEST_IMPORT: {
      const newState = { ...state };
      newState.importRequested = false;
      return newState;
    }

    case START_IMPORT: {
      const newState = { ...state };
      newState.importRequested = false;
      return newState;
    }

    case REQUEST_DOSSIER_OPEN: {
      const newState = { ...state };
      newState.dossierOpenRequested = true;
      newState.isPrompted = false;
      if (!!data && data.promptObjects) {
        newState.promptObjects = data.promptObjects;
      }
      return newState;
    }

    case CANCEL_DOSSIER_OPEN: {
      const newState = { ...state };
      newState.dossierOpenRequested = false;
      return newState;
    }

    case SWITCH_IMPORT_SUBTOTALS_ON_IMPORT: {
      const newState = { ...state };
      newState.importSubtotal = data;
      return newState;
    }

    case UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT: {
      const newState = { ...state };
      newState.displayAttrFormNames = data;
      return newState;
    }

    case UPDATE_SELECTED_MENU: {
      const newState = { ...state };
      newState.selectedMenu = data;
      return newState;
    }

    default: {
      return state;
    }
  }
};
