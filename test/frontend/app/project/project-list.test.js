import React from 'react'; // eslint-disable-line no-unused-vars
import { shallow, mount } from 'enzyme';
import Projects from '../../../../src/frontend/app/project/project-list'; // eslint-disable-line no-unused-vars
import projectRestService from '../../../../src/frontend/app/project/project-rest-service-mock';

describe('ProjectList', () => {
    const location = {};
    const navigateToProjectMock = jest.fn();
    
    beforeAll(() => {
        // origin path
        const origin = { pathname: '/' };
        // projects data
        const projects = projectRestService.getProjectList();
        const state = {
            origin,
            projects,
            navigateToProject: navigateToProjectMock,
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
        // then
        const items = component.find('ul');
        const firstItem = items.childAt(0);
        expect(firstItem.find('li').props().onClick).toBeDefined();
    });

    // App pushes project to history
    it('should push project to history after clicking', () => {
        // when
        const component = mount(<Projects location={location} />);
        const items = component.find('ul');
        const firstItem = items.childAt(0);
        // const mockPush = jest.fn();
        // firstItem.props.history = { push: mockPush };
        // then
        firstItem.find('li').simulate('click');

        expect(navigateToProjectMock).toBeCalled();
    });

    it('should display MSTR Objects', () => {

    });
});
