import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'enzyme';
import MstrObjects from '../../../../src/frontend/app/mstr-object/mstr-object-list'; // eslint-disable-line no-unused-vars
import { mstrTutorial } from '../../../../src/frontend/app/mockData';

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
    it('shoud have all rows', () => {
        // when
        const component = mount(<MstrObjects location={location} />);
        // then

        // mockMstrObjects consists of project representation also,
        // which we don't want to display here
        expect(component.find('li')).toHaveLength(mockMstrObjects.length - 1);
    });

    // User notices objects' info
    it('shoud row be rendered', () => {
        // when
        const component = mount(<MstrObjects location={location} />);
        // then
        const items = component.find('ul');
        const directories = items.at(0);
        const reports = items.at(1);

        directories.children().forEach((row) => {
            const directory = row.props().directory;
            // should have row defined
            expect(directory).toBeDefined();

            // should have name and image
            expect(row.find('h1').text()).toContain('Name:');
            console.log(row.find('img').html());
            expect(row.find('img').html()).toBeTruthy();
        });

        reports.children().forEach((row) => {
            const report = row.props().report;
            // should have row defined
            expect(report).toBeDefined();

            // should have name and image
            expect(row.find('h1').text()).toContain('Name:');
        });
    });

    // it('should get project content data from server', () => {
    //     const mstrObjects = mstrObjectRestService.getProjectContent('B7CA92F04B9FAE8D941C3E9B7E0CD754');
    //     expect(mstrObjects).toBeDefined();
    //     expect(mstrObjects.length).toBeGreaterThan(1);
    //     expect(mstrObjects).toContain('032A5E114A59D28267BDD8B6D9E58B22');
    //     //expect(false).toBeTruthy();
    // });

    // it('should have project content rendered', () => {
    //     // when
    //     const component = mount(<MstrObjects location={location} />);
    //     // then
    //     const items = component.find('ul');
    //     // should have proper css class
    //     expect(items.hasClass('projectRowContainer')).toBeTruthy();

    //     const firstItem = items.childAt(0);
    //     const projectRow = firstItem.props().projectRow;
    //     // should have row defined
    //     expect(projectRow).toBeDefined();

    //     // should have name and alias
    //     expect(firstItem.find('h1').text()).toContain('Name:');
    //     expect(firstItem.find('h2').text()).toContain('Alias:');
    //     expect(false).toBeTruthy();
    // });
});
