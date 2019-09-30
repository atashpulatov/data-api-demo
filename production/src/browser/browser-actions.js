export const SET_MY_LIBRARY_CONST = 'MY_LIBRARY_FILTER';
export const SET_FILTER_CONST = 'FILTER_OF_OBJECTS';
export const SET_SORT_CONST = 'SORT_OF_OBJECTS';
export const SET_SELECTED_CONST = 'SELECTED_OBJECT';

const setMyLibrary = (myLibrary) => (dispatch) => {
  dispatch({
    type: SET_MY_LIBRARY_CONST,
    myLibrary,
  });
};

const setFilter = (filter) => (dispatch) => {
  dispatch({
    type: SET_FILTER_CONST,
    filter,
  });
};

const setSort = (sort) => (dispatch) => {
  dispatch({
    type: SET_SORT_CONST,
    sort,
  });
};

const setSelected = (selected) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_CONST,
    selected,
  });
};

export const browserActions = {
  setMyLibrary,
  setFilter,
  setSort,
  setSelected,
};

export default {};
