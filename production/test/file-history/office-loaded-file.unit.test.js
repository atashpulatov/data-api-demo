
/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { OfficeLoadedFile } from '../../src/file-history/office-loaded-file';
/* eslint-enable */

describe('office loaded file', () => {
    it('should display provided file name', () => {
        // given
        // when
        const wrappedComponent = mount(<OfficeLoadedFile fileName='test' />);
        // then
        expect(wrappedComponent.find('Row').hasClass('cursor-is-pointer')).toBeTruthy();
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
        const wrappedButtons = wrappedComponent.find('Icon');
        // then
        const refreshButton = wrappedButtons.at(0);
        expect(wrappedButtons.length).toBeGreaterThan(0);
        expect(refreshButton.props().type).toEqual('redo');
        const deleteButton = wrappedButtons.at(1);
        expect(deleteButton.props().type).toEqual('delete');
    });
    it('should invoke refresh method on button click', () => {
        // given
        const onRefreshMocked = jest.fn();
        const testBindingId = 'testBindingId';
        // when
        const wrappedComponent = mount(<OfficeLoadedFile
            bindingId={testBindingId}
            fileName='test'
            onRefresh={onRefreshMocked} />);
        const buttonsContainer = wrappedComponent.childAt(0).find('Col');
        const refreshButton = buttonsContainer.at(2);
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
        const buttonsContainer = wrappedComponent.childAt(0).find('Col');
        const deleteButton = buttonsContainer.at(3);
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
