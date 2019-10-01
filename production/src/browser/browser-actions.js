export const ON_MY_LIBRARY_CHANGED_CONST = 'ON_MY_LIBRARY_CHANGED';
export const ON_FILTER_CHANGED_CONST = 'ON_FILTER_CHANGED';
export const ON_SORT_CHANGE_CONST = 'ON_SORT_CHANGE';
export const ON_SELECT_CONST = 'ON_SELECT';

const onMyLibraryChange = (myLibrary) => (dispatch) => {
  dispatch({
    type: ON_MY_LIBRARY_CHANGED_CONST,
    myLibrary,
  });
};

const onFilterChange = (filter) => (dispatch) => {
  dispatch({
    type: ON_FILTER_CHANGED_CONST,
    filter,
  });
};

const onSortChange = (sort) => (dispatch) => {
  dispatch({
    type: ON_SORT_CHANGE_CONST,
    sort,
  });
};

const onSelect = (selected) => (dispatch) => {
  dispatch({
    type: ON_SELECT_CONST,
    selected,
  });
};

export const browserActions = {
  onMyLibraryChange,
  onFilterChange,
  onSortChange,
  onSelect,
};

export default {};
