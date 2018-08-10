import projectRestService from '../project/project-rest-service';
import mstrObjectRestService from '../mstr-object/mstr-object-rest-service';
import { UnauthorizedError } from '../error/unauthorized-error';
import { reduxStore } from '../store';
import { sessionProperties } from '../storage/session-properties';

const sharedFolderIdType = 7;

class NavigationService { // TODO: rethink the name.
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
                reduxStore.dispatch({
                    type: sessionProperties.actions.logOut,
                });
                this.getLoginRoute();
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
}

const _instance = new NavigationService();
export default _instance;
