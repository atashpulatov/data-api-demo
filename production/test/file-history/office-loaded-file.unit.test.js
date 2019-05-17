import React from 'react';
import {mount} from 'enzyme';
import {_OfficeLoadedFile} from '../../src/file-history/office-loaded-file';
import {reduxStore} from '../../src/store';
import {fileHistoryHelper} from '../../src/file-history/file-history-helper';

describe('office loaded file', () => {
  it('should display provided file name', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile fileName='test' />);
    // then
    expect(wrappedComponent.find('Row').hasClass('file-history-container')).toBeTruthy();
    expect(wrappedComponent.html()).toContain('test');
  });
  it('should call componentWillUnmount provided file name', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile fileName='test' />);
    wrappedComponent.instance().componentWillUnmount();
    // then
    expect(wrappedComponent.instance()._ismounted).toBeFalsy();
  });
  it('should display dataset type icon', () => {
    // given

    // when
    const wrappedComponent = mount(<_OfficeLoadedFile objectType='test' />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon');
    const wrappedCol = wrappedComponent.find('Col');
    // then
    expect(wrappedCol.at(0).contains(wrappedIcons.get(0))).toBe(true);
    expect(wrappedIcons.at(0).prop('type')).toBe('dataset');
  });

  it('should display report type icon', () => {
    // given

    // when
    const wrappedComponent = mount(<_OfficeLoadedFile objectType='report' />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon');
    const wrappedCol = wrappedComponent.find('Col');
    // then
    expect(wrappedCol.at(0).contains(wrappedIcons.get(0))).toBe(true);
    expect(wrappedIcons.at(0).prop('type')).toBe('report');
  });

  it('should invoke select method on report name click', () => {
    // given
    const onClickMocked = jest.fn();
    const testBindingId = 'testBindingId';
    const wrappedComponent = mount(<_OfficeLoadedFile
      bindingId={testBindingId}
      onClick={onClickMocked}
      fileName='test' />);
    // when
    const textWrapper = wrappedComponent.childAt(0).find('Col');
    textWrapper.at(1).simulate('click');
    expect(onClickMocked).toBeCalled();
    expect(onClickMocked).toBeCalledWith(testBindingId);
  });
  it('should display delete and refresh buttons', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile fileName='test' />);
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
    const mockEvent = {stopPropagation: jest.fn()};
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      bindingId={''}
      fileName='test'
      refreshReport={onRefreshMock}
      isLoading={true} />);
    const refreshFunction = wrappedComponent.instance().refreshAction;
    refreshFunction(mockEvent);
    // then
    expect(onRefreshMock).not.toBeCalled();
  });
  it('refresh method should run onRefresh method', () => {
    // given
    const onRefreshMock = jest.fn();
    const mockEvent = {stopPropagation: jest.fn()};
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      bindingId={''}
      fileName='test'
      refreshReport={onRefreshMock}
      isLoading={false} />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    expect(onRefreshMock).toBeCalled();
  });
  it('should invoke refresh method on button click', () => {
    // given
    const onRefreshMocked = jest.fn();
    const mockEvent = {stopPropagation: jest.fn()};
    const testBindingId = 'testBindingId';
    const objectType = 'report';
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      bindingId={testBindingId}
      objectType={objectType}
      fileName='test'
      refreshReport={onRefreshMocked}
      isLoading={false} />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    expect(onRefreshMocked).toBeCalled();
    expect(onRefreshMocked).toBeCalledWith(testBindingId, objectType, false);
  });
  it('should NOT invoke refresh method on button click if allowRefreshClick is false', () => {
    // given
    const onRefreshMocked = jest.fn();
    const mockEvent = {stopPropagation: jest.fn()};
    const testBindingId = 'testBindingId';
    const objectType = 'report';
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      bindingId={testBindingId}
      objectType={objectType}
      fileName='test'
      refreshReport={onRefreshMocked}
      isLoading={false} />);
    wrappedComponent.setState({allowRefreshClick: false});
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    expect(onRefreshMocked).not.toBeCalled();
  });
  it('should display spinner when report is refreshing', () => {
    // given
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      isLoading={true} />);
    const wrappedSpinner = wrappedComponent.find('img');
    // then
    expect(wrappedSpinner).toBeTruthy();
  });
  it('should invoke delete method on button click', () => {
    // given
    const onDeleteMocked = jest.fn();
    const testBindingId = 'testBindingId';
    const mockEvent = {stopPropagation: jest.fn()};
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      bindingId={testBindingId}
      fileName='test'
      onDelete={onDeleteMocked} />);
    wrappedComponent.setState({allowDeleteClick: true});
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const deleteButton = wrappedIcons.at(2);
    deleteButton.props().onClick(mockEvent);
    // then
    expect(onDeleteMocked).toBeCalled();
    expect(onDeleteMocked).toBeCalledWith(testBindingId);
  });
  it('should NOT invoke delete method on button click if allowDeleteClick is false', () => {
    // given
    fileHistoryHelper.deleteReport = jest.fn();
    const mockEvent = {stopPropagation: jest.fn()};
    const testBindingId = 'testBindingId';
    const objectType = 'report';
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});

    const wrappedComponent = mount(<_OfficeLoadedFile
      bindingId={testBindingId}
      objectType={objectType}
      fileName='test'
      isLoading={false} />);
    wrappedComponent.setState({allowDeleteClick: false});
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const deleteButton = wrappedIcons.at(2);
    // when
    deleteButton.props().onClick(mockEvent);
    // then
    expect(fileHistoryHelper.deleteReport).not.toBeCalled();
  });
  it('should invoke ONLY select method on button click', () => {
    // given
    const onDeleteMocked = jest.fn();
    const onClickMocked = jest.fn();
    const onRefreshMocked = jest.fn();
    const mockEvent = {stopPropagation: jest.fn()};
    const testBindingId = 'testBindingId';
    // when
    const wrappedComponent = mount(<_OfficeLoadedFile
      bindingId={testBindingId}
      onClick={onClickMocked}
      fileName='test'
      refreshReport={onRefreshMocked}
      onDelete={onDeleteMocked} />);
    const textWrapper = wrappedComponent.childAt(0);
    textWrapper.props().onClick(mockEvent);
    // then
    expect(onClickMocked).toBeCalled();
    expect(onClickMocked).toBeCalledWith(testBindingId);
    expect(onDeleteMocked).not.toBeCalled();
    expect(onRefreshMocked).not.toBeCalled();
  });
});
