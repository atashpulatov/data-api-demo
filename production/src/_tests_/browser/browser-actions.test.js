import {
  browserActions,
  ON_MY_LIBRARY_CHANGED_CONST,
  ON_FILTER_CHANGED_CONST,
  ON_SORT_CHANGE_CONST,
  ON_SELECT_CONST,
  LOAD_BROWSING_STATE_CONST,
} from '../../browser/browser-actions';

describe('Browser actions', () => {
  it('should dispatch proper onMyLibraryChange action', () => {
    // given
    const myLibraryFilter = 'myLibraryFilter';
    const listener = jest.fn();
    // when
    browserActions.onMyLibraryChange(myLibraryFilter)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: ON_MY_LIBRARY_CHANGED_CONST, myLibrary: myLibraryFilter });
  });

  it('should dispatch proper onFilterChange action', () => {
    // given
    const filter = 'filter';
    const listener = jest.fn();
    // when
    browserActions.onFilterChange(filter)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: ON_FILTER_CHANGED_CONST, filter });
  });

  it('should dispatch proper onSortChange action', () => {
    // given
    const sort = 'sort';
    const listener = jest.fn();
    // when
    browserActions.onSortChange(sort)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: ON_SORT_CHANGE_CONST, sort });
  });

  it('should dispatch proper onSelect action', () => {
    // given
    const selected = 'selectedObject';
    const listener = jest.fn();
    // when
    browserActions.onSelect(selected)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: ON_SELECT_CONST, selected });
  });

  it('should dispatch proper loadBrowsingState action', () => {
    // given
    const browsingState = 'browsingState';
    const listener = jest.fn();
    // when
    browserActions.loadBrowsingState(browsingState)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({
      type: LOAD_BROWSING_STATE_CONST,
      browsingState,
    });
  });
});
