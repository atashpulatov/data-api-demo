import React from 'react';
import {shallow} from 'enzyme';
// TODO: Below import
import RenameInput from '../../src/file-history/file-history-rename-input';
import {officeStoreService} from '../../src/office/store/office-store-service';


describe('File history rename input', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render an input element with defined name', () => {
    // given
    const givenFileName = 'name';
    const bindingId = 'id123';
    // when
    const wrappedComponent = shallow(<RenameInput fileName={givenFileName} bindingId={bindingId} />);

    // then
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.exists(`#input-${bindingId}`)).toBeTruthy();
  });
  it('rename report should call officeStoreService.renameReport method when filename is given', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    const target = {value: givenFileName};
    const mockOfficeService = jest.spyOn(officeStoreService, 'renameReport');
    // when
    const wrappedComponent = shallow(<RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.instance().renameReport({target});
    // then
    expect(mockOfficeService).toHaveBeenCalled();
  });
  it('should update editable state on doubleclick', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    // when
    const wrappedComponent = shallow(<RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.simulate('dblclick');
    // then
    expect(wrappedComponent.state().editable).toBeTruthy();
  });
  it('should update value state when onChange is called', () => {
    // given
    const givenFileName = 'name';
    const newFileName = 'newName';
    const givenId = 'id123';
    const event = {target: {value: newFileName}};
    // when
    const wrappedComponent = shallow(<RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.instance().handleChange(event);
    // then
    expect(wrappedComponent.state().value).toEqual(newFileName);
  });
  it('should update state on setEditable', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    // when
    const wrappedComponent = shallow(<RenameInput fileName={givenFileName} bindingId={givenId} />);
    // then
    wrappedComponent.instance().setEditable(true);
    expect(wrappedComponent.state().editable).toEqual(true);
    wrappedComponent.instance().setEditable(false);
    expect(wrappedComponent.state().editable).toEqual(false);
  });
  it('should select text async', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    const mockDocument = jest.spyOn(document, 'getElementById').mockImplementation(() => {
      return {select: jest.fn()};
    });
    // when
    const wrappedComponent = shallow(<RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.instance().selectTextAsync();
    // then
    setTimeout(() => {
      expect(mockDocument).toHaveBeenCalled();
    }, 150);
  });
});
