import { navigationTreeActions } from '../navigation-tree-reducer/navigation-tree-actions';
import { filterActions } from '../filter-reducer/filter-actions';
import { popupActions } from '../popup-reducer/popup-actions';
import { PopupTypeEnum } from '../../home/popup-type-enum';

export const SET_POPUP_TYPE = 'POPUP_STATE_SET_POPUP_TYPE';
export const SET_MSTR_DATA = 'POPUP_STATE_SET_MSTR_DATA';
export const SET_OBJECT_DATA = 'POPUP_STATE_SET_OBJECT_DATA';
export const ON_POPUP_BACK = 'POPUP_STATE_ON_POPUP_BACK';
export const CLEAR_POPUP_STATE = 'POPUP_STATE_CLEAR_POPUP_STATE';

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
      popupType: PopupTypeEnum.dataPreparation,
    });
  };

  onClearPopupState = () => (dispatch) => {
    dispatch(filterActions.changeSearching(''));
    dispatch({ type: CLEAR_POPUP_STATE, });
  };

  onPopupBack = () => (dispatch) => {
    dispatch({ type: ON_POPUP_BACK });
    dispatch(navigationTreeActions.clearPromptAnswers());
    dispatch(popupActions.clearEditedObject());
    dispatch(navigationTreeActions.cancelDossierOpen());
    dispatch(filterActions.changeSorting({}));
  };
}

export const popupStateActions = new PopupStateActions();
