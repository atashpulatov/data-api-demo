import { Dispatch } from 'redux';

import { DialogType, PopupStateActionTypes } from './popup-state-reducer-types';

import { navigationTreeActions } from '../navigation-tree-reducer/navigation-tree-actions';
import { popupActions } from '../popup-reducer/popup-actions';
import { ObjectImportType } from '../../mstr-object/constants';

class PopupStateActions {
  setPopupType = (popupType: DialogType) => (dispatch: Dispatch<any>) =>
    dispatch({
      type: PopupStateActionTypes.SET_POPUP_TYPE,
      popupType,
    });

  setDialogType = (dialogType: DialogType) => (dispatch: Dispatch<any>) =>
    dispatch({
      type: PopupStateActionTypes.POPUP_STATE_SET_DIALOG_TYPE,
      dialogType,
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
      popupType: DialogType.dataPreparation,
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

  setImportType = (importType: ObjectImportType) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: PopupStateActionTypes.SET_IMPORT_TYPE,
      importType,
    });
  };

  setPrefilteredObjectName = (objectName: string) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: PopupStateActionTypes.SET_PREFILTERED_OBJECT_NAME,
      objectName,
    });
  };
}

export const popupStateActions = new PopupStateActions();
