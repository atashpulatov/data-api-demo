/* eslint-disable */
import React from 'react';
import { MstrObjects } from '../../../../src/frontend/app/mstr-object/mstr-object-list';
import { mount } from 'enzyme';
import { mstrTutorial } from '../mockData';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
/* eslint-enable */

describe('MstrObjectList', () => {
    const mockMstrObjects = [];
    const location = {};

    beforeAll(() => {
        mockMstrObjects.push(...mstrTutorial);
        // origin path
        const origin = { pathname: '/' };
        // projects data
        const state = {
            origin,
            mstrObjects: mockMstrObjects,
        };
        location.state = state;
    });

    // User sees all data
    it('should have all rows', () => {
        // when
        const componentWrapper = mount(<MstrObjects location={location} />);
        // then

        // mockMstrObjects consists of project representation also,
        // which we don't want to display here
        expect(componentWrapper.find('li'))
            .toHaveLength(mockMstrObjects.length - 1);
    });

    // User notices directories' info
    it('should directory rows be rendered', () => {
        // when
        const componentWrapper = mount(<MstrObjects location={location} />);
        // then
        const items = componentWrapper.find('ul');
        const directories = items.at(0); // directories first

        directories.children().forEach((row) => {
            const directory = row.props().directory;
            // should have row defined
            expect(directory).toBeDefined();

            // should have name and image
            expect(row.find('label').text()).toBeTruthy();
            expect(row.find('img').html()).toBeTruthy();
        });
    });

    // User notices reports' info
    it('should report rows be rendered', () => {
        // when
        const componentWrapper = mount(<MstrObjects location={location} />);
        // then
        const items = componentWrapper.find('ul');
        const reports = items.at(1); // reports second

        reports.children().forEach((row) => {
            const report = row.props().report;
            // should have row defined
            expect(report).toBeDefined();

            // should have name and image
            expect(row.find('label').text()).toBeTruthy();
            expect(row.find('img').html()).toBeTruthy();
        });
    });

    // User sees directories may be clicked
    it('should directory rows be clickable', () => {
        // when
        const componentWrapper = mount(<MstrObjects location={location} />);
        // then
        const items = componentWrapper.find('ul');
        const directories = items.at(0); // directories first

        directories.children().forEach((row) => {
            const directoryRowLi = row.find('li');
            expect(directoryRowLi.hasClass('cursor-is-pointer')).toBeTruthy();
        });
    });

    // User can click a directory
    it('should directory row be reponsive', () => {
        // given
        const originalMethod = MstrObjects.prototype.navigateToDir;
        const mockClick = jest.fn();
        try {
            MstrObjects.prototype.navigateToDir = mockClick;
            // when
            const componentWrapper = mount(<MstrObjects location={location} />);

            // then
            const items = componentWrapper.find('ul');
            const directories = items.at(0); // directories first

            directories.children().forEach((row) => {
                const directoryRowLi = row.find('li');
                directoryRowLi.simulate('click');
                expect(mockClick).toBeCalled();
            });
            expect(originalMethod).toBeDefined();
        } finally {
            MstrObjects.prototype.navigateToDir = originalMethod;
        }
    });

    // User can open a directory
    it('should pass directory when clicked', () => {
        // given
        const expectedHistoryObject = {};
        // when
        const componentWrapper = mount(<MstrObjects location={location} />);
        const mockPush = jest.fn();
        componentWrapper.setProps({ history: { push: mockPush } });
        // then
        const items = componentWrapper.find('ul');
        const directories = items.at(0); // directories first

        let iterateId = 0;
        directories.children().forEach((row) => {
            const dirId = mockMstrObjects[iterateId].id;
            const dirName = mockMstrObjects[iterateId].name;
            expectedHistoryObject[historyProperties.command] =
                historyProperties.actions.goInside;
            expectedHistoryObject[historyProperties.directoryId] = dirId;
            expectedHistoryObject[historyProperties.directoryName] = dirName;
            const directoryRowLi = row.find('li');
            directoryRowLi.simulate('click');
            expect(mockPush).toBeCalledWith({
                pathname: '/',
                origin: componentWrapper.props().location,
                historyObject: expectedHistoryObject,
            });
            ++iterateId;
        });
    });

    // User sees reports may be clicked
    it.skip('should', () => {
        expect(false).toBeTruthy();
    }
    );

    // User can click a report

    // User can open report
});
