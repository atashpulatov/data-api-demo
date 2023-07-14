import {
  SELECT_OBJECT, START_IMPORT, REQUEST_IMPORT, CANCEL_REQUEST_IMPORT, PROMPTS_ANSWERED,
  REQUEST_DOSSIER_OPEN, CLEAR_PROMPTS_ANSWERS, CANCEL_DOSSIER_OPEN, SWITCH_IMPORT_SUBTOTALS_ON_IMPORT,
  UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT
} from '../../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { navigationTree, initialState } from '../../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';

describe('NavigationTree Reducer', () => {
  it('should return new proper state in case of SELECT_OBJECT action for object from myLibrary', () => {
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
        chosenLibraryDossier: 'some dossier id',
      },
    };
    // when
    const newState = navigationTree({}, action);
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
});
