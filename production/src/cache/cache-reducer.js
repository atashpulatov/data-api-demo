import { SET_OBJECT_LIST_LOADING, SET_MY_LIBRARY_LOADING, ADD_MY_LIBRARY_OBJECTS, ADD_PROJECTS, ADD_ENV_OBJECTS, CLEAR_CACHE, REFRESH_CACHE, } from './cache-actions';

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

export const REFRESH_STATE = {
  myLibrary: {
    isLoading: false,
    objects: [],
  },
  projects: [],
  environmentLibrary: {
    isLoading: true,
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
      environmentLibrary: {
        ...state.environmentLibrary,
        objects: action.data.append ? [...state.environmentLibrary.objects, ...action.data.objects] : action.data.objects
      },
    };
  case ADD_MY_LIBRARY_OBJECTS:
    return {
      ...state,
      myLibrary: {
        ...state.myLibrary,
        objects: action.data.append ? [...state.myLibrary.objects, ...action.data.objects] : action.data.objects
      },
    };
  case ADD_PROJECTS:
    return {
      ...state,
      projects: action.data,
    };
  case CLEAR_CACHE:
    return DEFAULT_STATE;
  case REFRESH_CACHE:
    return REFRESH_STATE;
  default:
    return state;
  }
};

export default cacheReducer;
