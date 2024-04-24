import {
  DialogType,
  PopupStateActions,
  PopupStateActionTypes,
  PopupStateState,
} from './popup-state-reducer-types';

export const initialState: PopupStateState = {};

export const popupStateReducer = (
  // eslint-disable-next-line default-param-last
  state = initialState,
  action: PopupStateActions
): PopupStateState => {
  const { type } = action;
  switch (type) {
    case PopupStateActionTypes.SET_POPUP_TYPE: {
      return {
        ...state,
        popupType: action.popupType,
      };
    }
    case PopupStateActionTypes.POPUP_STATE_SET_DIALOG_TYPE: {
      return {
        ...state,
        dialogType: action.dialogType,
      };
    }
    case PopupStateActionTypes.SET_MSTR_DATA:
    case PopupStateActionTypes.SET_OBJECT_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case PopupStateActionTypes.ON_POPUP_BACK: {
      return {
        ...state,
        popupType: DialogType.libraryWindow,
      };
    }
    case PopupStateActionTypes.CLEAR_POPUP_STATE: {
      return initialState;
    }
    case PopupStateActionTypes.SET_IS_DATA_OVERVIEW_OPEN: {
      return {
        ...state,
        isDataOverviewOpen: action.payload,
      };
    }
    case PopupStateActionTypes.SET_FILTERED_PAGE_BY_LINK_ID: {
      return {
        ...state,
        filteredPageByLinkId: action.payload,
      };
    }
    case PopupStateActionTypes.SET_IMPORT_TYPE: {
      return {
        ...state,
        importType: action.importType,
      };
    }

    default:
      return state;
  }
};
