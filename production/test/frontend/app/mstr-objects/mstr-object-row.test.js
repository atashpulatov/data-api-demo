
/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { DirectoryRow, ReportRow } from '../../../../src/frontend/app/mstr-object/mstr-object-row-antd';
/* eslint-enable */

describe('MstrObjectRow', () => {
    describe('DirectoryRow', () => {
        it('should return proper name and icon', () => {
            // given
            const object = {
                name: 'testName',
                id: 'testId',
            };
            // when
            const wrappedComponent = mount(<DirectoryRow directory={object} />);
            const wrappedIcon = wrappedComponent.find('Icon');
            // then
            expect(wrappedComponent.childAt(0).html()).toContain(object.name);
            expect(wrappedIcon.at(0).props().type).toEqual('folder');
        });
        it('directory should be clickable', () => {
            // given
            const object = {
                name: 'testName',
                id: 'testId',
            };
            const onClick = jest.fn();
            const wrappedComponent = mount(<DirectoryRow directory={object} onClick={onClick} />);
            const wrappedRow = wrappedComponent.find('Row');
            // when
            wrappedRow.prop('onClick')();
            // then
            expect(onClick).toBeCalled();
            expect(onClick).toBeCalledWith(object.id, object.name);
        });
    });
    describe('ReportRow', () => {
        it('should return proper name and icon', () => {
            // given
            const object = {
                name: 'testName',
                id: 'testId',
            };
            // when
            const wrappedComponent = mount(<ReportRow report={object} />);
            const wrappedIcon = wrappedComponent.find('Icon');
            // then
            expect(wrappedComponent.childAt(0).html()).toContain(object.name);
            expect(wrappedIcon.at(0).props().type).toEqual('file-text');
        });
        it('directory should be clickable', () => {
            // given
            const object = {
                name: 'testName',
                id: 'testId',
            };
            const onClick = jest.fn();
            const wrappedComponent = mount(<ReportRow report={object} onClick={onClick} />);
            const wrappedRow = wrappedComponent.find('Row');
            // when
            wrappedRow.prop('onClick')();
            // then
            expect(onClick).toBeCalled();
            expect(onClick).toBeCalledWith(object.id);
        });
    });
});
