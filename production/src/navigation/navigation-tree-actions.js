import {officeProperties} from '../office/office-properties';

export const SELECT_OBJECT = 'NAV_TREE_SELECT_OBJECT';
export const SET_DATA_SOURCE = 'NAV_TREE_SET_DATA_SOURCE';
export const SELECT_FOLDER = 'NAV_TREE_SELECT_FOLDER';
export const START_IMPORT = 'NAV_TREE_START_IMPORT';

export function selectObject(data) {
  return (dispatch) => dispatch({
    type: SELECT_OBJECT,
    data,
  });
}

export function setDataSource(data) {
  return (dispatch) => dispatch({
    type: SET_DATA_SOURCE,
    data,
  });
}

export function selectFolder(data) {
  return (dispatch) => dispatch({
    type: SELECT_FOLDER,
    data,
  });
}

export function startImport() {
  return (dispatch) => dispatch({type: START_IMPORT});
}

export function startLoading(dispatch) {
  return () => {
    dispatch({type: officeProperties.actions.startLoading});
  };
}
