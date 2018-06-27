/* eslint-disable */
import React from 'react';
import Navigator from '../../../../src/frontend/app/navigator/navigator';
import { shallow, mount } from 'enzyme';
import propertiesEnum from '../../../../src/frontend/app/storage/properties-enum';
import projectRestService from '../../../../src/frontend/app/project/project-rest-service';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
/* eslint-enable */

describe('navigator', () => {
    const originalPushMethod = Navigator.prototype.pushHistory;
    const sampleEnvUrl = 'someEnvUrl';
    const sampleAuthToken = 'someEnvUrl';
    const sampleProjectId = 'someProjectId';
    const sampleFolderId = 'someFolderId';

    const location = {};
    beforeAll(() => {
        location.pathname = '/';
    });

    beforeEach(() => {
        Navigator.prototype.pushHistory = jest.fn();
    });

    afterAll(() => {
        Navigator.prototype.pushHistory = originalPushMethod;
    });

    it('should save authToken', () => {
        // given
        const expectedValue = 'testt';
        const sessionObject = {};
        const location = { sessionObject };
        sessionObject[propertiesEnum.authToken] = expectedValue;
        // when
        mount(<Navigator location={location} />);
        // then
        expect(sessionStorage.getItem(propertiesEnum.authToken))
            .toEqual(expectedValue);
    });

    it('should save folderId', () => {
        // given
        const expectedValue = 'testt';
        const sessionObject = {};
        const location = { sessionObject };
        sessionObject[propertiesEnum.folderId] = expectedValue;
        // when
        mount(<Navigator location={location} />);
        // then
        expect(sessionStorage.getItem(propertiesEnum.folderId))
            .toEqual(expectedValue);
    });

    it('should navigate to authComponent', async () => {
        // given
        const expectedRoute = {
            pathname: '/auth',
            state: {
            },
        };
        // when
        const navigatorWrapper = mount(<Navigator location={location} />);
        await navigatorWrapper.instance().componentDidMount();
        expectedRoute.state.origin = navigatorWrapper.props().location;
        // then
        expect(Navigator.prototype.pushHistory).toBeCalled();
        expect(Navigator.prototype.pushHistory).toBeCalledWith(expectedRoute);
    });

    it('should navigate to projectComponent', async () => {
        // given
        const mockGet = jest.fn();
        const mockProjects = [{ pro1: 'pro1' }];
        const expectedRoute = {
            pathname: '/projects',
            state: {
                projects: mockProjects,
            },
        };
        mockGet.mockResolvedValue(mockProjects);
        const originalGetMethod = projectRestService.getProjectList;

        sessionStorage.setItem(propertiesEnum.envUrl, sampleEnvUrl);
        sessionStorage.setItem(propertiesEnum.authToken, sampleAuthToken);
        try {
            projectRestService.getProjectList = mockGet;
            // when
            const navigatorWrapper = mount(<Navigator location={location} />);
            await navigatorWrapper.instance().componentDidMount();
            expectedRoute.state.origin = navigatorWrapper.props().location;
            // then
            expect(Navigator.prototype.pushHistory).toBeCalled();
            expect(Navigator.prototype.pushHistory)
                .toBeCalledWith(expectedRoute);
        } finally {
            projectRestService.getProjectList = originalGetMethod;
        }
    });

    it('should navigate to rootObjectsComponent', async () => {
        // given
        const mockGet = jest.fn();
        const mockObjects = [{ obj1: 'obj1' }];
        const expectedRoute = {
            pathname: '/objects',
            state: {
                mstrObjects: mockObjects,
            },
        };
        mockGet.mockResolvedValue(mockObjects);
        const originalGetMethod = mstrObjectRestService.getProjectContent;

        sessionStorage.setItem(propertiesEnum.envUrl, sampleEnvUrl);
        sessionStorage.setItem(propertiesEnum.authToken, sampleAuthToken);
        sessionStorage.setItem(propertiesEnum.projectId, sampleProjectId);
        try {
            mstrObjectRestService.getProjectContent = mockGet;
            // when
            const navigatorWrapper = mount(<Navigator location={location} />);
            await navigatorWrapper.instance().componentDidMount();
            expectedRoute.state.origin = navigatorWrapper.props().location;
            // then
            expect(Navigator.prototype.pushHistory).toBeCalled();
            expect(Navigator.prototype.pushHistory)
                .toBeCalledWith(expectedRoute);
        } finally {
            mstrObjectRestService.getProjectContent = originalGetMethod;
        }
    });

    it('should navigate to [folder] objectsComponent', async () => {
        // given
        const mockGet = jest.fn();
        const mockObjects = [{ obj1: 'obj1' }];
        const expectedRoute = {
            pathname: '/objects',
            state: {
                mstrObjects: mockObjects,
            },
        };
        mockGet.mockResolvedValue(mockObjects);
        const originalGetMethod = mstrObjectRestService.getFolderContent;

        sessionStorage.setItem(propertiesEnum.envUrl, sampleEnvUrl);
        sessionStorage.setItem(propertiesEnum.authToken, sampleAuthToken);
        sessionStorage.setItem(propertiesEnum.projectId, sampleProjectId);
        sessionStorage.setItem(propertiesEnum.folderId, sampleFolderId);
        try {
            mstrObjectRestService.getFolderContent = mockGet;
            // when
            const navigatorWrapper = mount(<Navigator location={location} />);
            await navigatorWrapper.instance().componentDidMount();
            expectedRoute.state.origin = navigatorWrapper.props().location;
            // then
            expect(Navigator.prototype.pushHistory).toBeCalled();
            expect(Navigator.prototype.pushHistory)
                .toBeCalledWith(expectedRoute);
        } finally {
            mstrObjectRestService.getFolderContent = originalGetMethod;
        }
    });
});
