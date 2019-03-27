import {SELECT_FOLDER, SELECT_OBJECT, SET_DATA_SOURCE, START_IMPORT} from '../navigation/navigation-tree-actions';
import {CLEAR_WINDOW} from '../popup/popup-actions';

export const defaultProjectName = 'Prepare Data';
export const defaultType = 'Data';

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
    case SET_DATA_SOURCE: {
      const newState = {...state};
      newState.dataSource = data;
      return newState;
    }
    case SELECT_FOLDER: {
      if (state.folder === data) {
        return state;
      }
      const newState = {...state};
      newState.folder = data;
      newState.chosenObjectId = null;
      newState.chosenProjectId = null;
      newState.chosenSubtype = null;
      newState.chosenProjectName = defaultProjectName;
      newState.chosenType = defaultType;
      newState.scrollPosition = null;
      newState.pageSize = null;
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
    default: {
      return state;
    }
  }
};
