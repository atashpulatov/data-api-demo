import {
  SELECT_OBJECT, START_IMPORT,
  CHANGE_SEARCHING, REQUEST_IMPORT, CANCEL_REQUEST_IMPORT, PROMPTS_ANSWERED,
  REQUEST_DOSSIER_OPEN, SWITCH_MY_LIBRARY, CHANGE_FILTER, CHANGE_SORTING,
  CLEAR_PROMPTS_ANSWERS, CANCEL_DOSSIER_OPEN, SWITCH_IMPORT_SUBTOTALS_ON_IMPORT,
  UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT, LOAD_BROWSING_STATE_CONST,
  SAVE_MY_LIBRARY_OWNERS, CLEAR_SELECTION, CLEAR_FILTER
} from '../../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { navigationTree, initialState } from '../../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';

describe('NavigationTree Reducer', () => {
  it('should return new proper state in case of SELECT_OBJECT action for myLibrary', () => {
    // given
    const action = {
      type: SELECT_OBJECT,
      data: {
        chosenObjectId: '1',
        chosenProjectId: '2',
        chosenSubtype: '3',
        chosenObjectName: 'Prepare Data',
        chosenChapterKey: null,
        objectType: undefined,
        chosenVisualizationKey: null,
        preparedInstanceId: null,
        chosenLibraryDossier: null,
      },
    };
    // when
    const newState = navigationTree({ myLibrary: true }, action);
    // then
    expect(newState.chosenLibraryElement).toEqual(action.data);
    expect(newState.chosenObjectId).toEqual(action.data.chosenObjectId);
  });

  it('should return new proper state in case of SELECT_OBJECT action for non myLibrary', () => {
    // given
    const action = {
      type: SELECT_OBJECT,
      data: {
        chosenObjectId: '1',
        chosenProjectId: '2',
        chosenSubtype: '3',
        chosenObjectName: 'Prepare Data',
        chosenChapterKey: null,
        objectType: undefined,
        chosenVisualizationKey: null,
        preparedInstanceId: null,
        chosenLibraryDossier: null,
      },
    };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.chosenEnvElement).toEqual(action.data);
    expect(newState.chosenObjectId).toEqual(action.data.chosenObjectId);
  });

  it('should return new proper state in case of SELECT_OBJECT action without proper data', () => {
    // given
    const action = {
      type: SELECT_OBJECT,
      data: { chosenObjectId: 'something' },
    };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState).toEqual({
      chosenObjectId: 'something',
      chosenProjectId: null,
      chosenSubtype: null,
      chosenObjectName: 'Prepare Data',
      chosenChapterKey: null,
      objectType: undefined,
      chosenVisualizationKey: null,
      preparedInstanceId: null,
      chosenLibraryDossier: null,
      chosenEnvElement: action.data
    });
  });

  it('should return new proper state in case of SAVE_MY_LIBRARY_OWNERS action', () => {
    // given
    const action = {
      type: SAVE_MY_LIBRARY_OWNERS,
      data: ['123A', '456B', '789C'],
    };
    const state = {
      someOtherProperty: {}
    };
    const expectedMyLibraryOwners = {
      '123A': true,
      '456B': true,
      '789C': true,
    };
    // when
    const newState = navigationTree(state, action);
    // then
    expect(newState.myLibraryOwners).toEqual(expectedMyLibraryOwners);
    expect(newState.someOtherProperty).toEqual(state.someOtherProperty);
  });

  it('should set request import flag within state on REQUEST_IMPORT action', () => {
    // given
    const action = {
      type: REQUEST_IMPORT,
      data: {},
    };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.importRequested).toBe(true);
  });

  it('should set request import flag on REQUEST_IMPORT action', () => {
    // given
    const action = {
      type: REQUEST_IMPORT,
      data: { dossierData: 'whatever', },
    };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.importRequested).toBe(true);
    expect(newState.dossierData).not.toBeDefined();
  });

  it('should set dossier data on PROMPTS_ANSWERED action', () => {
    // given
    const action = {
      type: PROMPTS_ANSWERED,
      data: { dossierData: 'whatever', },
    };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.importRequested).toBeFalsy();
    expect(newState.dossierData).toBe(action.data.dossierData);
    expect(newState.isPrompted).toBeTruthy();
  });

  it('should return new proper state in case of CLEAR_PROMPTS_ANSWERS action', () => {
    // given
    const action = { type: CLEAR_PROMPTS_ANSWERS, };
    // when
    const newState = navigationTree({ promptsAnswers: ['some', 'some'], dossierData: {} }, action);
    // then
    expect(newState.promptsAnswers).toEqual(null);
    expect(newState.dossierData).toEqual(null);
  });

  it('should return new proper state in case of CANCEL_REQUEST_IMPORT action', () => {
    // given
    const action = { type: CANCEL_REQUEST_IMPORT, };
    // when
    const newState = navigationTree({ importRequested: true }, action);
    // then
    expect(newState.importRequested).toBeFalsy();
  });

  it('should return new proper state in case of START_IMPORT action', () => {
    // given
    const action = { type: START_IMPORT, };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.importRequested).toBe(false);
  });

  it('should return new proper state in case of CHANGE_SORTING action', () => {
    // given
    const action = {
      type: CHANGE_SORTING,
      data: 'mock',
    };
    // when
    const newState = navigationTree({}, action);
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
    const newState = navigationTree({}, action);
    // then
    expect(newState.searchText).toEqual(action.data);
  });

  it('should return new proper state in case of REQUEST_DOSSIER_OPEN action', () => {
    // given
    const action = { type: REQUEST_DOSSIER_OPEN, };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.dossierOpenRequested).toEqual(true);
  });

  it('should return new proper state in case of CANCEL_DOSSIER_OPEN action', () => {
    // given
    const action = { type: CANCEL_DOSSIER_OPEN, };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.dossierOpenRequested).toEqual(false);
  });

  it('should return new proper state in case of SWITCH_MY_LIBRARY action - from false to true', () => {
    // given
    const action = { type: SWITCH_MY_LIBRARY };
    // when
    const newState = navigationTree({
      myLibrary: false,
      myLibraryFilter: {},
      chosenLibraryElement: { chosenObjectId: '1' }
    }, action);
    // then
    expect(newState.myLibrary).toEqual(true);
    expect(newState.chosenObjectId).toEqual('1');
  });

  it('should return new proper state in case of SWITCH_IMPORT_SUBTOTALS_ON_IMPORT action', () => {
    // given
    const testData = { import: 'true' };
    const action = { type: SWITCH_IMPORT_SUBTOTALS_ON_IMPORT, data: testData };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.importSubtotal).toEqual(testData);
  });

  it('should return new proper state in case of UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT action', () => {
    // given
    const testData = { import: 'true' };
    const action = { type: UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT, data: testData };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.displayAttrFormNames).toEqual(testData);
  });

  it('should return new proper state in case of CHANGE_FILTER action - it should update myLibraryFilter', () => {
    // given
    const testData = { owners: ['test data'], shouldClear: false };
    const action = { type: CHANGE_FILTER, data: testData };
    // when
    const newState = navigationTree({ myLibrary: true, envFilter: { owners: [] } }, action);
    // then
    expect(newState.myLibraryFilter).toEqual(testData);
  });

  it('should return new proper state in case of CHANGE_FILTER action - it should update envFilter', () => {
    // given
    const testData = { owners: ['test data'], shouldClear: false };
    const action = { type: CHANGE_FILTER, data: testData };
    // when
    const newState = navigationTree({ myLibrary: false, myLibraryOwners: {} }, action);
    // then
    expect(newState.envFilter).toEqual(testData);
  });

  it('should return new proper state in case of CHANGE_FILTER action called with shouldClear flag set to true - it should update envFilter', () => {
    // given
    const testData = { owners: [], shouldClear: true };
    const action = { type: CHANGE_FILTER, data: testData };
    // when
    const newState = navigationTree({ myLibrary: false, myLibraryOwners: {} }, action);
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
    const newState = navigationTree({}, action);
    // then
    expect(newState.envFilter).toEqual({ test: 'test' });
    expect(newState.myLibraryFilter).toEqual({ });
  });

  it('should return new proper state in case of CLEAR_SELECTION action', () => {
    // given
    const action = { type: CLEAR_SELECTION };
    const state = {
      chosenObjectId: '123',
      chosenProjectId: '456',
      chosenSubtype: 12345,
      chosenObjectName: 'name',
      chosenEnvElement: { test: 'test' },
      dossierOpenRequested: true,
      chosenLibraryElement: { someValue: '' },
      chosenLibraryDossier: '123123',
    };
    // when
    const newState = navigationTree(state, action);
    // then
    expect(newState.chosenObjectId).toEqual(initialState.chosenObjectId);
    expect(newState.chosenProjectId).toEqual(initialState.chosenProjectId);
    expect(newState.chosenSubtype).toEqual(initialState.chosenSubtype);
    expect(newState.chosenObjectName).toEqual(initialState.chosenObjectName);
    expect(newState.chosenEnvElement).toEqual(initialState.chosenEnvElement);
    expect(newState.dossierOpenRequested).toEqual(initialState.dossierOpenRequested);
    expect(newState.chosenLibraryElement).toEqual(initialState.chosenLibraryElement);
    expect(newState.chosenLibraryDossier).toEqual(initialState.chosenLibraryDossier);
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
    const newState = navigationTree(state, action);
    // then
    expect(newState.envFilter).toEqual({});
    expect(newState.myLibraryFilter).toEqual({});
    expect(newState.myLibrary).toEqual(true);
    expect(newState.someOtherProperty).toEqual(state.someOtherProperty);
  });
});
