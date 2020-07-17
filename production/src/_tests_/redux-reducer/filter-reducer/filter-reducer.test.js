import {
  CHANGE_SEARCHING, SWITCH_MY_LIBRARY, CHANGE_FILTER, CHANGE_SORTING, LOAD_BROWSING_STATE_CONST,
  SAVE_MY_LIBRARY_OWNERS, CLEAR_FILTER
} from '../../../redux-reducer/filter-reducer/filter-actions';
import { filterReducer } from '../../../redux-reducer/filter-reducer/filter-reducer';
import { NavigationTree } from '../../../navigation/navigation-tree';

describe('filterReducer', () => {
  it('should return new proper state in case of SAVE_MY_LIBRARY_OWNERS action', () => {
    // given
    const action = {
      type: SAVE_MY_LIBRARY_OWNERS,
      data: ['123A', '456B', '789C'],
    };
    const initialState = {
      someOtherProperty: {}
    };
    const expectedMyLibraryOwners = {
      '123A': true,
      '456B': true,
      '789C': true,
    };
    // when
    const newState = filterReducer(initialState, action);
    // then
    expect(newState.myLibraryOwners).toEqual(expectedMyLibraryOwners);
    expect(newState.someOtherProperty).toEqual(initialState.someOtherProperty);
  });

  it('should return new proper state in case of CHANGE_SORTING action', () => {
    // given
    const action = {
      type: CHANGE_SORTING,
      data: 'mock',
    };
    // when
    const newState = filterReducer({}, action);
    // then
    expect(newState.sorter).toEqual(action.data);
  });

  it('should return new proper state in case of CHANGE_SEARCHING action', () => {
    // given
    const action = {
      type: CHANGE_SEARCHING,
      data: 'mock',
    };
    // when
    const newState = filterReducer({}, action);
    // then
    expect(newState.searchText).toEqual(action.data);
  });

  it('should return new proper state in case of SWITCH_MY_LIBRARY action - from false to true', () => {
    // given
    const action = { type: SWITCH_MY_LIBRARY };
    // when
    const newState = filterReducer({
      myLibrary: false,
      myLibraryFilter: {},
      chosenLibraryElement: { chosenObjectId: '1' }
    }, action);
    // then
    expect(newState.myLibrary).toEqual(true);
  });

  it('should return new proper state in case of CHANGE_FILTER action - it should update myLibraryFilter', () => {
    // given
    const testData = { owners: ['test data'], shouldClear: false };
    const action = { type: CHANGE_FILTER, data: testData };
    // when
    const newState = filterReducer({ myLibrary: true, envFilter: { owners: [] } }, action);
    // then
    expect(newState.myLibraryFilter).toEqual(testData);
  });

  it('should return new proper state in case of CHANGE_FILTER action - it should update envFilter', () => {
    // given
    const testData = { owners: ['test data'], shouldClear: false };
    const action = { type: CHANGE_FILTER, data: testData };
    // when
    const newState = filterReducer({ myLibrary: false, myLibraryOwners: {} }, action);
    // then
    expect(newState.envFilter).toEqual(testData);
  });

  it('should return new proper state in case of CHANGE_FILTER action called with shouldClear flag set to true - it should update envFilter', () => {
    // given
    const testData = { owners: [], shouldClear: true };
    const action = { type: CHANGE_FILTER, data: testData };
    // when
    const newState = filterReducer({ myLibrary: false, myLibraryOwners: {} }, action);
    // then
    expect(newState.envFilter).toEqual({ ...testData, shouldClear: false });
  });

  it('should return new proper state in case of LOAD_BROWSING_STATE_CONST action', () => {
    // given
    const action = {
      type: LOAD_BROWSING_STATE_CONST,
      data: {
        envFilter: { test: 'test' },
        myLibraryFilter: {},
      },
    };
    // when
    const newState = filterReducer({}, action);
    // then
    expect(newState.envFilter).toEqual({ test: 'test' });
    expect(newState.myLibraryFilter).toEqual({ });
  });

  it('should return new proper state in case of CLEAR_FILTER action', () => {
    // given
    const action = { type: CLEAR_FILTER };
    const state = {
      envFilter: { test: 'test' },
      myLibraryFilter: {},
      myLibrary: false,
      someOtherProperty: {}
    };
    // when
    const newState = filterReducer(state, action);
    // then
    expect(newState.envFilter).toEqual({});
    expect(newState.myLibraryFilter).toEqual({});
    expect(newState.myLibrary).toEqual(true);
    expect(newState.someOtherProperty).toEqual(state.someOtherProperty);
  });
});
