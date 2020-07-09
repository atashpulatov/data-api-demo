import * as actions from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';

describe('NavigationTree Actions', () => {
  it('should dispatch proper selectObject action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.selectObject(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.SELECT_OBJECT, data: true });
  });

  it('should dispatch proper cancelImportRequest action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.cancelImportRequest()(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.CANCEL_REQUEST_IMPORT });
  });

  it('should dispatch proper startImport action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.startImport(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.START_IMPORT });
  });
  it('should dispatch proper startLoading action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.startLoading(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.startLoading });
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
    actions.changeSearching(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.CHANGE_SEARCHING, data: true });
  });

  it('should dispatch proper requestImport action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.requestImport()(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.REQUEST_IMPORT });
  });

  it('should dispatch proper promptsAnswered action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';

    // when
    actions.promptsAnswered(data)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.PROMPTS_ANSWERED, data });
  });

  it('should dispatch proper requestDossierOpen action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.requestDossierOpen()(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.REQUEST_DOSSIER_OPEN });
  });

  it('should dispatch proper stopLoading action', () => {
    // given
    const listener = jest.fn();
    // when
    actions.stopLoading()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.stopLoading });
  });

  it('should dispatch proper switchMyLibrary action', () => {
    // given
    const listener = jest.fn();
    // when
    actions.switchMyLibrary()(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.SWITCH_MY_LIBRARY });
  });

  it('should dispatch proper changeFilter action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';
    // when
    actions.changeFilter(data)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: actions.CHANGE_FILTER, data });
  });
});
