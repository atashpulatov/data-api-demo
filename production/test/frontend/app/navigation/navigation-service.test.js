/* eslint-disable */
import { navigationService } from '../../../../src/frontend/app/navigation/navigation-service';
import { projectRestService } from '../../../../src/frontend/app/project/project-rest-service';
import { projects } from '../project/mock-data';
import { mstrObjectRestService } from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import { mstrTutorial } from '../mockData';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { UnauthorizedError } from '../../../../src/frontend/app/error/unauthorized-error';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { reduxStore } from '../../../../src/frontend/app/store';
/* eslint-enable */

describe('NavigatorService', () => {
    beforeAll(() => {
        expect(reduxStore.getState().sessionReducer.envUrl).toBeFalsy();
        expect(reduxStore.getState().sessionReducer.authToken).toBeFalsy();
    });

    afterAll(() => {
        projectRestService.getProjectList = _originalGetProjectList;
        navigationService.store = originalStore;
    });

    it('should give a path object to authentication page', () => {
        // when
        const pathObject = navigationService.getLoginRoute();
        // then
        expect(pathObject).toBeDefined();
        expect(pathObject.pathname).toBeDefined();
        expect(pathObject.pathname).toContain('/auth');
        expect(pathObject.state).toBeDefined();
    });

    it('should give a path object to project page',
        () => {
            // when
            const pathObject = navigationService.getProjectsRoute();
            // then
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/');
            expect(pathObject.state).not.toBeDefined();
        });

    // it('should call logout if client is Unauthorized', () => {
    //     // when
    //     const mockedMethod = projectRestService.getProjectList;
    //     const pathObject = navigationService
    //         .getProjectsRoute(envUrl, authToken);
    //     // then
    //     expect(navigationService.store.dispatch).toBeCalledWith({
    //         type: sessionProperties.actions.logOut,
    //     });
    //     expect(pathObject).toEqual({
    //         pathname: '/authenticate',
    //         state: {},
    //     });
    //     projectRestService.getProjectList = mockedMethod;
    // });

    it('should give a path object to folder contents', () => {
        // when
        const pathObject = navigationService.getObjectsRoute();
        // then
        expect(pathObject).toBeDefined();
        expect(pathObject.pathname).toBeDefined();
        expect(pathObject.pathname).toContain('/objects');
        expect(pathObject.state).not.toBeDefined();
    });

    it('should call for login route when no token', () => {
        const originalMethod = navigationService.getLoginRoute;
        // given
        try {
            const expected = {
                prop: 'expect',
            };
            navigationService.getLoginRoute = jest.fn();
            navigationService.getLoginRoute.mockReturnValueOnce(expected);
            // when
            const result = navigationService.getNavigationRoute();
            expect(result).toBeDefined();
            expect(result).toBe(expected);
        } finally {
            navigationService.getLoginRoute = originalMethod;
        }
    });

    it('should call for projects route when env and token present', () => {
        const originalMethod = navigationService.getProjectsRoute;
        // given
        try {
            reduxStore.dispatch({
                type: sessionProperties.actions.logIn,
                username: 'usr',
                envUrl: 'env',
                isRememberMeOn: true,
            });
            reduxStore.dispatch({
                type: sessionProperties.actions.loggedIn,
                authToken: 'token',
            });
            const expected = {
                prop: 'expect',
            };
            navigationService.getProjectsRoute = jest.fn();
            navigationService.getProjectsRoute.mockReturnValueOnce(expected);
            // when
            const result = navigationService.getNavigationRoute();
            expect(result).toBeDefined();
            expect(result).toBe(expected);
        } finally {
            navigationService.getProjectsRoute = originalMethod;
        }
    });

    it('should call for projects route when env, token and project present',
        () => {
            const originalMethod = navigationService.getObjectsRoute;
            // given
            try {
                reduxStore.dispatch({
                    type: sessionProperties.actions.logIn,
                    username: 'usr',
                    envUrl: 'env',
                    isRememberMeOn: true,
                });
                reduxStore.dispatch({
                    type: sessionProperties.actions.loggedIn,
                    authToken: 'token',
                });
                reduxStore.dispatch({
                    type: historyProperties.actions.goInsideProject,
                    projectId: 'id',
                    projectName: 'name',
                });
                const expected = {
                    prop: 'expect',
                };
                navigationService.getObjectsRoute = jest.fn();
                navigationService.getObjectsRoute.mockReturnValueOnce(expected);
                // when
                const result = navigationService.getNavigationRoute();
                expect(result).toBeDefined();
                expect(result).toBe(expected);
            } finally {
                navigationService.getObjectsRoute = originalMethod;
            }
        });

    // describe('saveSessionData', () => {
    //     it('should call store to save username, envUrl and isRememberMeOn', () => {
    //         // given
    //         const store = navigationService.store;
    //         const someUsername = 'someUsername';
    //         const isRememberMeOn = false;
    //         const propertiesToSave = {};
    //         propertiesToSave[sessionProperties.username] = someUsername;
    //         propertiesToSave[sessionProperties.envUrl] = envUrl;
    //         propertiesToSave[sessionProperties.isRememberMeOn] = isRememberMeOn;
    //         const dispatchAction = {
    //             type: sessionProperties.actions.logIn,
    //             username: someUsername,
    //             envUrl: envUrl,
    //             isRememberMeOn: isRememberMeOn,
    //         };
    //         // when
    //         navigationService.saveSessionData(propertiesToSave);
    //         // then
    //         expect(store.dispatch).toHaveBeenCalled();
    //         expect(store.dispatch).toHaveBeenCalledWith(dispatchAction);
    //     });

    //     it('should call store to save authToken', () => {
    //         // given
    //         const store = navigationService.store;
    //         const propertiesToSave = {};
    //         propertiesToSave[sessionProperties.authToken] = authToken;
    //         const dispatchAction = {
    //             type: sessionProperties.actions.loggedIn,
    //             authToken: authToken,
    //         };
    //         // when
    //         navigationService.saveSessionData(propertiesToSave);
    //         // then
    //         expect(store.dispatch).toHaveBeenCalled();
    //         expect(store.dispatch).toHaveBeenCalledWith(dispatchAction);
    //     });

    //     it('should call store to save projectId', () => {
    //         // given
    //         const store = navigationService.store;
    //         const someProjectId = 'someProjectId';
    //         const propertiesToSave = {};
    //         propertiesToSave[historyProperties.projectId] = someProjectId;
    //         propertiesToSave[historyProperties.projectName] = projectName;
    //         const dispatchAction = {
    //             type: historyProperties.actions.goInsideProject,
    //             projectId: someProjectId,
    //             projectName: projectName,
    //         };
    //         // when
    //         navigationService.saveSessionData(propertiesToSave);
    //         // then
    //         expect(store.dispatch).toHaveBeenCalled();
    //         expect(store.dispatch).toHaveBeenCalledWith(dispatchAction);
    //     });

    //     it('should call store to save directoryId', () => {
    //         // given
    //         const store = navigationService.store;
    //         const someDirId = 'someDirId';
    //         const propertiesToSave = {};
    //         propertiesToSave[historyProperties.directoryId] = someDirId;
    //         const dispatchAction = {
    //             type: historyProperties.actions.goInside,
    //             dirId: someDirId,
    //         };
    //         // when
    //         navigationService.saveSessionData(propertiesToSave);
    //         // then
    //         expect(store.dispatch).toHaveBeenCalled();
    //         expect(store.dispatch).toHaveBeenCalledWith(dispatchAction);
    //     });
    // });
});
