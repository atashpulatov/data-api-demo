import { SET_MY_LIBRARY_CONST, SET_FILTER_CONST, SET_SORT_CONST, SET_SELECTED_CONST } from './browser-actions';

export const browserReducer = (state = { myLibrary: true }, action) => {
  switch (action.type) {
    case SET_MY_LIBRARY_CONST:
      return {
        ...state,
        myLibrary: action.myLibrary,
      };
    case SET_FILTER_CONST:
      return {
        ...state,
        filter: action.filter,
      };
    case SET_SORT_CONST:
      return {
        ...state,
        sort: action.sort,
      };
    case SET_SELECTED_CONST:
      return {
        ...state,
        selected: action.selected,
      };
    default:
      break;
  }
  return state;
};

export default browserReducer;
