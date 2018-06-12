import projectRestService from '../project/project-rest-service';
import mstrObjectRestService from '../mstr-object/mstr-object-rest-service';

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
        let objects = await mstrObjectRestService.getProjectContent();
        return {
            pathname: '/objects',
            state: {
                objects: objects,
            },
        };
    }

    async function getNavigationRoute() {
        const authToken = sessionStorage.getItem('x-mstr-authtoken');
        if (authToken === null) {
            return loginRoute();
        } // o-mstr-name
        const projectId = sessionStorage.getItem('x-mstr-projectid');
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
