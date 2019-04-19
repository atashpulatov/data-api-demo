import * as actions from '../../src/navigation/navigation-tree-actions';
import {officeProperties} from '../../src/office/office-properties';

describe('NavigationTree Actions', () => {
  it('should dispatch proper selectObject action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.selectObject(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.SELECT_OBJECT, data: true});
  });

  it('should dispatch proper setDataSource action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.setDataSource(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.SET_DATA_SOURCE, data: true});
  });

  it('should dispatch proper selectFolder action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.selectFolder(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.SELECT_FOLDER, data: true});
  });

  it('should dispatch proper startImport action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.startImport(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.START_IMPORT});
  });
  it('should dispatch proper startLoading action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.startLoading(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: officeProperties.actions.startLoading});
  });
  it('should dispatch proper changeSorting action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.changeSorting(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.CHANGE_SORTING, data: true});
  });
  it('should dispatch proper changeSearching action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.changeSearching(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.CHANGE_SEARCHING, data: true});
  });
  it('should dispatch proper updateScroll action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.updateScroll(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.UPDATE_SCROLL, data: true});
  });
  it('should dispatch proper updateSize action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.updateSize(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.UPDATE_SIZE, data: true});
  });

  it('should dispatch proper requestImport action', () => {
    // given
    const listener = jest.fn();
    const data = 'whatever';

    // when
    actions.requestImport(data)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.REQUEST_IMPORT, data});
  });
});
