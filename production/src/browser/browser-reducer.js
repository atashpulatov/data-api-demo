import { ON_MY_LIBRARY_CHANGED_CONST, ON_FILTER_CHANGED_CONST, ON_SORT_CHANGE_CONST, ON_SELECT_CONST } from './browser-actions';
import {officeStoreService} from '../office/store/office-store-service';

const updateState = (state, action) => {
  switch (action.type) {
  case ON_MY_LIBRARY_CHANGED_CONST:
    return {
      ...state,
      myLibrary: action.myLibrary,
    };
  case ON_FILTER_CHANGED_CONST:
    return {
      ...state,
      filter: action.filter,
    };
  case ON_SORT_CHANGE_CONST:
    return {
      ...state,
      sort: action.sort,
    };
  case ON_SELECT_CONST:
    return {
      ...state,
      selected: action.selected,
    };
  default:
    break;
  }
  return state;
};

/**
 * Creates new state, saves the state to office settings and then returns it.
 */
export const browserReducer = (state = { myLibrary: true }, action) => {
  const updatedState = updateState(state, action);
  officeStoreService.preserveBrowsingFilters(updatedState);
  return updatedState;
};

export default browserReducer;
