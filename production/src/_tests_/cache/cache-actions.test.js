import {
  SET_OBJECT_LIST_LOADING, objectListLoading, SET_MY_LIBRARY_LOADING, myLibraryLoading, createCache, clearCache,
} from '../../cache/cache-actions';

describe('Cache actions', () => {
  it('should return object list loading dispatch action', () => {
    // given
    const isLoading = true;
    const expectedAction = {
      type: SET_OBJECT_LIST_LOADING,
      isLoading,
    };

    // when
    const action = objectListLoading(isLoading);

    // then
    expect(action).toEqual(expectedAction);
  });

  it('should return my library loading dispatch action', () => {
    // given
    const isLoading = true;
    const expectedAction = {
      type: SET_MY_LIBRARY_LOADING,
      isLoading,
    };

    // when
    const action = myLibraryLoading(isLoading);

    // then
    expect(action).toEqual(expectedAction);
  });

  it('should return create cache high order function', () => {
    // given

    // when
    const hof = createCache();

    // then
    expect(hof).toBeInstanceOf(Function);
  });

  it('should return clear cache high order function', () => {
    // given

    // when
    const hof = clearCache();

    // then
    expect(hof).toBeInstanceOf(Function);
  });
});
