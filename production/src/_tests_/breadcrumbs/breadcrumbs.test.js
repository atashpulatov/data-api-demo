/* eslint-disable */
import React from 'react';
import { _Breadcrumbs } from '../../breadcrumbs/breadcrumbs.jsx';
import { breadcrumbsService } from '../../breadcrumbs/breadcrumb-service';
import { mount } from 'enzyme';
/* eslint-enable */

describe('Breadcrumbs', () => {
    const originalMethod = breadcrumbsService.getHistoryObjects;
    beforeAll(() => {
        breadcrumbsService.getHistoryObjects = jest.fn();
    });
    afterAll(() => {
        breadcrumbsService.getHistoryObjects = originalMethod;
    });
    it('should not render breadcrumbs', () => {
        // given
        breadcrumbsService.getHistoryObjects.mockImplementation(() => {
            return [];
        });
        // when
        const componentWrapper = mount(<_Breadcrumbs />);
        // then
        expect(componentWrapper.html()).toBeNull();
    });
    it('should render two breadcrumbs', () => {
        // given
        breadcrumbsService.getHistoryObjects.mockImplementation(() => {
            return [
                {
                    projectId: 'testProjectId',
                    projectName: 'testProjectName',
                },
                {
                    dirId: 'testDirId1',
                    dirName: 'testDirName1',
                },
            ];
        });
        // when
        const componentWrapper = mount(<_Breadcrumbs />);
        // then
        const breadcrumbContainer = componentWrapper.find('BreadcrumbItem');
        expect(breadcrumbContainer).toHaveLength(2);
    });
    it('should render 100 breadcrumbs', () => {
        // given
        breadcrumbsService.getHistoryObjects.mockImplementation(() => {
            return breadCrumbsGenerator(100);
        });
        // when
        const componentWrapper = mount(<_Breadcrumbs />);
        // then
        const breadcrumbContainer = componentWrapper.find('BreadcrumbItem');
        expect(breadcrumbContainer).toHaveLength(100);
    });
});

function breadCrumbsGenerator(count) {
    let breadcrumbArray = [
        {
            projectId: 'testProjectId',
            projectName: 'testProjectName',
        },
    ];
    for (let i = 0; i < count - 1; i++) {
        breadcrumbArray.push({
            dirId: `testDirId${i}`,
            dirName: `testDirName${i}`,
        });
    }
    return breadcrumbArray;
}
