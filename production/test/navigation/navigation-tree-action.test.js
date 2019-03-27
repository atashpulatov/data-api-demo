import * as actions from '../../src/navigation/navigation-tree-actions';
import {officeProperties} from '../../src/office/office-properties';

describe('NavigationTree Actions', () => {
  it('should dispatch proper selectObject action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.selectObject(listener)(true);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.SELECT_OBJECT, data: true});
  });

  it('should dispatch proper setDataSource action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.setDataSource(listener)(true);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.SET_DATA_SOURCE, data: true});
  });

  it('should dispatch proper selectFolder action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.selectFolder(listener)(true);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.SELECT_FOLDER, data: true});
  });

  it('should dispatch proper startImport action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.startImport(listener)(true);

    // then
    expect(listener).toHaveBeenCalledWith({type: actions.START_IMPORT});
  });
  it('should dispatch proper startLoading action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.startLoading(listener)(true);

    // then
    expect(listener).toHaveBeenCalledWith({type: officeProperties.actions.startLoading});
  });
});
