import {
  PopupState,
  PopupStateActions,
  PopupStateActionTypes,
  PopupTypeEnum,
} from './popup-state-reducer-types';

export const initialState: PopupState = {};

// eslint-disable-next-line default-param-last
export const popupStateReducer = (state = initialState, action: PopupStateActions): PopupState => {
  const { type } = action;
  switch (type) {
    case PopupStateActionTypes.SET_POPUP_TYPE: {
      return {
        ...state,
        popupType: action.popupType,
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
        popupType: PopupTypeEnum.libraryWindow,
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

    default:
      return state;
  }
};
