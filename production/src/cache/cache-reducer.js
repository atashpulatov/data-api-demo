import { SET_OBJECT_LIST_LOADING, SET_MY_LIBRARY_LOADING } from './cache-actions';

const cacheReducer = (state = {
  isLoading: {
    objectList: false,
    myLibrary: false,
  },
}, action) => {
  switch (action.type) {
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
