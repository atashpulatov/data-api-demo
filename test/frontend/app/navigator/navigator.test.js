/* eslint-disable */
import React from 'react';
import Navigator from '../../../../src/frontend/app/navigator/navigator';
import { mount } from 'enzyme';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import projectRestService from '../../../../src/frontend/app/project/project-rest-service';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import { reduxStore } from '../../../../src/frontend/app/store';
import { historyManager } from '../../../../src/frontend/app/history/history-manager';
/* eslint-enable */

describe('navigator', () => {
    const originalPushMethod = Navigator.prototype.pushHistory;
    const sampleEnvUrl = 'someEnvUrl';
    const sampleAuthToken = 'someAuthToken';
    const sampleUsername = 'someUsername';
    const sampleProjectId = 'someProjectId';
    const sampleProjectName = 'someProjectName';
    const sampleDirArray = ['oldDir', 'newDir'];

    const location = {};
    beforeAll(() => {
        location.pathname = '/';
    });

    beforeEach(() => {
        // default state should be empty
        expect(reduxStore.getState().historyReducer).toEqual({});
        expect(reduxStore.getState().sessionReducer).toEqual({});

        Navigator.prototype.pushHistory = jest.fn();
        location.sessionObject = {};
        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: sampleUsername,
            envUrl: sampleEnvUrl,
            isRememberMeOn: false,
        });
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
        location.historyObject = {};
    });

    afterEach(() => {
        location.sessionObject = undefined;
        location.historyObject = undefined;

        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
    });

    afterAll(() => {
        Navigator.prototype.pushHistory = originalPushMethod;
    });

    it('should save authToken', () => {
        // given
        const expectedAuthToken = 'testt';
        location.sessionObject[sessionProperties.authToken] = expectedAuthToken;
        // when
        mount(<Navigator location={location} />);
        // then
        expect(reduxStore.getState()
            .sessionReducer.authToken)
            .toEqual(expectedAuthToken);
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
        const currDir = historyManager.getCurrentDirectory();
        expect(currDir).toEqual(givenValue);
    });

    it('should save folderId when another folder chosen', () => {
        // given
        const givenValue = 'testt';
        location.historyObject[historyProperties.command] =
            historyProperties.actions.goInside;
        const oldId = 'oldId';
        const newId = 'newId';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: oldId,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: newId,
        });
        location.historyObject[historyProperties.directoryId] = givenValue;
        // when
        mount(<Navigator location={location} />);
        // then
        const currId = historyManager.getCurrentDirectory();
        expect(currId).toEqual(givenValue);
    });

    it('should remove most recent folderId when go up chosen', () => {
        // given
        const oldId = 'oldId';
        const recentId = 'newId';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: oldId,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: recentId,
        });
        // when
        location.historyObject[historyProperties.command] =
            historyProperties.actions.goUp;
        mount(<Navigator location={location} />);
        // then
        const currId = historyManager.getCurrentDirectory();
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

        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: sampleUsername,
            envUrl: sampleEnvUrl,
            isRememberMeOn: false,
        });
        reduxStore.dispatch({
            type: sessionProperties.actions.loggedIn,
            authToken: sampleAuthToken,
        });

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

        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: sampleUsername,
            envUrl: sampleEnvUrl,
            isRememberMeOn: false,
        });
        reduxStore.dispatch({
            type: sessionProperties.actions.loggedIn,
            authToken: sampleAuthToken,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: sampleProjectId,
            projectName: sampleProjectName,
        });
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

        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: sampleUsername,
            envUrl: sampleEnvUrl,
            isRememberMeOn: false,
        });
        reduxStore.dispatch({
            type: sessionProperties.actions.loggedIn,
            authToken: sampleAuthToken,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: sampleProjectId,
            projectName: sampleProjectName,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: sampleDirArray[0],
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: sampleDirArray[1],
        });
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

