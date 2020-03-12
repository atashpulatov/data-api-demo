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
  uuidProcessed: []
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
  uuidProcessed: []
};

/**
 * Checks if UUID from cache key was already added to state
 *
 * @param {Object} data which should be added to state
 * @param {Array} uuidArray of uuids which have already been added to state
 * @returns {boolean} representing whether given data has already been added to state
 */
function isUuidAlreadyProcessed(data, uuidArray) {
  return data && data.uuid && uuidArray.includes(data.uuid);
}

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
      if (isUuidAlreadyProcessed(action.data, state.uuidProcessed)) { return state; }
      return {
        ...state,
        environmentLibrary: {
          ...state.environmentLibrary,
          objects: [...state.environmentLibrary.objects, ...action.data.data]
        },
        uuidProcessed: [...state.uuidProcessed, action.data.uuid]
      };
    case ADD_MY_LIBRARY_OBJECTS:
      if (isUuidAlreadyProcessed(action.data, state.uuidProcessed)) { return state; }
      return {
        ...state,
        myLibrary: {
          ...state.myLibrary,
          objects: [...state.myLibrary.objects, ...action.data.data],
        },
        uuidProcessed: [...state.uuidProcessed, action.data.uuid]
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
