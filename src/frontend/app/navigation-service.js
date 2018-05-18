import projectDI from './project/project-di';

function NavigationService() {
    async function navigateToProjects(navigatorInstance) {
        let projects = await projectDI.projectRestService.projectRestService.getProjectList();
        console.log(projects);
        navigatorInstance.props.history.push({
                pathname: '/projects',
                state: {
                    tarray: projects,
                },
            });
        };

    function navigateToLogin(navigatorInstance) {
        navigatorInstance.props.history.push({
                pathname: '/auth',
                state: {
                },
            });
        };

    this.navigationDispatcher = function() {
            let session = sessionStorage.getItem('x-mstr-authtoken');
            if (session === null) {
                return navigateToLogin;
            }
            return navigateToProjects;
        };
}

export default new NavigationService();
