import {
  SELECT_FOLDER, SELECT_OBJECT, SET_DATA_SOURCE, START_IMPORT, UPDATE_SCROLL, UPDATE_SIZE,
  CHANGE_SEARCHING, CHANGE_SORTING, REQUEST_IMPORT, CANCEL_REQUEST_IMPORT, PROMPTS_ANSWERED,
  REQUEST_DOSSIER_OPEN, CHANGE_IS_PROMPTED, SWITCH_MY_LIBRARY, CHANGE_FILTER
} from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import {
  navigationTree, initialState, DEFAULT_TYPE, DEFAULT_PROJECT_NAME,
} from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { CLEAR_WINDOW } from '../../redux-reducer/popup-reducer/popup-actions';
import { CREATE_CACHE, CLEAR_CACHE, REFRESH_CACHE } from '../../redux-reducer/cache-reducer/cache-actions';

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
        chosenType: 'Data',
        chosenChapterKey: null,
        objectType: undefined,
        chosenVisualizationKey: null,
        preparedInstanceId: null,
        chosenLibraryDossier: null,
        requestPerformed: false,
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
        chosenType: 'Data',
        chosenChapterKey: null,
        objectType: undefined,
        chosenVisualizationKey: null,
        preparedInstanceId: null,
        chosenLibraryDossier: null,
        requestPerformed: false,
      },
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState.chosenEnvElement).toEqual(action.data);
    expect(newState.chosenObjectId).toEqual(action.data.chosenObjectId);
  });

  it('should return new proper state in case of SELECT_OBJECT action with datasource', () => {
    // given
    const action = {
      type: SELECT_OBJECT,
      data: {
        chosenObjectId: '1',
        chosenProjectId: '2',
        chosenSubtype: '3',
        chosenObjectName: 'name',
      },
    };

    // when
    const newState = navigationTree({ dataSource: [{ projectId: '2', key: '1', name: 'name' }] }, action);

    // then
    expect(newState.chosenObjectName).toEqual('name');
  });

  it('should return new proper state in case of SELECT_OBJECT action with datasource wrong', () => {
    // given
    const action = {
      type: SELECT_OBJECT,
      data: {
        chosenObjectId: '1',
        chosenProjectId: '2',
        chosenSubtype: '3',
      },
    };

    // when
    const newState = navigationTree({ dataSource: [{}] }, action);

    // then
    expect(newState.chosenObjectName).toEqual('Prepare Data');
    expect(newState.chosenType).toEqual('Data');
  });

  it('should return new chosen state in case of SELECT_OBJECT action with proper datasource', () => {
    // given
    const action = {
      type: SELECT_OBJECT,
      data: {
        chosenObjectId: '1',
        chosenProjectId: '2',
        chosenSubtype: 768,
      },
    };

    // when
    const newState = navigationTree({ dataSource: [{}] }, action);

    // then
    expect(newState.chosenType.name).toEqual('report');
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
      chosenType: 'Data',
      chosenChapterKey: null,
      objectType: undefined,
      chosenVisualizationKey: null,
      preparedInstanceId: null,
      chosenLibraryDossier: null,
      requestPerformed: false,
      chosenEnvElement: action.data
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
    expect(newState.chosenObjectId).toEqual(null);
    expect(newState.chosenProjectId).toEqual(null);
    expect(newState.chosenSubtype).toEqual(null);
    expect(newState.scrollPosition).toEqual(null);
    expect(newState.pageSize).toEqual(null);
    expect(newState.chosenObjectName).toEqual(DEFAULT_PROJECT_NAME);
    expect(newState.chosenType).toEqual(DEFAULT_TYPE);
  });

  it('should return old state in case of SELECT_FOLDER action and the same selected folder', () => {
    // given
    const oldState = { folder: 'mock' };
    const action = {
      type: SELECT_FOLDER,
      data: 'mock',
    };

    // when
    const newState = navigationTree(oldState, action);

    // then
    expect(newState).toEqual(oldState);
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

  // TODO: once we have workflow with report instance id this may be needed
  // it('should set request import flag and instance on REQUEST_IMPORT action', () => {
  //   // given
  //   const action = {
  //     type: REQUEST_IMPORT,
  //     data: { instanceId: 'instance', },
  //   };

  //   // when
  //   const newState = navigationTree({}, action);

  //   // then
  //   expect(newState.importRequested).toBe(true);
  //   expect(newState.instanceId).toBe(action.data.instanceId);
  // });

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

  it('should return new proper state in case of START_IMPORT action', () => {
    // given
    const action = { type: START_IMPORT, };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState.loading).toBeTruthy();
    expect(newState.importRequested).toBe(false);
  });

  it('should return new proper state in case of CLEAR_WINDOW action', () => {
    // given
    const action = { type: CLEAR_WINDOW, };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState).toEqual(initialState);
  });

  it('should return new proper state in case of CANCEL_REQUEST_IMPORT action', () => {
    // given
    const action = { type: CANCEL_REQUEST_IMPORT, };

    // when
    const newState = navigationTree({ importRequested: true }, action);

    // then
    expect(newState.importRequested).toBeFalsy();
  });

  // it('should return new proper state in case of CHANGE_SORTING action', () => {
  //   // given
  //   const action = {
  //     type: CHANGE_SORTING,
  //     data: 'mock',
  //   };

  //   // when
  //   const newState = navigationTree({}, action);

  //   // then
  //   expect(newState.sorter).toEqual(action.data);
  // });

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

  it('should return new proper state in case of UPDATE_SIZE action', () => {
    // given
    const action = {
      type: UPDATE_SIZE,
      data: 'mock',
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState.pageSize).toEqual(action.data);
  });

  it('should return new proper state in case of UPDATE_SCROLL action', () => {
    // given
    const action = {
      type: UPDATE_SCROLL,
      data: 'mock',
    };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState.scrollPosition).toEqual(action.data);
  });

  it('should return new proper state in case of REQUEST_DOSSIER_OPEN action', () => {
    // given
    const action = { type: REQUEST_DOSSIER_OPEN, };

    // when
    const newState = navigationTree({}, action);

    // then
    expect(newState.dossierOpenRequested).toEqual(true);
  });


  it('should return new proper state in case of CREATE_CACHE action', () => {
    // given
    const action = { type: CREATE_CACHE, };

    // when
    const newState = navigationTree({}, action);

    // then
    // expect(newState.sorter).toEqual({});
    expect(newState.chosenObjectId).toEqual(null);
    expect(newState.chosenProjectId).toEqual(null);
    expect(newState.chosenSubtype).toEqual(null);
    expect(newState.chosenObjectName).toEqual('Prepare Data');
    expect(newState.chosenType).toEqual('Data');
  });

  it('should return new proper state in case of CLEAR_CACHE action', () => {
    // given
    const action = { type: CLEAR_CACHE, };

    // when
    const newState = navigationTree({}, action);

    // then
    // expect(newState.sorter).toEqual({});
    expect(newState.chosenObjectId).toEqual(null);
    expect(newState.chosenProjectId).toEqual(null);
    expect(newState.chosenSubtype).toEqual(null);
    expect(newState.chosenObjectName).toEqual('Prepare Data');
    expect(newState.chosenType).toEqual('Data');
  });

  it('should return new proper state in case of REFRESH_CACHE action', () => {
    // given
    const action = { type: REFRESH_CACHE, data: true };

    // when
    const newState = navigationTree({}, action);

    // then
    // expect(newState.sorter).toEqual({});
    expect(newState.chosenObjectId).toEqual(null);
    expect(newState.chosenProjectId).toEqual(null);
    expect(newState.chosenSubtype).toEqual(null);
    expect(newState.chosenObjectName).toEqual('Prepare Data');
    expect(newState.chosenType).toEqual('Data');
  });

  it('should not return new proper state in case of REFRESH_CACHE action', () => {
    // given
    const action = { type: REFRESH_CACHE, };

    // when
    const newState = navigationTree({}, action);

    // then
    // expect(newState.sorter).not.toEqual({});
    expect(newState.chosenObjectId).not.toEqual(null);
    expect(newState.chosenProjectId).not.toEqual(null);
    expect(newState.chosenSubtype).not.toEqual(null);
    expect(newState.chosenObjectName).not.toEqual('Prepare Data');
    expect(newState.chosenType).not.toEqual('Data');
  });

  it('should return new proper state in case of CHANGE_IS_PROMPTED action', () => {
    // given
    const action = { type: CHANGE_IS_PROMPTED, data: true };
    // when
    const newState = navigationTree({}, action);
    // then
    expect(newState.isPrompted).toEqual(true);
  });

  it('should return new proper state in case of SWITCH_MY_LIBRARY action - from false to true', () => {
    // given
    const action = { type: SWITCH_MY_LIBRARY };
    // when
    const newState = navigationTree({
      myLibrary: false,
      chosenLibraryElement: { chosenObjectId: '1' }
    }, action);
    // then
    expect(newState.myLibrary).toEqual(true);
    expect(newState.chosenObjectId).toEqual('1');
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
});
