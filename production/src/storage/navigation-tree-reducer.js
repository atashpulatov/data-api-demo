import {
  SELECT_FOLDER, SELECT_OBJECT, SET_DATA_SOURCE, START_IMPORT, CHANGE_SORTING, CHANGE_SEARCHING, UPDATE_SCROLL,
  UPDATE_SIZE, REQUEST_IMPORT, CANCEL_REQUEST_IMPORT, PROMPTS_ANSWERED, CLEAR_PROMPTS_ANSWERS, REQUEST_DOSSIER_OPEN,
  CANCEL_DOSSIER_OPEN, SWITCH_MY_LIBRARY, CHANGE_FILTER,
} from '../navigation/navigation-tree-actions';
import { CLEAR_WINDOW } from '../popup/popup-actions';
import { LOAD_BROWSING_STATE_CONST } from '../browser/browser-actions';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';
export const DEFAULT_TYPE = 'Data';

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
};

function getType(subtype) {
  const selectedType = supportedTypesArray.find((item) => item.subtype.includes(subtype));
  return selectedType ? selectedType.name : DEFAULT_TYPE;
}

export const navigationTree = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case SELECT_OBJECT: {
      const newState = { ...state };
      newState.chosenObjectId = data.chosenObjectId || null;
      newState.chosenProjectId = data.chosenProjectId || null;
      newState.chosenSubtype = data.chosenSubtype || null;
      newState.chosenObjectName = data.chosenObjectName || DEFAULT_PROJECT_NAME;
      newState.chosenType = getType(data.chosenSubtype);
      newState.isPrompted = !!data.isPrompted;
      newState.objectType = data.objectType;
      newState.chosenChapterKey = data.chosenChapterKey || null;
      newState.chosenVisualizationKey = data.chosenVisualizationKey || null;
      newState.preparedInstanceId = data.preparedInstanceId || null;
      return newState;
    }
    case UPDATE_SCROLL: {
      const newState = { ...state };
      newState.scrollPosition = data;
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
      return newState;
    }
    case CHANGE_FILTER: {
      const newState = { ...state };
      if (state.myLibrary) {
        newState.myLibraryFilter = data;
      } else {
        newState.envFilter = data;
      }
      return newState;
    }
    case LOAD_BROWSING_STATE_CONST:
      return {
        ...initialState,
        ...action.browsingState,
      };
    default: {
      return state;
    }
  }
};
