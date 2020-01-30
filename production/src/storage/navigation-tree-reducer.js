import {
  SELECT_FOLDER, SELECT_OBJECT, SET_DATA_SOURCE, START_IMPORT, CHANGE_SORTING, CHANGE_SEARCHING, UPDATE_SCROLL,
  UPDATE_SIZE, REQUEST_IMPORT, CANCEL_REQUEST_IMPORT, PROMPTS_ANSWERED, CLEAR_PROMPTS_ANSWERS, REQUEST_DOSSIER_OPEN,
  CANCEL_DOSSIER_OPEN, SWITCH_MY_LIBRARY, CHANGE_FILTER, CHANGE_IS_PROMPTED,
  LOAD_BROWSING_STATE_CONST, UPDATE_DISPLAY_ATTR_FORM,
  SWITCH_IMPORT_SUBTOTALS
} from '../navigation/navigation-tree-actions';
import { CLEAR_WINDOW } from '../popup/popup-actions';
import { CREATE_CACHE, CLEAR_CACHE, REFRESH_CACHE } from '../cache/cache-actions';
import { sessionProperties } from './session-properties';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';
export const DEFAULT_TYPE = 'Data';
export const SAVE_MY_LIBRARY_OWNERS = 'SAVE_MY_LIBRARY_OWNERS';

// TODO: use some global store, redux one probably will be the best choice, or maybe some const global value
// TODO: use mstrObjectType instead of this array
const supportedTypesArray = [
  {
    name: 'Report',
    type: 3,
    subtype: [768, 769, 774], // DssXmlSubTypeReportGrid, DssXmlSubTypeReportGraph, DssXmlSubTypeReportGridAndGraph
  },
  {
    name: 'Dataset',
    type: 3,
    subtype: [776, 779],
  },
  {
    name: 'Dossier',
    type: 55,
    subtype: [14081],
  },
];

export const initialState = {
  folder: null,
  requestPerformed: false,
  chosenObjectId: null,
  chosenProjectId: null,
  chosenSubtype: null,
  chosenObjectName: DEFAULT_PROJECT_NAME,
  chosenType: DEFAULT_TYPE,
  isPrompted: false,
  dataSource: null,
  loading: false,
  scrollPosition: null,
  pageSize: null,
  sorter: {},
  searchText: '',
  importRequested: false,
  dossierData: null,
  promptsAnswers: null,
  objectType: null,
  chosenChapterKey: null,
  chosenVisualizationKey: null,
  dossierOpenRequested: false,
  envFilter: {},
  myLibraryFilter: {},
  myLibrary: true,
  chosenLibraryDossier: null,
  chosenLibraryElement: {},
  chosenEnvElement: {},
  myLibraryOwners: {},
};

function getType(subtype) {
  const selectedType = supportedTypesArray.find((item) => item.subtype.includes(subtype));
  return selectedType ? selectedType.name : DEFAULT_TYPE;
}

function cleanSelection(state) {
  const newState = { ...state };
  newState.sorter = initialState.sorter;
  newState.chosenObjectId = initialState.chosenObjectId;
  newState.chosenProjectId = initialState.chosenProjectId;
  newState.chosenSubtype = initialState.chosenSubtype;
  newState.chosenObjectName = initialState.chosenObjectName;
  newState.chosenType = initialState.chosenType;
  return newState;
}

function makeSelection(newState, data) {
  newState.requestPerformed = data.requestPerformed || false;
  newState.chosenObjectId = data.chosenObjectId || null;
  newState.chosenProjectId = data.chosenProjectId || null;
  newState.chosenSubtype = data.chosenSubtype || null;
  newState.chosenObjectName = data.chosenObjectName || DEFAULT_PROJECT_NAME;
  newState.chosenType = getType(data.chosenSubtype);
  newState.objectType = data.objectType;
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
  case UPDATE_SCROLL: {
    const newState = { ...state };
    newState.scrollPosition = data;
    return newState;
  }
  case CHANGE_IS_PROMPTED: {
    const newState = { ...state };
    newState.isPrompted = data;
    return newState;
  }
  case UPDATE_SIZE: {
    const newState = { ...state };
    newState.pageSize = data;
    return newState;
  }
  case SET_DATA_SOURCE: {
    const newState = { ...state };
    newState.dataSource = data;
    return newState;
  }
  case SELECT_FOLDER: {
    if (state.folder === data) {
      return state;
    }
    const newState = { ...state };
    newState.folder = data;
    newState.chosenObjectId = null;
    newState.chosenProjectId = null;
    newState.chosenSubtype = null;
    newState.chosenObjectName = DEFAULT_PROJECT_NAME;
    newState.chosenType = DEFAULT_TYPE;
    newState.scrollPosition = null;
    newState.pageSize = null;
    newState.sorter = {
      columnKey: 'dateModified',
      order: 'descend',
    };
    newState.searchText = '';
    return newState;
  }
  case CLEAR_WINDOW: {
    return { ...initialState };
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
    newState.envFilter = data;
    newState.myLibraryFilter = data;
    if (newState.myLibrary) {
      newState.envFilter.owners = state.envFilter.owners
        ? state.envFilter.owners.filter(item => !newState.myLibraryOwners[item] || data.owners.includes(item))
        : data.owners;
    } else {
      newState.myLibraryFilter.owners = data.owners.filter(item => newState.myLibraryOwners[item]);
    }
    return newState;
  }
  case LOAD_BROWSING_STATE_CONST: {
    return {
      ...initialState,
      ...action.browsingState,
    };
  }
  case CREATE_CACHE:
  case CLEAR_CACHE:
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
  default: {
    return state;
  }
  }
};
