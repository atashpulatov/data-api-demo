import {SELECT_FOLDER, SELECT_OBJECT, SET_DATA_SOURCE, START_IMPORT, CHANGE_SORTING, CHANGE_SEARCHING, UPDATE_SCROLL, UPDATE_SIZE} from '../navigation/navigation-tree-actions';
import {CLEAR_WINDOW} from '../popup/popup-actions';

const defaultProjectName = 'Prepare Data';
const defaultType = 'Data';

// TODO: use some global store, redux one probably will be the best choice, or maybe some const global value
const supportedTypesArray = [
  {
    name: 'Report',
    type: 3,
    subtype: [768],
  },
  {
    name: 'Dataset',
    type: 3,
    subtype: [776, 779],
  },
];

export const initialState = {
  folder: null,
  chosenObjectId: null,
  chosenProjectId: null,
  chosenSubtype: null,
  chosenProjectName: defaultProjectName,
  chosenType: defaultType,
  dataSource: null,
  loading: false,
  scrollPosition: null,
  pageSize: null,
  sorter: {
    columnKey: 'dateModified',
    order: 'descend',
  },
  searchText: '',
};

function getProjectName(projects, projectId, objectId) {
  if (!projects || !projects.length) {
    return defaultProjectName;
  }
  const selectedObject = projects.find((item) => item.projectId === projectId && item.key === objectId);
  return selectedObject ? selectedObject.name : defaultProjectName;
}

function getType(subtype) {
  const selectedType = supportedTypesArray.find((item) => item.subtype.includes(subtype));
  return selectedType ? selectedType.name : defaultType;
}

export const navigationTree = (state = initialState, action) => {
  const {type, data} = action;
  switch (type) {
    case SELECT_OBJECT: {
      const newState = {...state};
      newState.chosenObjectId = data.chosenObjectId || null;
      newState.chosenProjectId = data.chosenProjectId || null;
      newState.chosenSubtype = data.chosenSubtype || null;
      newState.chosenProjectName = getProjectName(state.dataSource, data.chosenProjectId, data.chosenObjectId);
      newState.chosenType = getType(data.chosenSubtype);
      return newState;
    }
    case UPDATE_SCROLL: {
      const newState = {...state};
      newState.scrollPosition = data;
      return newState;
    }
    case UPDATE_SIZE: {
      const newState = {...state};
      newState.pageSize = data;
      return newState;
    }
    case SET_DATA_SOURCE: {
      const newState = {...state};
      newState.dataSource = data;
      return newState;
    }
    case SELECT_FOLDER: {
      const newState = {...state};
      newState.folder = data;
      return newState;
    }
    case CLEAR_WINDOW: {
      return {...initialState};
    }
    case START_IMPORT: {
      const newState = {...state};
      newState.loading = true;
      return newState;
    }
    case CHANGE_SORTING: {
      const newState = {...state};
      newState.sorter = data;
      return newState;
    }
    case CHANGE_SEARCHING: {
      const newState = {...state};
      newState.searchText = data;
      return newState;
    }
    default: {
      return state;
    }
  }
};
