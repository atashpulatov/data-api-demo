import { CLEAR_PROMPTS_ANSWERS, CANCEL_DOSSIER_OPEN } from '../navigation/navigation-tree-actions';
import { PopupTypeEnum } from '../home/popup-type-enum';

export const SET_POPUP_TYPE = 'SET_POPUP_TYPE';
export const SET_MSTR_DATA = 'SET_MSTR_DATA';
export const SET_OBJECT_DATA = 'SET_OBJECT_DATA';
export const ON_POPUP_BACK = 'ON_POPUP_BACK';

class PopupStateActions {
  setPopupType = (popupType) => (dispatch) => dispatch({
    type: SET_POPUP_TYPE,
    popupType,
  });

  setMstrData = (payload) => (dispatch) => dispatch({
    type: SET_MSTR_DATA,
    payload,
  });

  setObjectData = (payload) => (dispatch) => dispatch({
    type: SET_OBJECT_DATA,
    payload,
  });

  onPrepareData = () => (dispatch) => {
    dispatch({
      type: SET_POPUP_TYPE,
      payload: PopupTypeEnum.dataPreparation,
    });
  }

  onPopupBack = () => (dispatch) => {
    dispatch({ type: ON_POPUP_BACK });
    dispatch({ type: CLEAR_PROMPTS_ANSWERS });
    dispatch({ type: CANCEL_DOSSIER_OPEN });
  }
}

export const popupStateActions = new PopupStateActions();
