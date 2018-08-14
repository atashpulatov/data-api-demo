import projectRestService from '../project/project-rest-service';
import mstrObjectRestService from '../mstr-object/mstr-object-rest-service';
import { UnauthorizedError } from '../error/unauthorized-error';
import { reduxStore } from '../store';
import { sessionProperties } from '../storage/session-properties';
import { historyProperties } from '../history/history-properties';
import { historyManager } from '../history/history-manager';

const sharedFolderIdType = 7;

class NavigationService { // TODO: rethink the name.
    constructor() {
        this.store = reduxStore;
    };

    getLoginRoute() {
        return {
            pathname: '/authenticate',
            state: {
            },
        };
    };

    async getProjectsRoute(envUrl, authToken) {
        try {
            let projects = await projectRestService
                .getProjectList(envUrl, authToken);
            return {
                pathname: '/projects',
                state: {
                    projects,
                },
            };
        } catch (err) {
            if (err instanceof UnauthorizedError) {
                this.store.dispatch({
                    type: sessionProperties.actions.logOut,
                });
                return this.getLoginRoute();
            }
        }
    };

    async getRootObjectsRoute(envUrl, authToken, projectId) {
        let mstrObjects = await mstrObjectRestService
            .getProjectContent(sharedFolderIdType, envUrl,
                authToken, projectId);
        return {
            pathname: '/objects',
            state: {
                mstrObjects,
            },
        };
    }

    async getObjectsRoute(envUrl, authToken, projectId, folderId) {
        let mstrObjects = await mstrObjectRestService
            .getFolderContent(envUrl, authToken, projectId, folderId);
        return {
            pathname: '/objects',
            state: {
                mstrObjects,
            },
        };
    }

    async getNavigationRoute() {
        const envUrl = this.store.getState()
            .sessionReducer.envUrl;
        const authToken = this.store.getState()
            .sessionReducer.authToken;
        if (!envUrl || !authToken) {
            return this.getLoginRoute();
        }
        const projectId = this.store.getState()
            .historyReducer.projectId;
        if (!projectId) {
            return await this.getProjectsRoute(envUrl, authToken);
        }
        try {
            const dirId = historyManager.getCurrentDirectory();
            return await this.getObjectsRoute(envUrl, authToken,
                projectId, dirId);
        } catch (error) {
            return await this.getRootObjectsRoute(envUrl,
                authToken, projectId);
        }
    }

    saveSessionData(propertiesToSave) {
        if (propertiesToSave[sessionProperties.username]) {
            this.store.dispatch({
                type: sessionProperties.actions.logIn,
                username: propertiesToSave[sessionProperties.username],
                envUrl: propertiesToSave[sessionProperties.envUrl],
                isRememberMeOn: propertiesToSave[sessionProperties.isRememberMeOn],
            });
        }
        if (propertiesToSave[sessionProperties.authToken]) {
            this.store.dispatch({
                type: sessionProperties.actions.loggedIn,
                authToken: propertiesToSave[sessionProperties.authToken],
            });
        }
        if (propertiesToSave[historyProperties.projectId]) {
            this.store.dispatch({
                type: historyProperties.actions.goInsideProject,
                projectId: propertiesToSave[historyProperties.projectId],
            });
            return;
        }
        if (propertiesToSave[historyProperties.directoryId]) {
            this.store.dispatch({
                type: historyProperties.actions.goInside,
                dirId: propertiesToSave[historyProperties.directoryId],
            });
        }
    }
}

const _instance = new NavigationService();
export default _instance;
