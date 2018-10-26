/* eslint-disable */
import { navigationService } from '../../src/navigation/navigation-service';
import { projectRestService } from '../../src/project/project-rest-service';
import { historyProperties } from '../../src/history/history-properties';
import { sessionProperties } from '../../src/storage/session-properties';
import { reduxStore } from '../../src/store';
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
});
