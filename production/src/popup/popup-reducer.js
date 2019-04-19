import {
  START_REFRESHING_ALL_REPORTS,
  STOP_REFRESHING_ALL_REPORTS,
  START_REPORT_LOADING,
  STOP_REPORT_LOADING,
  RESET_STATE,
} from './popup-actions';

export const initialState = {
  refreshingAll: undefined,
  refreshingReport: '',
};

export const popupReducer = (state = initialState, action) => {
  const {type, data} = action;
  switch (type) {
    case START_REFRESHING_ALL_REPORTS: {
      return {
        ...state,
        refreshingAll: true,
      };
    }
    case STOP_REFRESHING_ALL_REPORTS: {
      return {
        ...state,
        refreshingAll: false,
      };
    }
    case START_REPORT_LOADING: {
      return {
        ...state,
        refreshingReport: data,
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
