import {
  CancelDossierOpenAction,
  CancelRequestImportAction,
  ClearPromptsAnswersAction,
  NavigationTreeActionTypes,
  NavigationTreeState,
  PromptsAnsweredAction,
  RequestDossierOpenAction,
  RequestImportAction,
  RequestPageByModalCloseAction,
  RequestPageByModalOpenAction,
  SelectObjectAction,
  SetPromptObjectsAction,
  StartImportAction,
  SwitchImportSubtotalsOnImportAction,
  UpdateDisplayAttrFormOnImportAction,
  UpdateSelectedMenuAction,
} from './navigation-tree-reducer-types';

import { navigationTree } from './navigation-tree-reducer';

describe('NavigationTree Reducer', () => {
  it('should return new proper state in case of SELECT_OBJECT action without proper data', () => {
    // given
    const action: SelectObjectAction = {
      type: NavigationTreeActionTypes.SELECT_OBJECT,
      data: { chosenObjectId: 'something' },
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState).toEqual({
      chosenObjectId: 'something',
      chosenProjectId: null,
      chosenSubtype: null,
      chosenObjectName: 'Prepare Data',
      chosenChapterKey: null,
      chosenVisualizationKey: null,
      preparedInstanceId: null,
      chosenLibraryDossier: null,
      isEdit: undefined,
      mstrObjectType: null,
    });
  });

  it('should set prompt objects data on SET_PROMPT_OBJECTS action', () => {
    // given
    const action: SetPromptObjectsAction = {
      type: NavigationTreeActionTypes.SET_PROMPT_OBJECTS,
      data: { promptObjects: ['whatever'] },
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.promptObjects).toBe(action.data.promptObjects);
  });

  it('should set request import flag within state on REQUEST_IMPORT action', () => {
    // given
    const action: RequestImportAction = {
      type: NavigationTreeActionTypes.REQUEST_IMPORT,
      data: {} as any,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.importRequested).toBe(true);
  });

  it('should set pageByModalOpenRequested flag within state on REQUEST_PAGE_BY_MODAL_OPEN action', () => {
    // given
    const action: RequestPageByModalOpenAction = {
      type: NavigationTreeActionTypes.REQUEST_PAGE_BY_MODAL_OPEN,
      data: {} as any,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.pageByModalOpenRequested).toBe(true);
  });

  it('should set pageByModalOpenRequested flag within state on REQUEST_PAGE_BY_MODAL_CLOSE action', () => {
    // given
    const action: RequestPageByModalCloseAction = {
      type: NavigationTreeActionTypes.REQUEST_PAGE_BY_MODAL_CLOSE,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.pageByModalOpenRequested).toBe(false);
  });

  it('should set request import flag on REQUEST_IMPORT action', () => {
    // given
    const action: RequestImportAction = {
      type: NavigationTreeActionTypes.REQUEST_IMPORT,
      data: { dossierData: 'whatever' } as any,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.importRequested).toBe(true);
    expect(newState.dossierData).not.toBeDefined();
  });

  it('should set dossier data on PROMPTS_ANSWERED action', () => {
    // given
    const action: PromptsAnsweredAction = {
      type: NavigationTreeActionTypes.PROMPTS_ANSWERED,
      data: { dossierData: 'whatever' } as any,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.importRequested).toBeFalsy();
    expect(newState.dossierData).toBe(action.data.dossierData);
    expect(newState.isPrompted).toBeTruthy();
  });

  it('should return new proper state in case of CLEAR_PROMPTS_ANSWERS action', () => {
    // given
    const action: ClearPromptsAnswersAction = {
      type: NavigationTreeActionTypes.CLEAR_PROMPTS_ANSWERS,
    };
    // when
    const newState = navigationTree(
      { promptsAnswers: ['some', 'some'], dossierData: {} } as NavigationTreeState,
      action
    );
    // then
    expect(newState.promptsAnswers).toEqual(null);
    expect(newState.dossierData).toEqual(null);
  });

  it('should return new proper state in case of CANCEL_REQUEST_IMPORT action', () => {
    // given
    const action: CancelRequestImportAction = {
      type: NavigationTreeActionTypes.CANCEL_REQUEST_IMPORT,
    };
    // when
    const newState = navigationTree({ importRequested: true } as any, action);
    // then
    expect(newState.importRequested).toBeFalsy();
  });

  it('should return new proper state in case of START_IMPORT action', () => {
    // given
    const action: StartImportAction = { type: NavigationTreeActionTypes.START_IMPORT };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.importRequested).toBe(false);
  });

  it('should return new proper state in case of REQUEST_DOSSIER_OPEN action', () => {
    // given
    const action: RequestDossierOpenAction = {
      type: NavigationTreeActionTypes.REQUEST_DOSSIER_OPEN,
      data: {} as any,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.dossierOpenRequested).toEqual(true);
  });

  it('should return new proper state in case of CANCEL_DOSSIER_OPEN action', () => {
    // given
    const action: CancelDossierOpenAction = { type: NavigationTreeActionTypes.CANCEL_DOSSIER_OPEN };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.dossierOpenRequested).toEqual(false);
  });

  it('should return new proper state in case of SWITCH_IMPORT_SUBTOTALS_ON_IMPORT action', () => {
    // given
    const testData = { import: 'true' };
    const action: SwitchImportSubtotalsOnImportAction = {
      type: NavigationTreeActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_IMPORT,
      data: testData,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.importSubtotal).toEqual(testData);
  });

  it('should return new proper state in case of UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT action', () => {
    // given
    const testData = { import: 'true' };
    const action: UpdateDisplayAttrFormOnImportAction = {
      type: NavigationTreeActionTypes.UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT,
      data: testData,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState.displayAttrFormNames).toEqual(testData);
  });

  it('should return new proper state in case of UPDATE_SELECTED_MENU action', () => {
    // given
    const testData = { name: 'selectedMenu' };
    const action: UpdateSelectedMenuAction = {
      type: NavigationTreeActionTypes.UPDATE_SELECTED_MENU,
      data: testData,
    };
    // when
    const newState = navigationTree({} as NavigationTreeState, action);
    // then
    expect(newState).toEqual({
      selectedMenu: { ...testData },
      chosenObjectId: null,
      chosenProjectId: null,
      chosenSubtype: null,
      chosenObjectName: 'Prepare Data',
      mstrObjectType: undefined,
      chosenChapterKey: null,
      chosenVisualizationKey: null,
      preparedInstanceId: null,
      isEdit: undefined,
      chosenLibraryDossier: null,
    });
  });
});
