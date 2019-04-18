import React from 'react';
import {mount} from 'enzyme';
import {OfficeLoadedFile} from '../../src/file-history/office-loaded-file';
import {fileHistoryHelper} from '../../src/file-history/file-history-helper';
import {reduxStore} from '../../src/store';

describe('office loaded file', () => {
  it('should display provided file name', () => {
    // given
    // when
    const wrappedComponent = mount(<OfficeLoadedFile fileName='test' />);
    // then
    expect(wrappedComponent.find('Row').hasClass('file-history-container')).toBeTruthy();
    expect(wrappedComponent.html()).toContain('test');
  });
  it('should call componentWillUnmount provided file name', () => {
    // given
    // when
    const wrappedComponent = mount(<OfficeLoadedFile fileName='test' />);
    wrappedComponent.instance().componentWillUnmount();
    // then
    expect(wrappedComponent.instance()._ismounted).toBeFalsy();
  });
  it('should display dataset type icon', () => {
    // given

    // when
    const wrappedComponent = mount(<OfficeLoadedFile objectType='test' />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon');
    const wrappedCol = wrappedComponent.find('Col');
    // then
    expect(wrappedCol.at(0).contains(wrappedIcons.get(0))).toBe(true);
    expect(wrappedIcons.at(0).prop('type')).toBe('dataset');
  });

  it('should display report type icon', () => {
    // given

    // when
    const wrappedComponent = mount(<OfficeLoadedFile objectType='report' />);
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
    const wrappedComponent = mount(<OfficeLoadedFile
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
    const wrappedComponent = mount(<OfficeLoadedFile fileName='test' />);
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
    // when
    const wrappedComponent = mount(<OfficeLoadedFile
      bindingId={''}
      fileName='test'
      onRefresh={onRefreshMock}
      isLoading={true} />);
    const refreshFunction = wrappedComponent.instance().refreshAction;
    refreshFunction();
    // then
    expect(onRefreshMock).not.toBeCalled();
  });
  it('refresh method should run onRefresh method', () => {
    // given
    const onRefreshMock = jest.fn();
    // when
    const wrappedComponent = mount(<OfficeLoadedFile
      bindingId={''}
      fileName='test'
      onRefresh={onRefreshMock}
      isLoading={false} />);
    const refreshFunction = wrappedComponent.instance().refreshAction;
    refreshFunction();
    // then
    expect(onRefreshMock).toBeCalled();
  });
  it('refresh action should NOT run onRefresh when allowRefreshClick is false', () => {
    // given
    const onRefreshMock = jest.fn();
    // when
    const wrappedComponent = mount(<OfficeLoadedFile
      bindingId={''}
      fileName='test'
      onRefresh={onRefreshMock}
      isLoading={false} />);
    wrappedComponent.setState({allowRefreshClick: false});
    const buttonRefresh = wrappedComponent.find('.loading-button-container');
    buttonRefresh.simulate('click');
    // then
    expect(onRefreshMock).not.toBeCalled();
  });
  it('refresh action should NOT run onRefresh when allowRefreshClick is false', () => {
    // given
    const onRefreshMock = jest.fn();
    // when
    const wrappedComponent = mount(<OfficeLoadedFile
      bindingId={''}
      fileName='test'
      onRefresh={onRefreshMock}
      isLoading={false} />);
    wrappedComponent.setState({allowRefreshClick: true});
    const buttonRefresh = wrappedComponent.find('.loading-button-container');
    buttonRefresh.simulate('click');
    // then
    expect(onRefreshMock).toBeCalled();
  });
  it('should display spinner when report is refreshing', () => {
    // given
    // when
    const wrappedComponent = mount(<OfficeLoadedFile
      isLoading={true} />);
    const wrappedSpinner = wrappedComponent.find('img');
    // then
    expect(wrappedSpinner).toBeTruthy();
  });
  it('should invoke delete method on button click', () => {
    // given
    const onDeleteMocked = jest.fn();
    const testBindingId = 'testBindingId';
    // when
    const wrappedComponent = mount(<OfficeLoadedFile
      bindingId={testBindingId}
      fileName='test'
      onDelete={onDeleteMocked} />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const deleteButton = wrappedIcons.at(2);
    deleteButton.props().onClick();
    // then
    expect(onDeleteMocked).toBeCalled();
    expect(onDeleteMocked).toBeCalledWith(testBindingId);
  });
  it('should invoke ONLY select method on button click', () => {
    // given
    const onDeleteMocked = jest.fn();
    const onClickMocked = jest.fn();
    const onRefreshMocked = jest.fn();
    const testBindingId = 'testBindingId';
    // when
    const wrappedComponent = mount(<OfficeLoadedFile
      bindingId={testBindingId}
      onClick={onClickMocked}
      fileName='test'
      onRefresh={onRefreshMocked}
      onDelete={onDeleteMocked} />);
    const textWrapper = wrappedComponent.childAt(0).find('Col').at(1);
    textWrapper.props().onClick();
    // then
    expect(onClickMocked).toBeCalled();
    expect(onClickMocked).toBeCalledWith(testBindingId);
    expect(onDeleteMocked).not.toBeCalled();
    expect(onRefreshMocked).not.toBeCalled();
  });
});
