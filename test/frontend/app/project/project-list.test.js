import React from 'react'; // eslint-disable-line no-unused-vars
import { shallow, mount } from 'enzyme';
import Projects from '../../../../src/frontend/app/project/project-list'; // eslint-disable-line no-unused-vars
import projectRestService from '../../../../src/frontend/app/project/project-rest-service-mock';

describe('ProjectList', () => {
    const location = {};

    beforeAll(() => {
        // origin path
        const origin = { pathname: '/' };
        // projects data
        const projects = projectRestService.getProjectList();
        const state = {
            origin,
            projects,
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
            projectId: firstItem.props().projectRow.id,
        });

        expect(false).toBeTruthy();
    });
});
