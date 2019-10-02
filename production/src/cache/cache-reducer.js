import {
  SET_OBJECT_LIST_LOADING, SET_MY_LIBRARY_LOADING, ADD_MY_LIBRARY_OBJECTS, ADD_PROJECTS, ADD_ENV_OBJECTS, CLEAR_CACHE,
} from './cache-actions';

export const DEFAULT_STATE = {
  myLibrary: {
    isLoading: false,
    objects: [],
  },
  projects: [],
  environmentLibrary: {
    isLoading: false,
    objects: [],
  },
};

const cacheReducer = (state = DEFAULT_STATE, action) => {
  switch (action && action.type) {
    case SET_MY_LIBRARY_LOADING:
      return {
        ...state,
        myLibrary: { ...state.myLibrary, isLoading: action.data },
      };
    case SET_OBJECT_LIST_LOADING:
      return {
        ...state,
        environmentLibrary: { ...state.environmentLibrary, isLoading: action.data },
      };
    case ADD_ENV_OBJECTS:
      return {
        ...state,
        environmentLibrary: { ...state.environmentLibrary, objects: action.data },
      };
    case ADD_MY_LIBRARY_OBJECTS:
      return {
        ...state,
        myLibrary: { ...state.environmentLibrary, objects: action.data },
      };
    case ADD_PROJECTS:
      return {
        ...state,
        projects: action.data,
      };
    case CLEAR_CACHE:
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export default cacheReducer;
