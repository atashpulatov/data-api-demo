import projectDI from './project/project-di';
import projectLogic from './project/project-logic';


function NavigationService() { // TODO: rethink the name.
    async function projectsRoute(navigatorInstance) {
        let projects = await projectDI.projectRestService.projectRestService.getProjectList();
        console.log(projects);
        return {
            pathname: '/projects',
            state: {
                projects: projects,
                navigateToProject: projectLogic.navigateToProject,
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
        }
        const currentProject = sessionStorage.getItem('current-project');
        if (currentProject === null) {
            return await projectsRoute();
        }
    };

    return {
        getNavigationRoute,
    };
}

export default new NavigationService();
