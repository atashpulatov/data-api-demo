/* eslint-disable */
import React from 'react';
import Projects from '../../../../src/frontend/app/project/project-list';
import { mount } from 'enzyme';
import { projects } from './mock-data';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
/* eslint-enable */

describe('ProjectList', () => {
    const location = {};

    beforeAll(() => {
        // origin path
        const origin = { pathname: '/' };
        // projects data
        const mockProjects = projects.projectsArray;
        const state = {
            origin,
            projects: mockProjects,
        };
        location.state = state;
    });

    // User sees all data
    it('shoud have all rows', () => {
        // when
        const componentWrapper = mount(<Projects location={location} />);
        // then
        const items = componentWrapper.find('ul');
        expect(items.children()).toHaveLength(projects.projectsArray.length);
    });

    // User notices projects' info
    it('shoud row be rendered', () => {
        // when
        const componentWrapper = mount(<Projects location={location} />);
        // then
        const items = componentWrapper.find('ul');
        // should have proper css class
        expect(items.hasClass('projectRowContainer')).toBeTruthy();

        items.children().forEach((row) => {
            const projectRow = row.props().projectRow;
            // should have row defined
            expect(projectRow).toBeDefined();

            // should have name and alias
            expect(row.find('label').text()).toBeTruthy();
        });
    });

    // User sees that project is clickable
    it('should have proper mouse pointer icon on Mouse Over', () => {
        // when
        const componentWrapper = mount(<Projects location={location} />);
        const mockPush = jest.fn();
        componentWrapper.setProps({ history: { push: mockPush } });

        const items = componentWrapper.find('ul');
        const projectRowLi = items.childAt(0).find('li');
        expect(projectRowLi.hasClass('cursorIsPointer')).toBeTruthy();
    });

    // User can click the project
    it('shoud row be clickable', () => {
        // when
        const componentWrapper = mount(<Projects location={location} />);
        const items = componentWrapper.find('ul');
        const firstItem = items.childAt(0);

        // then
        expect(firstItem.find('li').props().onClick).toBeDefined();
    });

    it('shoud row be reponsive', () => {
        const originalMethod = Projects.prototype.navigateToProject;
        // given
        const mockClick = jest.fn();
        try {
            Projects.prototype.navigateToProject = mockClick;
            // when
            const componentWrapper = mount(<Projects location={location} />);

            const items = componentWrapper.find('ul');
            const firstItem = items.childAt(0);

            firstItem.find('li').simulate('click');

            // then
            expect(mockClick).toBeCalled();
            expect(originalMethod).toBeDefined();
        } finally {
            Projects.prototype.navigateToProject = originalMethod;
        }
    });

    it('should pass project when clicked', () => {
        // given
        const expectedProjectId = projects.projectsArray[0].id;
        const expectedSessionObject = {};
        expectedSessionObject[sessionProperties.projectId] =
            expectedProjectId;
        // when
        const componentWrapper = mount(<Projects location={location} />);
        const mockPush = jest.fn();
        componentWrapper.setProps({ history: { push: mockPush } });

        const items = componentWrapper.find('ul');
        const firstItem = items.childAt(0);

        firstItem.find('li').simulate('click');

        // then
        expect(mockPush).toBeCalledWith({
            pathname: '/',
            origin: componentWrapper.props().location,
            sessionObject: expectedSessionObject,
        });
    });
});
