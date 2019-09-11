import React from 'react';
import { mount } from 'enzyme';
import { Popover } from 'antd';
import { _OfficeLoadedFile } from '../../file-history/office-loaded-file';
import { reduxStore } from '../../store';
import { fileHistoryHelper } from '../../file-history/file-history-helper';
import { officeApiHelper } from '../../office/office-api-helper';
import { officeStoreService } from '../../office/store/office-store-service';

describe('office loaded file', () => {
  it('should display provided file name', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      fileName="test"
      refreshDate={new Date()}
      objectType={{ name: 'report' }}
    />);
    // then
    expect(wrappedComponent.find('div.file-history-container')).toBeTruthy();
    expect(wrappedComponent.html()).toContain('test');
  });
  it('should call componentWillUnmount provided file name', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      fileName="test"
      refreshDate={new Date()}
      objectType={{ name: 'report' }}
    />);
    wrappedComponent.instance().componentWillUnmount();
    // then
    expect(wrappedComponent.instance()._ismounted).toBeFalsy();
  });
  it('should display dataset type icon', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile objectType={{ name: 'dataset' }} refreshDate={new Date()} />);
    const wrappedCol = wrappedComponent.find('.object-title-row');
    const wrappedIcons = wrappedCol.find('MSTRIcon');
    // then
    expect(wrappedCol.at(0).contains(wrappedIcons.get(0))).toBe(true);
    expect(wrappedIcons.at(0).prop('type')).toBe('dataset');
  });

  it('should display report type icon', () => {
    // given

    // when
    const wrappedComponent = mount(<_OfficeLoadedFile objectType={{ name: 'report' }} refreshDate={new Date()} />);
    const wrappedCol = wrappedComponent.find('.object-title-row');
    const wrappedIcons = wrappedCol.find('MSTRIcon');
    // then
    expect(wrappedCol.at(0).contains(wrappedIcons.get(0))).toBe(true);
    expect(wrappedIcons.at(0).prop('type')).toBe('report');
  });

  it('should invoke select method on report name click', () => {
    // given
    const onClickMocked = jest.fn();
    const testBindingId = 'testBindingId';
    const testName = 'testName';
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      onClick={onClickMocked}
      fileName={testName}
      objectType={{ name: 'report' }}
    />);
    // when
    const mockDelete = jest.spyOn(wrappedComponent.instance(), 'deleteReport');
    const textWrapper = wrappedComponent.childAt(0).find('div');

    textWrapper.at(1).simulate('click');
    expect(onClickMocked).toBeCalled();
    expect(onClickMocked).toBeCalledWith(testBindingId, true, mockDelete, testName);
  });
  it('should display delete and refresh buttons', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      fileName="test"
      refreshDate={new Date()}
      objectType={{ name: 'report' }}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon');
    // then
    const refreshButton = wrappedIcons.at(1);
    expect(wrappedIcons.length).toBeGreaterThan(0);
    expect(refreshButton.props().type).toEqual('refresh');
    const deleteButton = wrappedIcons.at(2);
    expect(deleteButton.props().type).toEqual('trash');
  });
  it('refresh method should not do anything if in loading state', () => {
    // given
    const onRefreshMock = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId=""
      fileName="test"
      refreshReport={onRefreshMock}
      isLoading
      objectType={{ name: 'report' }}
    />);
    const refreshFunction = wrappedComponent.instance().refreshAction;
    refreshFunction(mockEvent);
    // then
    expect(onRefreshMock).not.toBeCalled();
  });
  it('refresh method should run onRefresh method', async () => {
    // given
    const onRefreshMock = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const objectClickMock = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation(() => true);
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId=""
      fileName="test"
      refreshReportsArray={onRefreshMock}
      isLoading={false}
      objectType={{ name: 'report' }}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    await expect(objectClickMock).toBeCalled();
    expect(onRefreshMock).toBeCalled();
  });
  it('should invoke refresh method on button click', async () => {
    // given
    const onRefreshMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});
    const objectClickMock = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation(() => true);
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      fileName="test"
      refreshReportsArray={onRefreshMocked}
      isLoading={false}
      objectType={objectType}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    await expect(objectClickMock).toBeCalled();
    expect(onRefreshMocked).toBeCalled();
    expect(onRefreshMocked).toBeCalledWith([{ bindId: testBindingId, objectType }], false);
  });
  it('should NOT invoke refresh method on button click if allowRefreshClick is false', () => {
    // given
    const onRefreshMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testBindingId = 'testBindingId';
    const objectType = 'report';
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      refreshReport={onRefreshMocked}
      isLoading={false}
    />);
    wrappedComponent.setState({ allowRefreshClick: false });
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(2);
    refreshButton.props().onClick(mockEvent);
    // then
    expect(onRefreshMocked).not.toBeCalled();
  });
  it('should display spinner when report is refreshing', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      isLoading
      objectType={{ name: 'report' }}
    />);
    const wrappedSpinner = wrappedComponent.find('img');
    // then
    expect(wrappedSpinner).toBeTruthy();
  });
  it('should invoke delete method on button click', () => {
    // given
    const onDeleteMocked = jest.fn();
    const testBindingId = 'testBindingId';
    const mockEvent = { stopPropagation: jest.fn() };
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      isCrosstab
      crosstabHeaderDimensions={{}}
      fileName="test"
      onDelete={onDeleteMocked}
      objectType={{ name: 'report' }}
    />);
    wrappedComponent.setState({ allowDeleteClick: true });
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const deleteButton = wrappedIcons.at(2);
    deleteButton.props().onClick(mockEvent);
    // then
    expect(onDeleteMocked).toBeCalled();
    expect(onDeleteMocked).toBeCalledWith(testBindingId, true, {});
  });
  it('should NOT invoke delete method on button click if allowDeleteClick is false', () => {
    // given
    fileHistoryHelper.deleteReport = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testBindingId = 'testBindingId';
    const objectType = 'report';
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});

    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      objectType={{ name: 'report' }}
    />);
    wrappedComponent.setState({ allowDeleteClick: false });
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const deleteButton = wrappedIcons.at(2);
    // when
    deleteButton.props().onClick(mockEvent);
    // then
    expect(fileHistoryHelper.deleteReport).not.toBeCalled();
  });
  it('should invoke ONLY select method on button click', async () => {
    // given
    const onDeleteMocked = jest.fn();
    const onClickMocked = jest.fn();
    const onRefreshMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testBindingId = 'testBindingId';
    const testName = 'testName';
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      onClick={onClickMocked}
      fileName={testName}
      refreshReport={onRefreshMocked}
      onDelete={onDeleteMocked}
      objectType={{ name: 'report' }}
    />);
    const mockDelete = jest.spyOn(wrappedComponent.instance(), 'deleteReport');
    const textWrapper = wrappedComponent.find('.file-history-container');
    textWrapper.props().onClick(mockEvent);
    // then
    expect(onClickMocked).toBeCalled();
    expect(onClickMocked).toBeCalledWith(testBindingId, true, mockDelete, testName);
    expect(onDeleteMocked).not.toBeCalled();
    expect(onRefreshMocked).not.toBeCalled();
  });
  it('should contain popovers', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile fileName="test" objectType={{ name: 'report' }} />);
    // then
    expect(wrappedComponent.find(Popover)).toHaveLength(6);
  });
  it('should invoke edit method on button click', async () => {
    // given
    const onEditMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});
    const objectClickMock = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation(() => true);
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      fileName="test"
      callForEdit={onEditMocked}
      isLoading={false}
      objectType={objectType}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const editButton = wrappedIcons.at(0);
    editButton.props().onClick(mockEvent);
    // then
    await expect(objectClickMock).toBeCalled();
    expect(onEditMocked).toBeCalled();
    expect(onEditMocked).toBeCalledWith({ bindId: testBindingId, objectType });
  });
  it('should invoke re-prompt method on button click', async () => {
    // given
    const onRepromptMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});
    const objectClickMock = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation(() => true);
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      callForReprompt={onRepromptMocked}
      isLoading={false}
      isPrompted
      objectType={objectType}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const repromptButton = wrappedIcons.at(0);
    repromptButton.props().onClick(mockEvent);
    // then
    await expect(objectClickMock).toBeCalled();
    expect(onRepromptMocked).toBeCalled();
    expect(onRepromptMocked).toBeCalledWith({ bindId: testBindingId, objectType });
  });
  it('rename report should call officeStoreService.renameReport method when filename is given', async () => {
    // given
    const givenFileName = 'name';
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    const target = { value: givenFileName };
    const mockOfficeService = jest.spyOn(officeStoreService, 'preserveReportValue');
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      objectType={objectType}
    />);
    wrappedComponent.instance().renameReport({ target });
    // then
    expect(mockOfficeService).toHaveBeenCalled();
  });

  it('should show contextual menu on right click', () => {
    // given
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      objectType={objectType}
    />);
    wrappedComponent.simulate('contextmenu', {});
    // then
    expect(wrappedComponent.exists('.ant-dropdown.ant-dropdown-hidden')).toBeFalsy();
  });
  it('should update value state when onChange is called', () => {
    // given
    const newFileName = 'newName';
    const event = { target: { value: newFileName } };
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      objectType={objectType}
    />);
    wrappedComponent.instance().handleChange(event);
    // then
    expect(wrappedComponent.state().value).toEqual(newFileName);
  });
  it('should update state on setEditable', () => {
    // given
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      objectType={objectType}
    />);
    // then
    wrappedComponent.instance().setEditable(true);
    expect(wrappedComponent.state().editable).toEqual(true);
    wrappedComponent.instance().setEditable(false);
    expect(wrappedComponent.state().editable).toEqual(false);
  });
  it('should set editable and select text on enableEdit', () => {
    // given
    const event = { domEvent: { stopPropagation: jest.fn() } };
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      objectType={objectType}
    />);
    wrappedComponent.instance().enableEdit(event);
    // then
    expect(wrappedComponent.state().editable).toEqual(true);
  });
  it('should select text async', () => {
    // given

    const mockDocument = jest.spyOn(document, 'getElementById').mockImplementation(() => ({ select: jest.fn() }));
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      objectType={objectType}
    />);
    wrappedComponent.instance().selectTextAsync();
    // then
    setTimeout(() => {
      expect(mockDocument).toHaveBeenCalled();
    }, 150);
  });

  it('should render an input element on doubleclick', () => {
    // given
    const testBindingId = 'testBindingId';
    const objectType = { name: 'report' };
    const wrappedComponent = mount(<_OfficeLoadedFile
      refreshDate={new Date()}
      bindingId={testBindingId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      objectType={objectType}
    />);
    // when
    wrappedComponent.find('.rename-container').simulate('dblclick', {});
    // then
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.exists(`#input-${testBindingId}`)).toBeTruthy();
  });
});
