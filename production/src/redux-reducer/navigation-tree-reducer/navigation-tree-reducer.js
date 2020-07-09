import {
  SELECT_OBJECT, START_IMPORT, CHANGE_SORTING, CHANGE_SEARCHING,
  REQUEST_IMPORT, CANCEL_REQUEST_IMPORT, PROMPTS_ANSWERED, CLEAR_PROMPTS_ANSWERS, REQUEST_DOSSIER_OPEN,
  CANCEL_DOSSIER_OPEN, SWITCH_MY_LIBRARY, CHANGE_FILTER,
  LOAD_BROWSING_STATE_CONST, UPDATE_DISPLAY_ATTR_FORM, SWITCH_IMPORT_SUBTOTALS, CLEAR_SELECTION,
} from './navigation-tree-actions';
import { CLEAR_CACHE, REFRESH_CACHE, SAVE_MY_LIBRARY_OWNERS } from '../cache-reducer/cache-actions';
import { sessionProperties } from '../session-reducer/session-properties';
import { CLEAR_POPUP_STATE } from '../popup-state-reducer/popup-state-actions';
import { calculateNumberOfFiltersActive } from '../../helpers/numberOfFiltersActive';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';

export const initialState = {
  chosenObjectId: null,
  chosenProjectId: null,
  chosenSubtype: null,
  chosenObjectName: DEFAULT_PROJECT_NAME,
  isPrompted: false,
  loading: false,
  sorter: {},
  searchText: '',
  importRequested: false,
  dossierData: null,
  promptsAnswers: null,
  mstrObjectType: null,
  chosenChapterKey: null,
  chosenVisualizationKey: null,
  dossierOpenRequested: false,
  isEdit: false,
  envFilter: {},
  myLibraryFilter: {},
  myLibrary: true,
  chosenLibraryDossier: null,
  chosenLibraryElement: {},
  chosenEnvElement: {},
  myLibraryOwners: {},
  numberOfFiltersActive: 0,
};


function cleanSelection(state) {
  const newState = { ...state };
  newState.sorter = initialState.sorter;
  newState.chosenObjectId = initialState.chosenObjectId;
  newState.chosenProjectId = initialState.chosenProjectId;
  newState.chosenSubtype = initialState.chosenSubtype;
  newState.chosenObjectName = initialState.chosenObjectName;
  newState.chosenEnvElement = initialState.chosenEnvElement;
  newState.dossierOpenRequested = initialState.dossierOpenRequested;
  newState.chosenLibraryElement = initialState.chosenLibraryElement;
  newState.chosenLibraryDossier = initialState.chosenLibraryDossier;
  return newState;
}

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
      if (!data.chosenObjectId) {
        return state;
      }
      const newState = { ...state };
      if (newState.myLibrary) {
        newState.chosenLibraryElement = data;
      } else {
        newState.chosenEnvElement = data;
      }
      return makeSelection(newState, data);
    }
    case SAVE_MY_LIBRARY_OWNERS: {
      const tempObject = {};
      const newState = { ...state };
      data.forEach(item => {
        tempObject[item] = true;
      });
      newState.myLibraryOwners = tempObject;
      return newState;
    }

    case REQUEST_IMPORT: {
      const newState = { ...state };
      newState.importRequested = true;
      newState.isPrompted = data;
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
      newState.loading = true;
      return newState;
    }
    case CHANGE_SORTING: {
      const newState = { ...state };
      newState.sorter = data;
      return newState;
    }
    case CHANGE_SEARCHING: {
      const newState = { ...state };
      newState.searchText = data;
      return newState;
    }
    case REQUEST_DOSSIER_OPEN: {
      const newState = { ...state };
      newState.dossierOpenRequested = true;
      newState.isPrompted = data;
      return newState;
    }
    case CANCEL_DOSSIER_OPEN: {
      const newState = { ...state };
      newState.dossierOpenRequested = false;
      return newState;
    }
    case SWITCH_MY_LIBRARY: {
      const newState = { ...state };
      newState.myLibrary = !state.myLibrary;
      const filter = newState.myLibrary ? newState.myLibraryFilter : newState.envFilter;
      newState.numberOfFiltersActive = calculateNumberOfFiltersActive(filter, newState.myLibrary);
      return makeSelection(newState, newState.myLibrary ? newState.chosenLibraryElement : newState.chosenEnvElement);
    }
    case SWITCH_IMPORT_SUBTOTALS: {
      const newState = { ...state };
      newState.importSubtotal = data;
      return newState;
    }
    case UPDATE_DISPLAY_ATTR_FORM: {
      const newState = { ...state };
      newState.displayAttrFormNames = data;
      return newState;
    }
    case CHANGE_FILTER: {
      const newState = { ...state };
      newState.envFilter = { ...data };
      newState.myLibraryFilter = { ...data };
      if (data.shouldClear) {
        newState.envFilter.shouldClear = false;
        newState.myLibraryFilter.shouldClear = false;
      } else if (newState.myLibrary) {
        newState.envFilter.owners = state.envFilter.owners
          ? [...state.envFilter.owners.filter(item => !newState.myLibraryOwners[item]), ...data.owners]
          : data.owners;
      } else {
        newState.myLibraryFilter.owners = data.owners.filter(item => newState.myLibraryOwners[item]);
      }
      newState.numberOfFiltersActive = calculateNumberOfFiltersActive(newState.envFilter, newState.myLibrary);
      return newState;
    }
    case LOAD_BROWSING_STATE_CONST: {
      return {
        ...initialState,
        ...action.browsingState,
      };
    }
    case CLEAR_CACHE:
    case CLEAR_SELECTION:
      return cleanSelection(state);
    case REFRESH_CACHE: {
      return data ? cleanSelection(state) : state;
    }
    case sessionProperties.actions.logIn:
    case sessionProperties.actions.logOut: {
      const newState = { ...state };
      newState.envFilter = {};
      newState.myLibraryFilter = {};
      newState.myLibrary = true;
      return newState;
    }
    case CLEAR_POPUP_STATE: {
      return { ...state, searchText: '' };
    }
    default: {
      return state;
    }
  }
};
