import { PopupTypeEnum } from '../../home/popup-type-enum';
import {
  CLEAR_POPUP_STATE,
  ON_POPUP_BACK,
  SET_FILTERED_PAGE_BY_LINK_ID,
  SET_IS_DATA_OVERVIEW_OPEN,
  SET_MSTR_DATA,
  SET_OBJECT_DATA,
  SET_POPUP_TYPE,
} from './popup-state-actions';

export const initialState = {};

export const popupStateReducer = (state = initialState, action = {}) => {
  const { type } = action;
  switch (type) {
    case SET_POPUP_TYPE: {
      return {
        ...state,
        popupType: action.popupType,
      };
    }
    case SET_MSTR_DATA:
    case SET_OBJECT_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case ON_POPUP_BACK: {
      return {
        ...state,
        popupType: PopupTypeEnum.libraryWindow,
      };
    }
    case CLEAR_POPUP_STATE: {
      return initialState;
    }
    case SET_IS_DATA_OVERVIEW_OPEN: {
      return {
        ...state,
        isDataOverviewOpen: action.payload,
      };
    }
    case SET_FILTERED_PAGE_BY_LINK_ID: {
      return {
        ...state,
        filteredPageByLinkId: action.payload,
      };
    }

    default:
      return state;
  }
};
