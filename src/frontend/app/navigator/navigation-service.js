import projectRestService from '../project/project-rest-service';
import mstrObjectRestService from '../mstr-object/mstr-object-rest-service';
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
        let mstrObjects = await mstrObjectRestService
            .getProjectContent(sharedFolderIdType);
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
        const projectId = sessionStorage.getItem(propertiesEnum.projectId);
        if (projectId === null) {
            return await projectsRoute();
        }
        return await objectsRoute();
    };

    return {
        getNavigationRoute,
    };
}

export default new NavigationService();
