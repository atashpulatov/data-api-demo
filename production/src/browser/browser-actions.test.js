import { browserActions, SET_MY_LIBRARY_CONST, SET_FILTER_CONST, SET_SORT_CONST, SET_SELECTED_CONST } from './browser-actions';

describe('Browser actions', () => {
  it('should dispatch proper setMyLibrary action', () => {
    // given
    const myLibraryFilter = 'myLibraryFilter';
    const listener = jest.fn();
    // when
    browserActions.setMyLibrary(myLibraryFilter)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SET_MY_LIBRARY_CONST, myLibrary: myLibraryFilter });
  });

  it('should dispatch proper setFilter action', () => {
    // given
    const filter = 'filter';
    const listener = jest.fn();
    // when
    browserActions.setFilter(filter)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SET_FILTER_CONST, filter });
  });

  it('should dispatch proper setSort action', () => {
    // given
    const sort = 'sort';
    const listener = jest.fn();
    // when
    browserActions.setSort(sort)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SET_SORT_CONST, sort });
  });

  it('should dispatch proper setSelected action', () => {
    // given
    const selected = 'selectedObject';
    const listener = jest.fn();
    // when
    browserActions.setSelected(selected)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SET_SELECTED_CONST, selected });
  });
});
