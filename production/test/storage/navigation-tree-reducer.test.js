import {SELECT_FOLDER, SELECT_OBJECT, SET_DATA_SOURCE, START_IMPORT} from '../../src/navigation/navigation-tree-actions';
import {navigationTree, initialState} from '../../src/storage/navigation-tree-reducer';
import {CLEAR_WINDOW} from '../../src/popup/popup-actions';

describe('NavigationTree Reducer', () => {
  it('should return new proper state in case of SELECT_OBJECT action', () => {
    // given
    const action = {
      type: SELECT_OBJECT,
      data: {
        chosenObjectId: '1',
        chosenProjectId: '2',
        chosenSubtype: '3',
        chosenProjectName: 'Access_Transaction',
      },
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState).toEqual(action.data);
  });

  it('should return new proper state in case of SELECT_OBJECT action without proper data', () => {
    // given
    const action = {
      type: SELECT_OBJECT,
      data: {},
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState).toEqual({
      chosenObjectId: null,
      chosenProjectId: null,
      chosenSubtype: null,
      chosenProjectName: 'Access_Transaction',
    });
  });

  it('should return new proper state in case of SELECT_FOLDER action', () => {
    // given
    const action = {
      type: SELECT_FOLDER,
      data: 'mock',
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState.folder).toEqual(action.data);
  });

  it('should return new proper state in case of SET_DATA_SOURCE action', () => {
    // given
    const action = {
      type: SET_DATA_SOURCE,
      data: 'mock',
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState.dataSource).toEqual(action.data);
  });

  it('should return new proper state in case of START_IMPORT action', () => {
    // given
    const action = {
      type: START_IMPORT,
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState.loading).toBeTruthy();
  });

  it('should return new proper state in case of START_IMPORT action', () => {
    // given
    const action = {
      type: CLEAR_WINDOW,
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState).toEqual(initialState);
  });
});
