import { filterActions, CHANGE_SEARCHING, SWITCH_MY_LIBRARY, CHANGE_FILTER, CHANGE_SORTING, LOAD_BROWSING_STATE_CONST, CLEAR_FILTER, SAVE_MY_LIBRARY_OWNERS } from '../../../redux-reducer/filter-reducer/filter-actions';

describe('filterActions', () => {
  it('should dispatch proper changeSorting action', () => {
    // given
    const listener = jest.fn();
    // when
    filterActions.changeSorting(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CHANGE_SORTING, data: true });
  });

  it('should dispatch proper changeSearching action', () => {
    // given
    const listener = jest.fn();
    // when
    filterActions.changeSearching(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CHANGE_SEARCHING, data: true });
  });

  it('should dispatch proper switchMyLibrary action', () => {
    // given
    const listener = jest.fn();
    // when
    filterActions.switchMyLibrary()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SWITCH_MY_LIBRARY });
  });

  it('should dispatch proper changeFilter action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    filterActions.changeFilter(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CHANGE_FILTER, data });
  });

  it('should dispatch proper loadBrowsingState action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    filterActions.loadBrowsingState(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: LOAD_BROWSING_STATE_CONST, data });
  });

  it('should dispatch proper clearFilter action', () => {
    // given
    const listener = jest.fn();
    // when
    filterActions.clearFilter()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CLEAR_FILTER });
  });

  it('should dispatch proper saveMyLibraryOwners action', () => {
    // given
    const listener = jest.fn();
    const objects = [{ ownerId: '123' }, { ownerId: '456' }, { ownerId: '789' }];
    const expectedData = ['123', '456', '789'];
    // when
    filterActions.saveMyLibraryOwners(objects)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SAVE_MY_LIBRARY_OWNERS, data: expectedData });
  });
});
