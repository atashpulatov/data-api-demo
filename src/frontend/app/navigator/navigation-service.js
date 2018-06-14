import projectRestService from '../project/project-rest-service';
import mstrObjectRestService from '../mstr-object/mstr-object-rest-service';
import StorageService from '../storage/storage-service';
import propertiesEnum from '../storage/properties-enum';

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

    async function objectsRoute() {
        let objects = await mstrObjectRestService
                                .getProjectContent(sharedFolderIdType);
        return {
            pathname: '/objects',
            state: {
                objects: objects,
            },
        };
    }

    async function getNavigationRoute() {
        const authToken = StorageService.getProperty(propertiesEnum['authToken']);
        if (authToken === null) {
            return loginRoute();
        } // o-mstr-name
        const projectId = StorageService.getProperty(propertiesEnum['projectId']);
        if (projectId === null) {
            return await projectsRoute();
        } else {
            return await objectsRoute();
        }
    };

    return {
        getNavigationRoute,
    };
}

export default new NavigationService();
