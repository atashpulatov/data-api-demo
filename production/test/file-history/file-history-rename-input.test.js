import React from 'react';
import {shallow} from 'enzyme';
// TODO: Below import
import {RenameInput, setValueAsync, selectTextAsync, renameReport} from '../../src/file-history/file-history-rename-input';
import {officeStoreService} from '../../src/office/store/office-store-service';


describe.skip('File history rename input', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render an input element with defined name', () => {
    // given
    const givenFileName = 'name';
    // when
    const wrappedComponent = shallow(<RenameInput fileName={givenFileName} />);

    // then
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.exists(`#input-${givenFileName}`)).toBeTruthy();
  });
  it('should set input value async', async () => {
    // given
    const givenText = 'name';
    const target = {};
    // when
    await setValueAsync(target, givenText);
    // then
    expect(target.value).toBe(givenText);
  });
  it('should select text async', async () => {
    // given
    const givenId = 'id123';
    const mockSelect = jest.fn();
    jest.spyOn(document, 'getElementById').mockImplementation(() => {
      return {select: mockSelect};
    });
    // when
    await selectTextAsync(givenId);
    // then
    expect(mockSelect).toHaveBeenCalled();
  });
  it('rename report should call officeStoreService.renameReport method when filename is given', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    const target = {value: givenFileName};
    const mockOfficeService = jest.spyOn(officeStoreService, 'renameReport');
    // when
    renameReport(givenId, givenFileName, target);
    // then
    expect(mockOfficeService).toHaveBeenCalled();
  });
  it('rename report should call setValueAsync when filename is empty', async () => {
    // given
    const defaultName = 'cola';
    const givenId = 'id123';
    const target = {value: ''};
    // when
    await renameReport(givenId, defaultName, target);
    // then
    expect(target.value).toBe(defaultName);
  });
  it.skip('hook should update editable state', async () => {
    // given
    const mockSetState = jest.fn();
    jest.mock('react', () => ({
      useState: (initial) => [initial, mockSetState],
    }));
    const givenFileName = 'cola';
    const givenId = 'id123';
    // when
    const wrappedComponent = shallow(<RenameInput fileName={givenFileName} bindingId={givenId} />);
    // TODO: How to test double click?
    wrappedComponent.simulate('dblclick');
    // then
    expect(mockSetState).toHaveBeenCalled();
  });
});
