import {officeProperties} from '../office/office-properties';

export const SELECT_OBJECT = 'NAV_TREE_SELECT_OBJECT';
export const SET_DATA_SOURCE = 'NAV_TREE_SET_DATA_SOURCE';
export const SELECT_FOLDER = 'NAV_TREE_SELECT_FOLDER';
export const REQUEST_IMPORT = 'REQUEST_IMPORT';
export const START_IMPORT = 'NAV_TREE_START_IMPORT';
export const CHANGE_SORTING = 'NAV_TREE_CHANGE_SORTING';
export const CHANGE_SEARCHING = 'NAV_TREE_CHANGE_SEARCHING';
export const UPDATE_SCROLL = 'NAV_TREE_UPDATE_SCROLL';
export const UPDATE_SIZE = 'NAV_TREE_UPDATE_SIZE';
export const CANCEL_REQUEST_IMPORT = 'CANCEL_REQUEST_IMPORT';

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

export function requestImport(data) {
  return (dispatch) => dispatch({type: REQUEST_IMPORT, data});
}

export function cancelImportRequest() {
  return (dispatch) => dispatch({type: CANCEL_REQUEST_IMPORT});
}

export function startImport() {
  return (dispatch) => dispatch({type: START_IMPORT});
}

export function startLoading() {
  return (dispatch) => dispatch({type: officeProperties.actions.startLoading});
}

export function changeSorting(data) {
  return (dispatch) => dispatch({type: CHANGE_SORTING, data});
}

export function changeSearching(data) {
  return (dispatch) => dispatch({type: CHANGE_SEARCHING, data});
}

export function updateScroll(data) {
  return (dispatch) => dispatch({type: UPDATE_SCROLL, data});
}

export function updateSize(data) {
  return (dispatch) => dispatch({type: UPDATE_SIZE, data});
}

export const actions = {
  selectFolder, selectObject, setDataSource, requestImport, startImport, startLoading, changeSearching, changeSorting, updateScroll, updateSize,
};
