import {
  START_REPORT_LOADING,
  STOP_REPORT_LOADING,
  RESET_STATE,
  SET_REPORT_N_FILTERS,
  SET_PREPARED_REPORT,
} from './popup-actions';
import { CLEAR_PROMPTS_ANSWERS, SWITCH_IMPORT_SUBTOTALS, UPDATE_DISPLAY_ATTR_FORM } from '../navigation-tree-reducer/navigation-tree-actions';

export const initialState = {};

export const popupReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case START_REPORT_LOADING: {
      return {
        ...state,
        refreshingReport: data.name,
      };
    }
    case STOP_REPORT_LOADING: {
      return {
        ...state,
        refreshingReport: undefined,
      };
    }
    case SET_REPORT_N_FILTERS: {
      return {
        ...state,
        editedObject: action.editedObject,
      };
    }
    case SET_PREPARED_REPORT: {
      const oldEditedObject = { ...state.editedObject };
      return {
        ...state,
        preparedInstance: action.instanceId,
        editedObject: {
          ...oldEditedObject,
          ...action.chosenObjectData,
        },
      };
    }
    case CLEAR_PROMPTS_ANSWERS: {
      return {
        ...state,
        preparedInstance: null,
        editedObject: null,
      };
    }
    case SWITCH_IMPORT_SUBTOTALS: {
      const editedObject = { ...state.editedObject };
      if (editedObject && editedObject.subtotalsInfo) {
        editedObject.subtotalsInfo.importSubtotal = data;
      }
      return {
        ...state,
        editedObject: !state.editedObject ? state.editedObject : editedObject
      };
    }
    case UPDATE_DISPLAY_ATTR_FORM: {
      if (state.editedObject) {
        const editedObject = { ...state.editedObject };
        if (editedObject.displayAttrFormNames) {
          editedObject.displayAttrFormNames = data;
        }
        return {
          ...state,
          editedObject
        };
      }
      return state;
    }
    case RESET_STATE: {
      return { ...initialState, };
    }
    default:
      return state;
  }
};
