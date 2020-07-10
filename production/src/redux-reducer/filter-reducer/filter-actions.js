export const CHANGE_SORTING = 'FILTER_CHANGE_SORTING';
export const CHANGE_SEARCHING = 'FILTER_CHANGE_SEARCHING';
export const SWITCH_MY_LIBRARY = 'FILTER_SWITCH_MY_LIBRARY';
export const CHANGE_FILTER = 'FILTER_CHANGE_FILTER';
export const LOAD_BROWSING_STATE_CONST = 'FILTER_LOAD_BROWSING_STATE_CONST';
export const CLEAR_FILTER = 'FILTER_CLEAR_FILTER';
export const SAVE_MY_LIBRARY_OWNERS = 'FILTER_SAVE_MY_LIBRARY_OWNERS';

function changeSorting(data) {
  return (dispatch) => dispatch({ type: CHANGE_SORTING, data });
}

function changeSearching(data) {
  return (dispatch) => dispatch({ type: CHANGE_SEARCHING, data });
}

function switchMyLibrary() {
  return (dispatch) => dispatch({ type: SWITCH_MY_LIBRARY });
}

function changeFilter(data) {
  return (dispatch) => dispatch({ type: CHANGE_FILTER, data });
}

function loadBrowsingState(data) {
  return (dispatch) => dispatch({ type: LOAD_BROWSING_STATE_CONST, data });
}

function clearFilter() {
  return (dispatch) => dispatch({ type: CLEAR_FILTER });
}

function saveMyLibraryOwners(objects) {
  return (dispatch) => dispatch({
    type: SAVE_MY_LIBRARY_OWNERS,
    data: objects.map(item => item.ownerId),
  });
}

export const filterActions = {
  changeSorting,
  changeSearching,
  switchMyLibrary,
  changeFilter,
  loadBrowsingState,
  clearFilter,
  saveMyLibraryOwners
};
