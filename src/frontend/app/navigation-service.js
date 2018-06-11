import projectDI from './project/project-di';

function NavigationService() { // TODO: rethink the name.
    async function projectsRoute(navigatorInstance) {
        let projects = await projectDI.projectRestService.projectRestService.getProjectList();
        console.log(projects);
        return {
            pathname: '/projects',
            state: {
                projects: projects,
            },
        };
    };

    function loginRoute(navigatorInstance) {
        return {
            pathname: '/auth',
            state: {
            },
        };
    };

    async function getNavigationRoute() {
        const session = sessionStorage.getItem('x-mstr-authtoken');
        if (session === null) {
            return loginRoute();
        } // o-mstr-name
        const currentProject = sessionStorage.getItem('x-mstr-projectid');
        if (currentProject === null) {
            return await projectsRoute();
        }
    };

    return {
        getNavigationRoute,
    };
}

export default new NavigationService();
