import { Dispatch } from 'redux';

import { PopupStateActionTypes, PopupTypeEnum } from './popup-state-reducer-types';

import { navigationTreeActions } from '../navigation-tree-reducer/navigation-tree-actions';
import { popupActions } from '../popup-reducer/popup-actions';

class PopupStateActions {
  setPopupType = (popupType: PopupTypeEnum) => (dispatch: Dispatch<any>) =>
    dispatch({
      type: PopupStateActionTypes.SET_POPUP_TYPE,
      popupType,
    });

  setMstrData = (payload: any) => (dispatch: Dispatch<any>) =>
    dispatch({
      type: PopupStateActionTypes.SET_MSTR_DATA,
      payload,
    });

  setObjectData = (payload: any) => (dispatch: Dispatch<any>) =>
    dispatch({
      type: PopupStateActionTypes.SET_OBJECT_DATA,
      payload,
    });

  onPrepareData = () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: PopupStateActionTypes.SET_POPUP_TYPE,
      popupType: PopupTypeEnum.dataPreparation,
    });
  };

  onClearPopupState = () => (dispatch: Dispatch<any>) => {
    dispatch({ type: PopupStateActionTypes.CLEAR_POPUP_STATE });
  };

  onPopupBack = () => (dispatch: Dispatch<any>) => {
    dispatch({ type: PopupStateActionTypes.ON_POPUP_BACK });
    dispatch(navigationTreeActions.clearPromptAnswers());
    dispatch(popupActions.clearEditedObject());
    dispatch(
      navigationTreeActions.selectObject({
        chosenObjectId: '',
        chosenObjectName: '',
        chosenProjectId: '',
        chosenSubtype: '',
        mstrObjectType: '',
      })
    );
    dispatch(navigationTreeActions.cancelDossierOpen({}));
  };

  setIsDataOverviewOpen = (payload: boolean) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: PopupStateActionTypes.SET_IS_DATA_OVERVIEW_OPEN,
      payload,
    });
  };

  setFilteredPageByLinkId = (payload: string) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: PopupStateActionTypes.SET_FILTERED_PAGE_BY_LINK_ID,
      payload,
    });
  };
}

export const popupStateActions = new PopupStateActions();
