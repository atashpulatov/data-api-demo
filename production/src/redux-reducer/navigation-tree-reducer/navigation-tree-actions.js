import { officeProperties } from '../office-reducer/office-properties';

export const SELECT_OBJECT = 'NAV_TREE_SELECT_OBJECT';
export const SET_DATA_SOURCE = 'NAV_TREE_SET_DATA_SOURCE';
export const SELECT_FOLDER = 'NAV_TREE_SELECT_FOLDER';
export const REQUEST_IMPORT = 'REQUEST_IMPORT';
export const PROMPTS_ANSWERED = 'PROMPTS_ANSWERED';
export const START_IMPORT = 'NAV_TREE_START_IMPORT';
export const CHANGE_SORTING = 'NAV_TREE_CHANGE_SORTING';
export const CHANGE_SEARCHING = 'NAV_TREE_CHANGE_SEARCHING';
export const UPDATE_SCROLL = 'NAV_TREE_UPDATE_SCROLL';
export const UPDATE_SIZE = 'NAV_TREE_UPDATE_SIZE';
export const CANCEL_REQUEST_IMPORT = 'CANCEL_REQUEST_IMPORT';
export const CLEAR_PROMPTS_ANSWERS = 'CLEAR_PROMPTS_ANSWERS';
export const REQUEST_DOSSIER_OPEN = 'REQUEST_DOSSIER_OPEN';
export const CANCEL_DOSSIER_OPEN = 'CANCEL_DOSSIER_OPEN';
export const CHANGE_FILTER = 'CHANGE_FILTER';
export const SWITCH_MY_LIBRARY = 'SWITCH_MY_LIBRARY';
export const SWITCH_IMPORT_SUBTOTALS = 'SWITCH_IMPORT_SUBTOTALS';
export const CHANGE_IS_PROMPTED = 'CHANGE_IS_PROMPTED';
export const LOAD_BROWSING_STATE_CONST = 'LOAD_BROWSING_STATE_CONST';
export const UPDATE_DISPLAY_ATTR_FORM = 'UPDATE_DISPLAY_ATTR_FORM';
export const CLEAR_SELECTION = 'CLEAR_SELECTION';
export const SET_POPUP_RENDERED = 'SET_POPUP_RENDERED';

export function selectObject(data) {
  return (dispatch) => dispatch({
    type: SELECT_OBJECT,
    data,
  });
}
export function changeIsPrompted(data) {
  return (dispatch) => dispatch({
    type: CHANGE_IS_PROMPTED,
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
  return (dispatch) => dispatch({ type: REQUEST_IMPORT, data });
}

export function promptsAnswered(data) {
  return (dispatch) => dispatch({ type: PROMPTS_ANSWERED, data });
}

export function cancelImportRequest() {
  return (dispatch) => dispatch({ type: CANCEL_REQUEST_IMPORT });
}

export function startImport() {
  return (dispatch) => dispatch({ type: START_IMPORT });
}

export function startLoading() {
  return (dispatch) => dispatch({ type: officeProperties.actions.startLoading });
}

export function stopLoading() {
  return (dispatch) => dispatch({ type: officeProperties.actions.stopLoading });
}

export function changeSorting(data) {
  return (dispatch) => dispatch({ type: CHANGE_SORTING, data });
}

export function changeSearching(data) {
  return (dispatch) => dispatch({ type: CHANGE_SEARCHING, data });
}

export function updateScroll(data) {
  return (dispatch) => dispatch({ type: UPDATE_SCROLL, data });
}

export function updateSize(data) {
  return (dispatch) => dispatch({ type: UPDATE_SIZE, data });
}

export function requestDossierOpen(data) {
  return (dispatch) => dispatch({ type: REQUEST_DOSSIER_OPEN, data });
}

export function switchMyLibrary() {
  return (dispatch) => dispatch({ type: SWITCH_MY_LIBRARY });
}

export function switchImportSubtotals(data) {
  return (dispatch) => dispatch({ type: SWITCH_IMPORT_SUBTOTALS, data });
}

export function updateDisplayAttrForm(data) {
  return (dispatch) => dispatch({ type: UPDATE_DISPLAY_ATTR_FORM, data });
}

export function changeFilter(data) {
  return (dispatch) => dispatch({ type: CHANGE_FILTER, data });
}

export function clearSelection() {
  return (dispatch) => dispatch({ type: CLEAR_SELECTION });
}

export const actions = {
  selectFolder,
  selectObject,
  setDataSource,
  requestImport,
  promptsAnswered,
  startImport,
  startLoading,
  stopLoading,
  changeSearching,
  changeSorting,
  updateScroll,
  updateSize,
  requestDossierOpen,
  switchMyLibrary,
  changeFilter,
  clearSelection
};
