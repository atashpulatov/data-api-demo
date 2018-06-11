import React from 'react'; // eslint-disable-line no-unused-vars
import { shallow, mount } from 'enzyme';
import Projects from '../../../../src/frontend/app/project/project-list'; // eslint-disable-line no-unused-vars
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service-mock';

describe('MstrObjectList', () => {
    const location = {};

    beforeAll(() => {
        // origin path
        // const origin = { pathname: '/' };
        // // projects data
        // const mstrObjects = projectRestService.getProjectList();
        // const state = {
        //     origin,
        //     mstrObjects,
        // };
        // location.state = state;
    });
    it('should get project content data from server', () => {
        let mstrObjects = mstrObjectRestService.getProjectContent('B7CA92F04B9FAE8D941C3E9B7E0CD754');
        expect(mstrObjects).toBeDefined();
        expect(mstrObjects.length).toBeGreaterThan(1);
        expect(mstrObjects).toContain('032A5E114A59D28267BDD8B6D9E58B22');
        //expect(false).toBeTruthy();
    });

    it('should have project content rendered', () => {
        // when
        const component = mount(<MstrObjects location={location} />);
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
        expect(false).toBeTruthy();
    });
});
