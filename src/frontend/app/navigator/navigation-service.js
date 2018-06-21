import projectRestService from '../project/project-rest-service';
import mstrObjectRestService from '../mstr-object/mstr-object-rest-service';

const sharedFolderIdType = 7;

function NavigationService() { // TODO: rethink the name.
    function getLoginRoute() {
        return {
            pathname: '/auth',
            state: {
            },
        };
    };

    async function getProjectsRoute(envUrl, authToken) {
        let projects = await projectRestService
            .getProjectList(envUrl, authToken);
        return {
            pathname: '/projects',
            state: {
                projects: projects,
            },
        };
    };

    async function getRootObjectsRoute(envUrl, authToken, projectId) {
        // const envUrl = StorageService.getProperty(propertiesEnum['envUrl']);
        // const authToken = StorageService.getProperty(propertiesEnum['authToken']);
        // const projectId = StorageService.getProperty(propertiesEnum['projectId']);
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

    async function getObjectsRoute(envUrl, authToken, projectId, folderId) {
        let mstrObjects = await mstrObjectRestService
            .getFolderContent(envUrl, authToken, projectId, folderId);
        return {
            pathname: '/objects',
            state: {
                mstrObjects,
            },
        };
    }

    return {
        getLoginRoute,
        getProjectsRoute,
        getRootObjectsRoute,
        getObjectsRoute,
    };
}

export default new NavigationService();
