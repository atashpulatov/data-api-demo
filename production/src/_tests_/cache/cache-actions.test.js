import { SET_OBJECT_LIST_LOADING, objectListLoading, SET_MY_LIBRARY_LOADING, myLibraryLoading, createCache, clearCache, ADD_MY_LIBRARY_OBJECTS, addMyLibraryObjects, ADD_ENV_OBJECTS, addEnvObjects, connectToCache, refreshCache, ADD_PROJECTS, addProjects, CLEAR_CACHE, clearStateCache, refreshCacheAction, REFRESH_CACHE, refreshCacheState, fetchObjectsFallback, initCache, resetLoading, } from '../../cache/cache-actions';

describe('Cache actions', () => {
  it('should return object list loading dispatch action', () => {
    // given
    const isLoading = true;
    const expectedAction = {
      type: SET_OBJECT_LIST_LOADING,
      data: isLoading,
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
      data: isLoading,
    };

    // when
    const action = myLibraryLoading(isLoading);

    // then
    expect(action).toEqual(expectedAction);
  });

  it('should return add myLibrary objects dispatch action with default append===false', () => {
    // given
    const testResult = ['test'];
    const expectedAction = {
      type: ADD_MY_LIBRARY_OBJECTS,
      data: { objects: testResult, append: false },
    };
    // when
    const action = addMyLibraryObjects(testResult);
    // then
    expect(action).toEqual(expectedAction);
  });

  it('should return add myLibrary objects dispatch action with append===true', () => {
    // given
    const testResult = ['test'];
    const expectedAction = {
      type: ADD_MY_LIBRARY_OBJECTS,
      data: { objects: testResult, append: true },
    };
    // when
    const action = addMyLibraryObjects(testResult, true);
    // then
    expect(action).toEqual(expectedAction);
  });

  it('should return add environment objects dispatch action', () => {
    // given
    const testResult = ['test'];
    const expectedAction = {
      type: ADD_ENV_OBJECTS,
      data: {
        append: false,
        objects: testResult
      }
    };

    // when
    const action = addEnvObjects(testResult);

    // then
    expect(action).toEqual(expectedAction);
  });

  it('should return add environment projects dispatch action', () => {
    // given
    const testResult = ['test'];
    const expectedAction = {
      type: ADD_PROJECTS,
      data: testResult
    };

    // when
    const action = addProjects(testResult);

    // then
    expect(action).toEqual(expectedAction);
  });

  it('should dispatch clear and refresh cache actions', () => {
    // given
    const expectedClearAction = { type: CLEAR_CACHE, };
    const expectedRefreshAction = { type: REFRESH_CACHE, };
    const expectedRefreshActionWithUpdate = { type: REFRESH_CACHE, data: true };

    // when
    const clearAction = clearStateCache();
    const refreshAction = refreshCacheAction();
    const refreshActionWithUpdate = refreshCacheAction(true);

    // then
    expect(clearAction).toEqual(expectedClearAction);
    expect(refreshAction).toEqual(expectedRefreshAction);
    expect(refreshActionWithUpdate).toEqual(expectedRefreshActionWithUpdate);
  });

  it('should return create cache higher order function', () => {
    // given

    // when
    const hof = createCache();

    // then
    expect(hof).toBeInstanceOf(Function);
  });

  it('should return refresh cache higher order function', () => {
    // given

    // when
    const hof = refreshCacheState();

    // then
    expect(hof).toBeInstanceOf(Function);
  });

  it('should return fetchObjects fallback higher order function', () => {
    // given

    // when
    const hof = fetchObjectsFallback();

    // then
    expect(hof).toBeInstanceOf(Function);
  });

  it('should return connect to cache higher order function', () => {
    // given

    // when
    const hof = connectToCache();

    // then
    expect(hof).toBeInstanceOf(Function);
  });

  it('should return clear cache higher order function', () => {
    // given

    // when
    const hof = clearCache();

    // then
    expect(hof).toBeInstanceOf(Function);
  });

  it('should initialize cache', async () => {
    // given
    const putMock = jest.fn().mockImplementation((string) => string);
    const cacheMock = { putData: putMock };
    const expectedResult = ['projects', 'loading-my-library', 'my-library', 'loading-env-library', 'env-library'];
    // when
    const result = await initCache(cacheMock);

    // then
    expect(result).toEqual(expectedResult);
  });

  it('should reset cache loading properly', async () => {
    // given
    const putMock = jest.fn().mockImplementation((string) => string);
    const cacheMock = { putData: putMock };
    const expectedResult = ['loading-my-library', 'loading-env-library'];
    // when
    const result = await resetLoading(cacheMock);

    // then
    expect(result).toEqual(expectedResult);
  });
});
