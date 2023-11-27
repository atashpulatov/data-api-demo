import {
  SET_POPUP_TYPE, SET_MSTR_DATA, SET_OBJECT_DATA, ON_POPUP_BACK, CLEAR_POPUP_STATE,
} from './popup-state-actions';
import { PopupTypeEnum } from '../../home/popup-type-enum';

export const initialState = {};

export const popupStateReducer = (state = initialState, action) => {
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

    default:
      return state;
  }
};
