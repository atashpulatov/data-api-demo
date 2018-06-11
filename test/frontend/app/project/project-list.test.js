import React from 'react'; // eslint-disable-line no-unused-vars
import { shallow, mount } from 'enzyme';
import Projects from '../../../../src/frontend/app/project/project-list'; // eslint-disable-line no-unused-vars
import { projects } from '../../../../src/frontend/app/mockData';

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

    // User notices project's info
    it('shoud have row rendered', () => {
        // when
        const component = mount(<Projects location={location} />);
        // then
        const items = component.find('ul');
        // should have proper css class
        expect(items.hasClass('projectRowContainer')).toBeTruthy();

        const firstItem = items.childAt(0);
        const projectRow = firstItem.props().projectRow;
        // should have row defined
        expect(projectRow).toBeDefined();

        // should have name and alias
        expect(firstItem.find('h1').text()).toContain('Name:');
        expect(firstItem.find('h2').text()).toContain('Alias:');
    });

    // User can click the project
    it('shoud be clickable', () => {
        // when
        const component = mount(<Projects location={location} />);
        const items = component.find('ul');
        const firstItem = items.childAt(0);

        // then
        expect(firstItem.find('li').props().onClick).toBeDefined();
    });

    it('should have proper mouse pointer icon on Mouse Over', () => {
        // when
        const component = mount(<Projects location={location} />);
        const mockPush = jest.fn();
        component.setProps({ history: { push: mockPush } });

        const items = component.find('ul');
        const projectRowLi = items.childAt(0).find('li');
        expect(projectRowLi.hasClass('cursorIsPointer')).toBeTruthy();
    });

    it('shoud be reponsive', () => {
        // when
        const component = mount(<Projects location={location} />);
        const mockPush = jest.fn();
        component.setProps({ history: { push: mockPush } });

        const items = component.find('ul');
        const firstItem = items.childAt(0);

        firstItem.find('li').simulate('click');

        // then
        expect(mockPush).toBeCalled();
    });

    it('should pass project when clicked', () => {
        // given
        const expectedProjectId = projects.projectsArray[0].id;
        // when
        const component = mount(<Projects location={location} />);
        const mockPush = jest.fn();
        component.setProps({ history: { push: mockPush } });

        const items = component.find('ul');
        const firstItem = items.childAt(0);

        firstItem.find('li').simulate('click');

        // then
        expect(mockPush).toBeCalledWith({
            pathname: '/',
            origin: component.props().location,
        });

        expect(sessionStorage.getItem('x-mstr-projectid')).toBeDefined();
        expect(sessionStorage.getItem('x-mstr-projectid')).toBe(expectedProjectId);
    });
});
