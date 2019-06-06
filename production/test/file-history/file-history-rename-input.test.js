import React from 'react';
import {shallow, mount} from 'enzyme';
import {_RenameInput} from '../../src/file-history/file-history-rename-input';
import {officeStoreService} from '../../src/office/store/office-store-service';
import {Popover} from 'antd';


describe('File history rename input', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render a div element with defined name', () => {
    // given
    const givenFileName = 'name';
    const bindingId = 'id123';
    // when
    const wrappedComponent = shallow(<_RenameInput fileName={givenFileName} bindingId={bindingId} />);

    // then
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.exists(`#rename-container-${bindingId}`)).toBeTruthy();
  });
  it('rename report should call officeStoreService.renameReport method when filename is given', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    const target = {value: givenFileName};
    const mockOfficeService = jest.spyOn(officeStoreService, 'preserveReportValue');
    // when
    const wrappedComponent = shallow(<_RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.instance().renameReport({target});
    // then
    expect(mockOfficeService).toHaveBeenCalled();
  });
  it('should update editable state on doubleclick', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    // when
    const wrappedComponent = shallow(<_RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.find('div').first().simulate('dblclick', {});
    // then
    expect(wrappedComponent.state().editable).toBeTruthy();
  });
  it('should show contextual menu on right click', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    // when
    const wrappedComponent = mount(<_RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.simulate('contextmenu', {});
    // then
    expect(wrappedComponent.exists('.ant-dropdown.ant-dropdown-hidden')).toBeFalsy();
  });
  it('should update value state when onChange is called', () => {
    // given
    const givenFileName = 'name';
    const newFileName = 'newName';
    const givenId = 'id123';
    const event = {target: {value: newFileName}};
    // when
    const wrappedComponent = shallow(<_RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.instance().handleChange(event);
    // then
    expect(wrappedComponent.state().value).toEqual(newFileName);
  });
  it('should update state on setEditable', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    // when
    const wrappedComponent = shallow(<_RenameInput fileName={givenFileName} bindingId={givenId} />);
    // then
    wrappedComponent.instance().setEditable(true);
    expect(wrappedComponent.state().editable).toEqual(true);
    wrappedComponent.instance().setEditable(false);
    expect(wrappedComponent.state().editable).toEqual(false);
  });
  it('should set editable and select text on enableEdit', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    const event = {domEvent: {stopPropagation: jest.fn()}};
    // when
    const wrappedComponent = shallow(<_RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.instance().enableEdit(event);
    // then
    expect(wrappedComponent.state().editable).toEqual(true);
  });
  it('should select text async', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    const mockDocument = jest.spyOn(document, 'getElementById').mockImplementation(() => {
      return {select: jest.fn()};
    });
    // when
    const wrappedComponent = shallow(<_RenameInput fileName={givenFileName} bindingId={givenId} />);
    wrappedComponent.instance().selectTextAsync();
    // then
    setTimeout(() => {
      expect(mockDocument).toHaveBeenCalled();
    }, 150);
  });
  it('should contain popover', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    // when
    const wrappedComponent = mount(<RenameInput fileName={givenFileName} bindingId={givenId} />);
    // then
    expect(wrappedComponent.find(Popover)).toHaveLength(1);
  });
  it('should render an input element on doubleclick', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    const wrappedComponent = shallow(<_RenameInput fileName={givenFileName} bindingId={givenId} />);
    // when
    wrappedComponent.find('div').first().simulate('dblclick', {});
    // then
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.exists(`#input-${givenId}`)).toBeTruthy();
  });
});
