import { Dispatch } from 'redux';

import { NavigationTreeActionTypes } from './navigation-tree-reducer-types';

function selectObject(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({
      type: NavigationTreeActionTypes.SELECT_OBJECT,
      data,
    });
}

function setPromptObjects(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.SET_PROMPT_OBJECTS, data });
}

function requestImport(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.REQUEST_IMPORT, data });
}

function promptsAnswered(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.PROMPTS_ANSWERED, data });
}

function cancelImportRequest() {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.CANCEL_REQUEST_IMPORT });
}

function startImport() {
  return (dispatch: Dispatch<any>) => dispatch({ type: NavigationTreeActionTypes.START_IMPORT });
}

function requestDossierOpen(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.REQUEST_DOSSIER_OPEN, data });
}

function cancelDossierOpen(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.CANCEL_DOSSIER_OPEN, data });
}

function switchImportSubtotalsOnImport(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_IMPORT, data });
}

function clearPromptAnswers() {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.CLEAR_PROMPTS_ANSWERS });
}

function updateDisplayAttrFormOnImport(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT, data });
}

function updateSelectedMenu(data: any) {
  return (dispatch: Dispatch<any>) =>
    dispatch({ type: NavigationTreeActionTypes.UPDATE_SELECTED_MENU, data });
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
  setPromptObjects,
  updateSelectedMenu,
};