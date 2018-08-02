/* eslint-disable */
import React from 'react';
import Navigator from '../../../../src/frontend/app/navigator/navigator';
import { shallow, mount } from 'enzyme';
import { sessionProperties} from '../../../../src/frontend/app/storage/session-properties';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import projectRestService from '../../../../src/frontend/app/project/project-rest-service';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
/* eslint-enable */

describe('navigator', () => {
    const originalPushMethod = Navigator.prototype.pushHistory;
    const sampleEnvUrl = 'someEnvUrl';
    const sampleAuthToken = 'someEnvUrl';
    const sampleProjectId = 'someProjectId';
    const sampleDirArray = ['oldDir', 'newDir'];

    const location = {};
    beforeAll(() => {
        location.pathname = '/';
    });

    beforeEach(() => {
        Navigator.prototype.pushHistory = jest.fn();
        location.sessionObject = {};
        location.historyObject = {};
        sessionStorage.setItem(historyProperties.directoryArray, undefined);
    });

    afterEach(() => {
        location.sessionObject = undefined;
        location.historyObject = undefined;
    });

    afterAll(() => {
        Navigator.prototype.pushHistory = originalPushMethod;
    });

    it('should save authToken', () => {
        // given
        const expectedValue = 'testt';
        location.sessionObject[sessionProperties.authToken] = expectedValue;
        // when
        mount(<Navigator location={location} />);
        // then
        expect(sessionStorage.getItem(sessionProperties.authToken))
            .toEqual(expectedValue);
    });

    it('should save folderId when first folder chosen', () => {
        // given
        const givenValue = 'testt';
        location.historyObject[historyProperties.command] =
            historyProperties.actions.goInside;
        location.historyObject[historyProperties.directoryId] = givenValue;
        // when
        mount(<Navigator location={location} />);
        // then
        const currDir = getCurrentDirectory();
        expect(currDir).toEqual(givenValue);
    });

    it('should save folderId when another folder chosen', () => {
        // given
        const givenValue = 'testt';
        location.historyObject[historyProperties.command] =
            historyProperties.actions.goInside;
        const oldId = 'oldId';
        const recentId = 'newId';
        const givenJson = JSON.stringify([oldId, recentId]);
        sessionStorage.setItem(historyProperties.directoryArray, givenJson);
        location.historyObject[historyProperties.directoryId] = givenValue;
        // when
        mount(<Navigator location={location} />);
        // then
        const currId = getCurrentDirectory();
        expect(currId).toEqual(givenValue);
    });

    it('should remove most recent folderId when go up chosen', () => {
        // given
        const oldId = 'oldId';
        const recentId = 'newId';
        const givenJson = JSON.stringify([oldId, recentId]);
        sessionStorage.setItem(historyProperties.directoryArray, givenJson);
        // when
        location.historyObject[historyProperties.command] =
            historyProperties.actions.goUp;
        mount(<Navigator location={location} />);
        // then
        const currId = getCurrentDirectory();
        expect(currId).toEqual(oldId);
    });

    it('should navigate to authComponent', async () => {
        // given
        const expectedRoute = {
            pathname: '/authenticate',
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

        sessionStorage.setItem(sessionProperties.envUrl, sampleEnvUrl);
        sessionStorage.setItem(sessionProperties.authToken,
            sampleAuthToken);
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

        sessionStorage.setItem(sessionProperties.envUrl, sampleEnvUrl);
        sessionStorage.setItem(sessionProperties.authToken,
            sampleAuthToken);
        sessionStorage.setItem(sessionProperties.projectId,
            sampleProjectId);
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

        sessionStorage.setItem(sessionProperties.envUrl, sampleEnvUrl);
        sessionStorage.setItem(sessionProperties.authToken,
            sampleAuthToken);
        sessionStorage.setItem(sessionProperties.projectId,
            sampleProjectId);
        sessionStorage.setItem(historyProperties.directoryArray,
            JSON.stringify(sampleDirArray));
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

function getCurrentDirectory() {
    const dirJson = sessionStorage
        .getItem(historyProperties.directoryArray);
    const dirArray = JSON.parse(dirJson);
    return dirArray[dirArray.length - 1];
}

