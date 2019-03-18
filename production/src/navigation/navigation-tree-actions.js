import {officeProperties} from '../office/office-properties';

export const SELECT_OBJECT = 'NAV_TREE_SELECT_OBJECT';
export const SET_DATA_SOURCE = 'NAV_TREE_SET_DATA_SOURCE';
export const SELECT_FOLDER = 'NAV_TREE_SELECT_FOLDER';
export const START_IMPORT = 'NAV_TREE_START_IMPORT';

export function selectObject(dispatch) {
  return (data) => {
    dispatch({
      type: SELECT_OBJECT,
      data,
    });
  };
}

export function setDataSource(dispatch) {
  return (data) => {
    dispatch({
      type: SET_DATA_SOURCE,
      data,
    });
  };
}

export function selectFolder(dispatch) {
  return (data) => {
    dispatch({
      type: SELECT_FOLDER,
      data,
    });
  };
}

export function startImport(dispatch) {
  return () => {
    dispatch({type: START_IMPORT});
  };
}

export function startLoading(dispatch) {
  return () => {
    console.log('magic - super');
    dispatch({type: officeProperties.actions.startLoading});
  };
}
