import projectRestService from '../project/project-rest-service';
import mstrObjectRestService from '../mstr-object/mstr-object-rest-service';
import propertiesEnum from '../storage/properties-enum';
import StorageService from '../storage/storage-service';

const sharedFolderIdType = 7;

function NavigationService() { // TODO: rethink the name.
    async function projectsRoute() {
        let projects = await projectRestService.getProjectList();
        return {
            pathname: '/projects',
            state: {
                projects: projects,
            },
        };
    };

    function loginRoute() {
        return {
            pathname: '/auth',
            state: {
            },
        };
    };

    async function rootObjectsRoute() {
        const envUrl = StorageService.getProperty(propertiesEnum['envUrl']);
        const authToken = StorageService.getProperty(propertiesEnum['authToken']);
        const projectId = StorageService.getProperty(propertiesEnum['projectId']);
        let mstrObjects = await mstrObjectRestService
            .getProjectContent(sharedFolderIdType, envUrl, authToken, projectId);
        return {
            pathname: '/objects',
            state: {
                mstrObjects,
            },
        };
    }

    async function objectsRoute() {
        const envUrl = StorageService.getProperty(propertiesEnum['envUrl']);
        const authToken = StorageService.getProperty(propertiesEnum['authToken']);
        const folderId = StorageService.getProperty(propertiesEnum['folderId']);
        const projectId = StorageService.getProperty(propertiesEnum['projectId']);
        let mstrObjects = await mstrObjectRestService
            .getFolderContent(envUrl, authToken, folderId, projectId);
        return {
            pathname: '/objects',
            state: {
                mstrObjects,
            },
        };
    }

    async function getNavigationRoute() {
        const authToken = sessionStorage.getItem(propertiesEnum.authToken);
        if (authToken === null) {
            return loginRoute();
        }
        const folderId = sessionStorage.getItem(propertiesEnum.folderId);
        if (folderId !== null) {
            return await objectsRoute();
        }
        const projectId = sessionStorage.getItem(propertiesEnum.projectId);
        if (projectId === null) {
            return await projectsRoute();
        }
        return await rootObjectsRoute();
    };

    return {
        getNavigationRoute,
    };
}

export default new NavigationService();
