/* eslint-disable */
import React from 'react';
import { CustomBreadcrumb } from '../../../../src/frontend/app/breadcrumbs/breadcrumb.jsx';
import { mount } from 'enzyme';
/* eslint-enable */

describe('Breadcrumb', () => {
    it('should render dirName that is provided in object', () => {
        // given
        const object = {
            dirName: 'testName',
        };
        // when
        const componentWrapper = mount(<CustomBreadcrumb object={object} />);
        const linkCollection = componentWrapper.find('a');
        // then
        expect(linkCollection.at(0).html()).toContain(object.dirName);
    });
    it('should render projectName that is provided in object', () => {
        // given
        const object = {
            projectName: 'testName',
        };
        // when
        const componentWrapper = mount(<CustomBreadcrumb object={object} />);
        const linkCollection = componentWrapper.find('a');
        // then
        expect(linkCollection.at(0).html()).toContain(object.projectName);
    });
    it('should invoke proper method on click for dirName', () => {
        // given
        const object = {
            dirId: 'testId',
            dirName: 'testName',
        };
        const mockMethod = jest.fn();
        // when
        const componentWrapper = mount(<CustomBreadcrumb
            object={object}
            onClick={mockMethod} />);
        const nestedComponent = componentWrapper.find('BreadcrumbItem');
        nestedComponent.prop('onClick')();
        const linkCollection = componentWrapper.find('a');
        // then
        expect(linkCollection.at(0).html()).toContain(object.dirName);
        expect(mockMethod).toHaveBeenCalled();
        expect(mockMethod).toHaveBeenCalledWith(object.dirId);
    });
    it('should invoke proper method on click for projectName', () => {
        // given
        const object = {
            projectId: 'testId',
            projectName: 'testName',
        };
        const mockMethod = jest.fn();
        // when
        const componentWrapper = mount(<CustomBreadcrumb
            object={object}
            onClick={mockMethod} />);
        const nestedComponent = componentWrapper.find('BreadcrumbItem');
        nestedComponent.prop('onClick')();
        const linkCollection = componentWrapper.find('a');
        // then
        expect(linkCollection.at(0).html()).toContain(object.projectName);
        expect(mockMethod).toHaveBeenCalled();
        expect(mockMethod).toHaveBeenCalledWith(object.projectId);
    });
});
