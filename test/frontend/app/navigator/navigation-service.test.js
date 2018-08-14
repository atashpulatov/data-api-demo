/* eslint-disable */
import NavigationService from '../../../../src/frontend/app/navigator/navigation-service';
import projectRestService from '../../../../src/frontend/app/project/project-rest-service';
import { projects } from '../project/mock-data';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import { mstrTutorial } from '../mockData';
import sessionPropertiesEnum, { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { reduxStore } from '../../../../src/frontend/app/store';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { UnauthorizedError } from '../../../../src/frontend/app/error/unauthorized-error';
/* eslint-enable */

describe('NavigatorService', () => {
    // given
    const envUrl = 'someEnvUrl';
    const authToken = 'someAuthToken';
    const projectId = 'someProjectId';

    let _originalGetProjectList;
    let _originalGetProjectContent;
    let _originalGetFolderContent;

    let originalStore = {};
    const thunk = ({ dispatch, getState }) => (next) => (action) => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        }
        return next(action);
    };

    const create = () => {
        const store = {
            getState: jest.fn(() => ({})),
            dispatch: jest.fn(),
        };
        const next = jest.fn();

        const invoke = (action) => thunk(store)(next)(action);

        return { store, next, invoke };
    };

    beforeAll(() => {
        _originalGetProjectList = projectRestService.getProjectList;
        projectRestService.getProjectList = jest
            .fn()
            .mockImplementationOnce(() => {
                return projects.projectsArray;
            })
            .mockImplementationOnce(() => {
                throw new UnauthorizedError();
            });

        _originalGetProjectContent = mstrObjectRestService.getProjectContent;
        mstrObjectRestService.getProjectContent = jest.fn();
        mstrObjectRestService.getProjectContent
            .mockResolvedValue(mstrTutorial);

        _originalGetFolderContent = mstrObjectRestService.getFolderContent;
        mstrObjectRestService.getFolderContent = jest.fn();
        mstrObjectRestService.getFolderContent.mockReturnValue('ProperContent');

        originalStore = NavigationService.store;
        const { store } = create();
        NavigationService.store = store;
    });

    afterAll(() => {
        projectRestService.getProjectList = _originalGetProjectList;
        mstrObjectRestService.getProjectContent = _originalGetProjectContent;
        mstrObjectRestService.getFolderContent = _originalGetFolderContent;
        NavigationService.store = originalStore;
    });

    it('should give a path object to authentication page',
        async () => {
            // when
            const pathObject = NavigationService.getLoginRoute();
            // then
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/auth');
            expect(pathObject.state).toBeDefined();
        });

    it('should give a path object to project page',
        async () => {
            // when
            const pathObject = await NavigationService
                .getProjectsRoute(envUrl, authToken);
            // then
            expect(projectRestService.getProjectList)
                .toBeCalledWith(envUrl, authToken);
            expect(authToken).toBeDefined();
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/projects');
            expect(pathObject.state.projects).toBeDefined();
            expect(pathObject.state.projects.length).toBeGreaterThan(1);
            expect(pathObject.state.projects[0]).toHaveProperty('id');
            expect(pathObject.state.projects[0]).toHaveProperty('name');
            expect(pathObject.state.projects[0]).toHaveProperty('alias');
            expect(pathObject.state.projects[0]).toHaveProperty('description');
            expect(pathObject.state.projects[0]).toHaveProperty('status');
        });

    it('should call logout if client is Unauthorized',
        async () => {
            // when
            const mockedMethod = projectRestService.getProjectList;
            const pathObject = await NavigationService
                .getProjectsRoute(envUrl, authToken);
            // then
            expect(NavigationService.store.dispatch).toBeCalledWith({
                type: sessionProperties.actions.logOut,
            });
            expect(pathObject).toEqual({
                pathname: '/authenticate',
                state: {},
            });
            projectRestService.getProjectList = mockedMethod;
        });

    it('should give a path object to project contents',
        async () => {
            // given
            const folderType = 7;
            // when
            const pathObject = await NavigationService
                .getRootObjectsRoute(envUrl, authToken, projectId);
            // then
            expect(mstrObjectRestService.getProjectContent)
                .toBeCalledWith(folderType, envUrl, authToken, projectId);
            expect(authToken).toBeDefined();
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/objects');
            const pathObjectSet = pathObject.state.mstrObjects;
            expect(pathObjectSet).toBeDefined();
            expect(pathObjectSet.length).toBeGreaterThan(1);
            expect(pathObjectSet[0]).toHaveProperty('id');
            expect(pathObjectSet[0]).toHaveProperty('name');
            expect(pathObjectSet[0]).toHaveProperty('type');
            expect(pathObjectSet[0]).toHaveProperty('description');
            expect(pathObjectSet[0]).toHaveProperty('subtype');
            expect(pathObjectSet[0]).toHaveProperty('dateCreated');
            expect(pathObjectSet[0]).toHaveProperty('dateModified');
            expect(pathObjectSet[0]).toHaveProperty('version');
        });

    it('should give a path object to folder contents',
        async () => {
            // given
            const folderId = 'someFolderId';
            // when
            const pathObject = await NavigationService.getObjectsRoute(envUrl, authToken, projectId, folderId);
            // then
            expect(mstrObjectRestService.getFolderContent)
                .toBeCalledWith(envUrl, authToken, projectId, folderId);
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/objects');
            const pathObjectSet = pathObject.state.mstrObjects;
            expect(pathObjectSet).toBeDefined();
            expect(pathObjectSet.length).toBeGreaterThan(1);
            expect(pathObjectSet).toContain('ProperContent');
        });

    describe('saveSessionData', () => {
        it('should call store to save username, envUrl and isRememberMeOn', () => {
            // given
            const store = NavigationService.store;
            const someUsername = 'someUsername';
            const isRememberMeOn = false;
            const propertiesToSave = {};
            propertiesToSave[sessionProperties.username] = someUsername;
            propertiesToSave[sessionProperties.envUrl] = envUrl;
            propertiesToSave[sessionProperties.isRememberMeOn] = isRememberMeOn;
            const dispatchAction = {
                type: sessionProperties.actions.logIn,
                username: someUsername,
                envUrl: envUrl,
                isRememberMeOn: isRememberMeOn,
            };
            // when
            NavigationService.saveSessionData(propertiesToSave);
            // then
            expect(store.dispatch).toHaveBeenCalled();
            expect(store.dispatch).toHaveBeenCalledWith(dispatchAction);
        });

        it('should call store to save authToken', () => {
            // given
            const store = NavigationService.store;
            const propertiesToSave = {};
            propertiesToSave[sessionProperties.authToken] = authToken;
            const dispatchAction = {
                type: sessionProperties.actions.loggedIn,
                authToken: authToken,
            };
            // when
            NavigationService.saveSessionData(propertiesToSave);
            // then
            expect(store.dispatch).toHaveBeenCalled();
            expect(store.dispatch).toHaveBeenCalledWith(dispatchAction);
        });

        it('should call store to save projectId', () => {
            // given
            const store = NavigationService.store;
            const someProjectId = 'someProjectId';
            const propertiesToSave = {};
            propertiesToSave[historyProperties.projectId] = someProjectId;
            const dispatchAction = {
                type: historyProperties.actions.goInsideProject,
                projectId: someProjectId,
            };
            // when
            NavigationService.saveSessionData(propertiesToSave);
            // then
            expect(store.dispatch).toHaveBeenCalled();
            expect(store.dispatch).toHaveBeenCalledWith(dispatchAction);
        });

        it('should call store to save directoryId', () => {
            // given
            const store = NavigationService.store;
            const someDirId = 'someDirId';
            const propertiesToSave = {};
            propertiesToSave[historyProperties.directoryId] = someDirId;
            const dispatchAction = {
                type: historyProperties.actions.goInside,
                dirId: someDirId,
            };
            // when
            NavigationService.saveSessionData(propertiesToSave);
            // then
            expect(store.dispatch).toHaveBeenCalled();
            expect(store.dispatch).toHaveBeenCalledWith(dispatchAction);
        });
    });
});
