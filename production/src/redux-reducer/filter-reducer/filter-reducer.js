import {
  CHANGE_SORTING, CHANGE_SEARCHING, SWITCH_MY_LIBRARY, CHANGE_FILTER, LOAD_BROWSING_STATE_CONST,
  CLEAR_FILTER, SAVE_MY_LIBRARY_OWNERS
} from './filter-actions';
import { calculateNumberOfFiltersActive } from '../../helpers/numberOfFiltersActive';

export const initialState = {
  sorter: {},
  searchText: '',
  envFilter: {},
  myLibraryFilter: {},
  myLibrary: true,
  myLibraryOwners: {},
  numberOfFiltersActive: 0,
};

export const filterReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case SAVE_MY_LIBRARY_OWNERS: {
      const tempObject = {};
      const newState = { ...state };
      data.forEach(item => {
        tempObject[item] = true;
      });
      newState.myLibraryOwners = tempObject;
      return newState;
    }

    case CHANGE_SORTING: {
      const newState = { ...state };
      newState.sorter = data;
      return newState;
    }

    case CHANGE_SEARCHING: {
      const newState = { ...state };
      newState.searchText = data;
      return newState;
    }

    case SWITCH_MY_LIBRARY: {
      const newState = { ...state };
      newState.myLibrary = !state.myLibrary;
      return newState;
    }

    case CHANGE_FILTER: {
      const newState = { ...state };
      newState.envFilter = { ...data };
      newState.myLibraryFilter = { ...data };
      if (data.shouldClear) {
        newState.envFilter.shouldClear = false;
        newState.myLibraryFilter.shouldClear = false;
      } else if (newState.myLibrary) {
        newState.envFilter.owners = state.envFilter.owners
          ? [...state.envFilter.owners.filter(item => !newState.myLibraryOwners[item]), ...data.owners]
          : data.owners;
      } else {
        newState.myLibraryFilter.owners = data.owners.filter(item => newState.myLibraryOwners[item]);
      }
      newState.numberOfFiltersActive = calculateNumberOfFiltersActive(newState.envFilter, newState.myLibrary);
      return newState;
    }

    case LOAD_BROWSING_STATE_CONST: {
      const newState= {
        ...initialState,
        ...data,
      };
      newState.numberOfFiltersActive = calculateNumberOfFiltersActive(newState.envFilter, newState.myLibrary);
      return newState;
    }

    case CLEAR_FILTER: {
      const newState = { ...state };
      newState.envFilter = {};
      newState.myLibraryFilter = {};
      newState.myLibrary = true;
      return newState;
    }

    default: {
      return state;
    }
  }
};
