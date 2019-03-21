import * as actions from '../../src/navigation/navigation-tree-actions';

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
});
