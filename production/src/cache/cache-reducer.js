import { SET_OBJECT_LIST_LOADING, SET_MY_LIBRARY_LOADING } from './cache-actions';

export const DEFAULT_STATE = {
  isLoading: {
    objectList: false,
    myLibrary: false,
  },
};

const cacheReducer = (state = DEFAULT_STATE, action) => {
  switch (action && action.type) {
    case SET_OBJECT_LIST_LOADING:
      return {
        ...state,
        isLoading: { ...state.isLoading, objectList: action.isLoading },
      };
    case SET_MY_LIBRARY_LOADING:
      return {
        ...state,
        isLoading: { ...state.isLoading, myLibrary: action.isLoading },
      };
    default:
      return state;
  }
};

export default cacheReducer;
