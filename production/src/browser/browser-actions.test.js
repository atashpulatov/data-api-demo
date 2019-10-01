import {
  browserActions,
  ON_MY_LIBRARY_CHANGED_CONST,
  ON_FILTER_CHANGED_CONST,
  ON_SORT_CHANGE_CONST,
  ON_SELECT_CONST,
} from './browser-actions';

describe('Browser actions', () => {
  it('should dispatch proper setMyLibrary action', () => {
    // given
    const myLibraryFilter = 'myLibraryFilter';
    const listener = jest.fn();
    // when
    browserActions.onMyLibraryChange(myLibraryFilter)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: ON_MY_LIBRARY_CHANGED_CONST, myLibrary: myLibraryFilter });
  });

  it('should dispatch proper setFilter action', () => {
    // given
    const filter = 'filter';
    const listener = jest.fn();
    // when
    browserActions.onFilterChange(filter)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: ON_FILTER_CHANGED_CONST, filter });
  });

  it('should dispatch proper setSort action', () => {
    // given
    const sort = 'sort';
    const listener = jest.fn();
    // when
    browserActions.onSortChange(sort)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: ON_SORT_CHANGE_CONST, sort });
  });

  it('should dispatch proper setSelected action', () => {
    // given
    const selected = 'selectedObject';
    const listener = jest.fn();
    // when
    browserActions.onSelect(selected)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: ON_SELECT_CONST, selected });
  });
});
