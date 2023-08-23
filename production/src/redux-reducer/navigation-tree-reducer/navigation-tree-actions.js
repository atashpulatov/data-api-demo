export const SELECT_OBJECT = 'NAV_TREE_SELECT_OBJECT';
export const REQUEST_IMPORT = 'NAV_TREE_REQUEST_IMPORT';
export const PROMPTS_ANSWERED = 'NAV_TREE_PROMPTS_ANSWERED';
export const CANCEL_REQUEST_IMPORT = 'NAV_TREE_CANCEL_REQUEST_IMPORT';
export const START_IMPORT = 'NAV_TREE_START_IMPORT';
export const REQUEST_DOSSIER_OPEN = 'NAV_TREE_REQUEST_DOSSIER_OPEN';
export const CANCEL_DOSSIER_OPEN = 'NAV_TREE_CANCEL_DOSSIER_OPEN';
export const SWITCH_IMPORT_SUBTOTALS_ON_IMPORT = 'NAV_TREE_SWITCH_IMPORT_SUBTOTALS_ON_IMPORT';
export const CLEAR_PROMPTS_ANSWERS = 'NAV_TREE_CLEAR_PROMPTS_ANSWERS';
export const UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT = 'NAV_TREE_UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT';
export const UPDATE_SELECTED_MENU = 'UPDATE_SELECTED_MENU';
export const SWITCH_SEARCH_PAGE_SHOWN = 'SWITCH_SEARCH_PAGE_SHOWN';
export const UPDATE_SEARCH_TYPE = 'UPDATE_SEARCH_TYPE';

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

function requestDossierOpen(data) {
  return (dispatch) => dispatch({ type: REQUEST_DOSSIER_OPEN, data });
}

function cancelDossierOpen(data) {
  return (dispatch) => dispatch({ type: CANCEL_DOSSIER_OPEN, data });
}

function switchImportSubtotalsOnImport(data) {
  return (dispatch) => dispatch({ type: SWITCH_IMPORT_SUBTOTALS_ON_IMPORT, data });
}

function clearPromptAnswers() {
  return (dispatch) => dispatch({ type: CLEAR_PROMPTS_ANSWERS });
}

function updateDisplayAttrFormOnImport(data) {
  return (dispatch) => dispatch({ type: UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT, data });
}

function updateSelectedMenu(data) {
  return (dispatch) => dispatch({ type: UPDATE_SELECTED_MENU, data });
}

function switchSearchPageShown(data) {
  return (dispatch) => dispatch({ type: SWITCH_SEARCH_PAGE_SHOWN, data });
}

function updateSearchType(data) {
  return (dispatch) => dispatch({ type: UPDATE_SEARCH_TYPE, data });
}

export const navigationTreeActions = {
  selectObject,
  requestImport,
  promptsAnswered,
  cancelImportRequest,
  startImport,
  requestDossierOpen,
  cancelDossierOpen,
  switchImportSubtotalsOnImport,
  clearPromptAnswers,
  updateDisplayAttrFormOnImport,
  updateSelectedMenu,
  switchSearchPageShown,
  updateSearchType
};
