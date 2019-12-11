import {
  SET_OBJECT_LIST_LOADING,
  SET_MY_LIBRARY_LOADING,
  ADD_MY_LIBRARY_OBJECTS,
  ADD_PROJECTS,
  ADD_ENV_OBJECTS,
  CLEAR_CACHE,
  REFRESH_CACHE,
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
  uuidProcessed:[]
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
  uuidProcessed:[]
};

/**
 * Checks if UUID from cache key was already added to state
 *
 * @param {*} uuid
 * @param {*} uuidArray
 */
function isUuidAlreadyProcessed(uuid, uuidArray) {
  return !!uuid && uuidArray.includes(uuid);
}

const cacheReducer = (state = DEFAULT_STATE, action) => {
  // const shouldSkip = isUuidAlreadyProcessed(action.data.uuid, state.uuidProcessed);


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
        objects: [...state.environmentLibrary.objects, ...action.data]
      },
    };
  case ADD_MY_LIBRARY_OBJECTS:
    return {
      ...state,
      myLibrary: {
        ...state.myLibrary,
        objects: [...state.myLibrary.objects, ...action.data],
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
