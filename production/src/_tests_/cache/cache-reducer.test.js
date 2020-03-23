import cacheReducer, { DEFAULT_STATE, REFRESH_STATE } from '../../cache/cache-reducer';
import {
  SET_OBJECT_LIST_LOADING,
  SET_MY_LIBRARY_LOADING,
  ADD_MY_LIBRARY_OBJECTS,
  ADD_ENV_OBJECTS,
  ADD_PROJECTS,
  CLEAR_CACHE,
  REFRESH_CACHE
} from '../../cache/cache-actions';

describe('Cache reducer', () => {
  it('should return default state', () => {
    // given
    const expectedState = DEFAULT_STATE;

    // when
    const state = cacheReducer();

    // then
    expect(state).toEqual(expectedState);
  });

  it('should change state when set my library loading action is received', () => {
    // given
    const isLoading = true;
    const expectedMyLibraryState = { ...DEFAULT_STATE.myLibrary, isLoading };
    const action = { type: SET_MY_LIBRARY_LOADING, data: isLoading };
    // when
    const state = cacheReducer(DEFAULT_STATE, action);

    // then
    expect(state.myLibrary).toEqual(expectedMyLibraryState);
  });

  it('should change state when set object loading action is received', () => {
    // given
    const isLoading = true;
    const expectedState = { ...DEFAULT_STATE.environmentLibrary, isLoading };
    const action = { type: SET_OBJECT_LIST_LOADING, data: isLoading };
    // when
    const state = cacheReducer(DEFAULT_STATE, action);

    // then
    expect(state.environmentLibrary).toEqual(expectedState);
  });

  it('should change state when append environment objects action is received', () => {
    // given
    const initObject = 'Default Test';
    const initState = {
      ...DEFAULT_STATE,
      environmentLibrary: {
        ...DEFAULT_STATE.environmentLibrary,
        objects: [initObject]
      }
    };
    const data = ['TestObject1', 'TestObject2'];
    const uuid = '55e30035-166b-4d01-8d82-bb2ef081d896';
    const action = { type: ADD_ENV_OBJECTS, data: { data, uuid } };
    // when
    const state = cacheReducer(initState, action);
    const expectedState = {
      ...DEFAULT_STATE,
      environmentLibrary: {
        ...DEFAULT_STATE.environmentLibrary,
        objects: [initObject, ...action.data.data]
      },
      uuidProcessed: [uuid]
    };
    // then
    expect(state).toEqual(expectedState);
  });

  it('should change state when replace environment objects action is received', () => {
    // given
    const initState = DEFAULT_STATE;
    const data = ['TestObject1', 'TestObject2'];
    const uuid = '55e30035-166b-4d01-8d82-bb2ef081d896';
    const action = { type: ADD_ENV_OBJECTS, data: { data, uuid } };
    // when
    const state = cacheReducer(initState, action);
    const expectedState = {
      ...DEFAULT_STATE,
      environmentLibrary: {
        ...DEFAULT_STATE.environmentLibrary,
        objects: [...action.data.data]
      },
      uuidProcessed: [uuid]
    };
    // then
    expect(state).toEqual(expectedState);
  });

  it('should change state when append myLibrary objects action is received', () => {
    // given
    const initObject = ['Default Test'];
    const initState = { ...DEFAULT_STATE, myLibrary: { ...DEFAULT_STATE.myLibrary, objects: [...initObject] } };
    const data = ['TestObject1', 'TestObject2'];
    const uuid = '55e30035-166b-4d01-8d82-bb2ef081d896';
    const action = { type: ADD_MY_LIBRARY_OBJECTS, data: { data, uuid } };
    // when
    const state = cacheReducer(initState, action);
    const expectedState = {
      ...DEFAULT_STATE,
      myLibrary: {
        ...DEFAULT_STATE.myLibrary,
        objects: [...initObject, ...action.data.data]
      },
      uuidProcessed: [uuid]
    };
    // then
    expect(state).toEqual(expectedState);
  });

  it('should change state when replace myLibrary objects action is received', () => {
    // given
    const initState = DEFAULT_STATE;
    const data = ['TestObject1', 'TestObject2'];
    const uuid = '55e30035-166b-4d01-8d82-bb2ef081d896';
    const action = { type: ADD_MY_LIBRARY_OBJECTS, data: { data, uuid } };
    // when
    const state = cacheReducer(initState, action);
    const expectedState = {
      ...DEFAULT_STATE,
      myLibrary: {
        ...DEFAULT_STATE.myLibrary,
        objects: [...action.data.data]
      },
      uuidProcessed: [uuid]
    };
    // then
    expect(state).toEqual(expectedState);
  });

  it('should change state when add projects action is received', () => {
    // given
    const objects = ['TestObject'];
    const expectedState = objects;
    const action = { type: ADD_PROJECTS, data: objects };
    // when
    const state = cacheReducer(DEFAULT_STATE, action);

    // then
    expect(state.projects).toEqual(expectedState);
  });

  it('should clear cache when clear action is received', () => {
    // given
    const initState = {
      myLibrary: {
        isLoading: true,
        objects: ['demo'],
      },
      projects: ['demo'],
      environmentLibrary: {
        isLoading: true,
        objects: ['demo'],
      },
    };
    const expectedState = DEFAULT_STATE;
    const action = { type: CLEAR_CACHE };
    // when
    const state = cacheReducer(initState, action);

    // then
    expect(state).toEqual(expectedState);
  });

  it('should refresh state when refresh cache action is received', () => {
    // given
    const initState = { DEFAULT_STATE };
    const expectedState = REFRESH_STATE;
    const action = { type: REFRESH_CACHE };
    // when
    const state = cacheReducer(initState, action);
    // then
    expect(state).toEqual(expectedState);
  });
});
