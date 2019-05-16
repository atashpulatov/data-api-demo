import {
  START_REPORT_LOADING,
  STOP_REPORT_LOADING,
  RESET_STATE,
} from './popup-actions';

export const initialState = {
  refreshingAll: null,
  refreshingReport: '',
  info: {},
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
    case RESET_STATE: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
