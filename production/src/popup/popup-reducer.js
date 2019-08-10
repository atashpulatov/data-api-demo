import {
  START_REPORT_LOADING,
  STOP_REPORT_LOADING,
  RESET_STATE,
  SET_REPORT_N_FILTERS,
  SET_PREPARED_REPORT, CLEAR_WINDOW,
} from './popup-actions';
import {CLEAR_PROMPTS_ANSWERS} from '../navigation/navigation-tree-actions';

export const initialState = {
};

export const popupReducer = (state = initialState, action) => {
  const {type, data} = action;
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
        editedReport: action.editedReport,
      };
    }
    case SET_PREPARED_REPORT: {
      return {
        ...state,
        preparedInstance: action.instanceId,
        editedReport: action.reportData,
      };
    }
    case CLEAR_WINDOW:
    case CLEAR_PROMPTS_ANSWERS: {
      return {
        ...state,
        preparedInstance: null,
        editedReport: null,
      };
    }
    case RESET_STATE: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
