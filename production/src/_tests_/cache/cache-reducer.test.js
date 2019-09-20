import cacheReducer, { DEFAULT_STATE } from '../../cache/cache-reducer';
import { SET_OBJECT_LIST_LOADING, SET_MY_LIBRARY_LOADING } from '../../cache/cache-actions';

describe('Cache reducer', () => {
  it('should return default state', () => {
    // given
    const expectedState = DEFAULT_STATE;

    // when
    const state = cacheReducer();

    // then
    expect(state).toEqual(expectedState);
  });

  it('should change state when set object list loading action is received', () => {
    // given
    const objectListLoading = true;
    const expectedLoadingState = { ...DEFAULT_STATE.isLoading, objectList: objectListLoading };
    const action = { type: SET_OBJECT_LIST_LOADING, isLoading: objectListLoading };
    // when
    const state = cacheReducer(DEFAULT_STATE, action);

    // then
    expect(state.isLoading).toEqual(expectedLoadingState);
  });
  it('should change state when set my library loading action is received', () => {
    // given
    const myLibraryLoading = true;
    const expectedLoadingState = { ...DEFAULT_STATE.isLoading, myLibrary: myLibraryLoading };
    const action = { type: SET_MY_LIBRARY_LOADING, isLoading: myLibraryLoading };
    // when
    const state = cacheReducer(DEFAULT_STATE, action);

    // then
    expect(state.isLoading).toEqual(expectedLoadingState);
  });
});
