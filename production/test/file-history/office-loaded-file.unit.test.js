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
  it('should invoke refresh method on button click', () => {
    // given
    const onRefreshMocked = jest.fn();
    const testBindingId = 'testBindingId';
    jest.spyOn(fileHistoryHelper, 'refreshReport').mockImplementation((func) => func(testBindingId));
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});
    // when
    const wrappedComponent = mount(<OfficeLoadedFile
      bindingId={testBindingId}
      fileName='test'
      onRefresh={onRefreshMocked} />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick();
    // then
    expect(onRefreshMocked).toBeCalled();
    expect(onRefreshMocked).toBeCalledWith(testBindingId);
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
