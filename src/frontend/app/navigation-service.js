import projectDI from './project/project-di';

function NavigationService() { // TODO: rethink the name.
    async function projectsRoute(navigatorInstance) {
        let projects = await projectDI.projectRestService.projectRestService.getProjectList();
        console.log(projects);
        return {
                pathname: '/projects',
                state: {
                    tarray: projects,
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

    this.getNavigationRoute = async function() {
            let session = sessionStorage.getItem('x-mstr-authtoken');
            if (session === null) {
                return loginRoute();
            }
            return await projectsRoute();
        };
}

export default new NavigationService();
