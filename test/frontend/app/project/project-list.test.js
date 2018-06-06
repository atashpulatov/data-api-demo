import React from 'react'; // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme';
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
    it('shoud have row defined', () => {
        // when
        const component = shallow(<Projects location={location} />);
        // then
        const items = component.find('ul');
        const firstItem = items.childAt(0);
        console.log(firstItem.props().projectRow);
        expect(firstItem.props().projectRow).toBeDefined();
    });

    // User can click the project
    it('shoud be clickable', () => {
        // when
        const component = shallow(<Projects location={location} />);
        // then
        const items = component.find('ul');
        const firstItem = items.childAt(0);
        expect(firstItem.props().onClick).toBeDefined();
    });
});
