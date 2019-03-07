import {SELECT_FOLDER, SELECT_OBJECT, SET_DATA_SOURCE, START_IMPORT} from '../navigation/navigation-tree-actions';
import {CLEAR_WINDOW} from '../popup/popup-actions';

const defaultProjectName = 'Prepare Data';

export const initialState = {
  folder: null,
  chosenObjectId: null,
  chosenProjectId: null,
  chosenSubtype: null,
  chosenProjectName: defaultProjectName,
  dataSource: null,
  loading: false,
};

function getProjectName(projects, projectId, objectId) {
  if (!projects || !projects.length) {
    return defaultProjectName;
  }
  const selectedObject = projects.find((item) => item.application === projectId && item.key === objectId);
  return selectedObject ? selectedObject.name : defaultProjectName;
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
    default: {
      return state;
    }
  }
};
