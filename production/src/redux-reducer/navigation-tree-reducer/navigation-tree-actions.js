export const SELECT_OBJECT = 'NAV_TREE_SELECT_OBJECT';
export const REQUEST_IMPORT = 'NAV_TREE_REQUEST_IMPORT';
export const PROMPTS_ANSWERED = 'NAV_TREE_PROMPTS_ANSWERED';
export const CANCEL_REQUEST_IMPORT = 'NAV_TREE_CANCEL_REQUEST_IMPORT';
export const START_IMPORT = 'NAV_TREE_START_IMPORT';
export const CHANGE_SORTING = 'NAV_TREE_CHANGE_SORTING';
export const CHANGE_SEARCHING = 'NAV_TREE_CHANGE_SEARCHING';
export const REQUEST_DOSSIER_OPEN = 'NAV_TREE_REQUEST_DOSSIER_OPEN';
export const CANCEL_DOSSIER_OPEN = 'NAV_TREE_CANCEL_DOSSIER_OPEN';
export const SWITCH_MY_LIBRARY = 'NAV_TREE_SWITCH_MY_LIBRARY';
export const SWITCH_IMPORT_SUBTOTALS = 'NAV_TREE_SWITCH_IMPORT_SUBTOTALS';
export const CLEAR_PROMPTS_ANSWERS = 'NAV_TREE_CLEAR_PROMPTS_ANSWERS';
export const UPDATE_DISPLAY_ATTR_FORM = 'NAV_TREE_UPDATE_DISPLAY_ATTR_FORM';
export const CHANGE_FILTER = 'NAV_TREE_CHANGE_FILTER';
export const CLEAR_SELECTION = 'NAV_TREE_CLEAR_SELECTION';
export const LOAD_BROWSING_STATE_CONST = 'NAV_TREE_LOAD_BROWSING_STATE_CONST';

function selectObject(data) {
  return (dispatch) => dispatch({
    type: SELECT_OBJECT,
    data,
  });
}

function requestImport(data) {
  return (dispatch) => dispatch({ type: REQUEST_IMPORT, data });
}

function promptsAnswered(data) {
  return (dispatch) => dispatch({ type: PROMPTS_ANSWERED, data });
}

function cancelImportRequest() {
  return (dispatch) => dispatch({ type: CANCEL_REQUEST_IMPORT });
}

function startImport() {
  return (dispatch) => dispatch({ type: START_IMPORT });
}

function changeSorting(data) {
  return (dispatch) => dispatch({ type: CHANGE_SORTING, data });
}

function changeSearching(data) {
  return (dispatch) => dispatch({ type: CHANGE_SEARCHING, data });
}

function requestDossierOpen(data) {
  return (dispatch) => dispatch({ type: REQUEST_DOSSIER_OPEN, data });
}

function cancelDossierOpen(data) {
  return (dispatch) => dispatch({ type: CANCEL_DOSSIER_OPEN, data });
}

function switchMyLibrary() {
  return (dispatch) => dispatch({ type: SWITCH_MY_LIBRARY });
}

function switchImportSubtotals(data) {
  return (dispatch) => dispatch({ type: SWITCH_IMPORT_SUBTOTALS, data });
}

function clearPromptAnswers() {
  return (dispatch) => dispatch({ type: CLEAR_PROMPTS_ANSWERS });
}

function updateDisplayAttrForm(data) {
  return (dispatch) => dispatch({ type: UPDATE_DISPLAY_ATTR_FORM, data });
}

function changeFilter(data) {
  return (dispatch) => dispatch({ type: CHANGE_FILTER, data });
}

function clearSelection() {
  return (dispatch) => dispatch({ type: CLEAR_SELECTION });
}

function loadBrowsingState(data) {
  return (dispatch) => dispatch({ type: LOAD_BROWSING_STATE_CONST, data });
}

export const navigationTreeActions = {
  selectObject,
  requestImport,
  promptsAnswered,
  cancelImportRequest,
  startImport,
  changeSorting,
  changeSearching,
  requestDossierOpen,
  cancelDossierOpen,
  switchMyLibrary,
  switchImportSubtotals,
  clearPromptAnswers,
  updateDisplayAttrForm,
  changeFilter,
  clearSelection,
  loadBrowsingState,
};
