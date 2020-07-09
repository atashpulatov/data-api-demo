import { navigationTreeActions, SELECT_OBJECT, CANCEL_REQUEST_IMPORT, START_IMPORT, CHANGE_SEARCHING, REQUEST_IMPORT, PROMPTS_ANSWERED, REQUEST_DOSSIER_OPEN, SWITCH_MY_LIBRARY, CHANGE_FILTER } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';

describe('NavigationTree Actions', () => {
  it('should dispatch proper selectObject action', () => {
    // given
    const listener = jest.fn();

    // when
    navigationTreeActions.selectObject(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: SELECT_OBJECT, data: true });
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

  // it('should dispatch proper changeSorting action', () => {
  //   // given
  //   const listener = jest.fn();

  //   // when
  //   actions.changeSorting(true)(listener);

  //   // then
  //   expect(listener).toHaveBeenCalledWith({ type: actions.CHANGE_SORTING, data: true });
  // });
  it('should dispatch proper changeSearching action', () => {
    // given
    const listener = jest.fn();

    // when
    navigationTreeActions.changeSearching(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: CHANGE_SEARCHING, data: true });
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

  it('should dispatch proper requestDossierOpen action', () => {
    // given
    const listener = jest.fn();

    // when
    navigationTreeActions.requestDossierOpen()(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: REQUEST_DOSSIER_OPEN });
  });

  it('should dispatch proper switchMyLibrary action', () => {
    // given
    const listener = jest.fn();
    // when
    navigationTreeActions.switchMyLibrary()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SWITCH_MY_LIBRARY });
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
});
