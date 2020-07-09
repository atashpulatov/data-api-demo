import { navigationTreeActions, SELECT_OBJECT, CANCEL_REQUEST_IMPORT, START_IMPORT, CHANGE_SEARCHING, REQUEST_IMPORT, PROMPTS_ANSWERED, REQUEST_DOSSIER_OPEN, SWITCH_MY_LIBRARY, CHANGE_FILTER, CHANGE_SORTING, CLEAR_SELECTION, LOAD_BROWSING_STATE_CONST, CLEAR_FILTER, SAVE_MY_LIBRARY_OWNERS, CANCEL_DOSSIER_OPEN, SWITCH_IMPORT_SUBTOTALS_ON_IMPORT, CLEAR_PROMPTS_ANSWERS, UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT } from '../../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';

describe('NavigationTree Actions', () => {
  it('should dispatch proper selectObject action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.selectObject(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SELECT_OBJECT, data: true });
  });

  it('should dispatch proper requestImport action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.requestImport()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: REQUEST_IMPORT });
  });

  it('should dispatch proper promptsAnswered action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    navigationTreeActions.promptsAnswered(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: PROMPTS_ANSWERED, data });
  });

  it('should dispatch proper cancelImportRequest action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.cancelImportRequest()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CANCEL_REQUEST_IMPORT });
  });

  it('should dispatch proper startImport action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.startImport(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: START_IMPORT });
  });

  it('should dispatch proper changeSorting action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.changeSorting(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CHANGE_SORTING, data: true });
  });

  it('should dispatch proper changeSearching action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.changeSearching(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CHANGE_SEARCHING, data: true });
  });

  it('should dispatch proper requestDossierOpen action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.requestDossierOpen()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: REQUEST_DOSSIER_OPEN });
  });

  it('should dispatch proper cancelDossierOpen action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    navigationTreeActions.cancelDossierOpen(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CANCEL_DOSSIER_OPEN, data });
  });

  it('should dispatch proper switchMyLibrary action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.switchMyLibrary()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SWITCH_MY_LIBRARY });
  });

  it('should dispatch proper switchImportSubtotalsOnImport action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    navigationTreeActions.switchImportSubtotalsOnImport(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SWITCH_IMPORT_SUBTOTALS_ON_IMPORT, data });
  });

  it('should dispatch proper clearPromptAnswers action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.clearPromptAnswers()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CLEAR_PROMPTS_ANSWERS });
  });

  it('should dispatch proper updateDisplayAttrFormOnImport action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    navigationTreeActions.updateDisplayAttrFormOnImport(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: UPDATE_DISPLAY_ATTR_FORM_ON_IMPORT, data });
  });

  it('should dispatch proper changeFilter action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    navigationTreeActions.changeFilter(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CHANGE_FILTER, data });
  });

  it('should dispatch proper clearSelection action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.clearSelection()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CLEAR_SELECTION });
  });

  it('should dispatch proper loadBrowsingState action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    navigationTreeActions.loadBrowsingState(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: LOAD_BROWSING_STATE_CONST, data });
  });

  it('should dispatch proper clearFilter action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.clearFilter()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: CLEAR_FILTER });
  });

  it('should dispatch proper saveMyLibraryOwners action', () => {
    // given
    const listener = jest.fn();
    const objects = [{ ownerId: '123' }, { ownerId: '456' }, { ownerId: '789' }];
    const expectedData = ['123', '456', '789'];
    // when
    navigationTreeActions.saveMyLibraryOwners(objects)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SAVE_MY_LIBRARY_OWNERS, data: expectedData });
  });
});
