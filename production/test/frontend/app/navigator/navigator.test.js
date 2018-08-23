/* eslint-disable */
import React from 'react';
import { Navigator } from '../../../../src/frontend/app/navigator/navigator';
import { mount } from 'enzyme';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { projectRestService } from '../../../../src/frontend/app/project/project-rest-service';
import { mstrObjectRestService } from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
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
    const sampleDirArray = [
        { dirId: 'oldId', dirName: 'oldName' },
        { dirId: 'newId', dirName: 'newDir' },
    ];

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
        const givenName = 'testName';
        location.historyObject[historyProperties.command] =
            historyProperties.actions.goInside;
        location.historyObject[historyProperties.directoryId] = givenValue;
        location.historyObject[historyProperties.directoryName] = givenName;
        // when
        mount(<Navigator location={location} />);
        // then
        const currDir = historyManager.getCurrentDirectory();
        expect(currDir.dirId).toEqual(givenValue);
    });

    it('should save folderId when another folder chosen', () => {
        // given
        location.historyObject[historyProperties.command] =
            historyProperties.actions.goInside;
        const oldId = 'oldId';
        const oldName = 'oldName';
        const newId = 'newId';
        const newName = 'newName';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: oldId,
            dirName: oldName,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: newId,
            dirName: newName,
        });
        // location.historyObject[historyProperties.directoryId] = givenValue;
        // when
        mount(<Navigator location={location} />);
        // then
        const currDir = historyManager.getCurrentDirectory();
        expect(currDir.dirId).toEqual(newId);
    });

    it('should remove most recent folderId when go up chosen', () => {
        // given
        const oldDir = {
            dirId: 'oldId',
            dirName: 'oldName',
        };
        const recentDir = {
            dirId: 'newId',
            dirName: 'newName',
        };
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: oldDir.dirId,
            dirName: oldDir.dirName,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: recentDir.dirId,
            dirName: recentDir.dirName,
        });
        // when
        location.historyObject[historyProperties.command] =
            historyProperties.actions.goUp;
        mount(<Navigator location={location} />);
        // then
        const currDir = historyManager.getCurrentDirectory();
        expect(currDir.dirId).toEqual(oldDir.dirId);
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
            dirId: sampleDirArray[0].dirId,
            dirName: sampleDirArray[0].dirName,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: sampleDirArray[1].dirId,
            dirName: sampleDirArray[1].dirName,
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

