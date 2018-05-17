import projectDI from './project/project-di';

async function navigateToProjects() {
    let projects = await projectDI.projectRestService.projectRestService.getProjectList();
    console.log(projects);
        this.props.history.push({
            pathname: '/projects',
            state: {
                tarray: projects,
            },
        });
    };

function navigateToLogin() {
        this.props.history.push({
            pathname: '/auth',
            state: {

            },
        });
    };

function navigationDispatcher() {
        let session = sessionStorage.getItem('x-mstr-authtoken');
        if (session === null) {
            return navigateToLogin;
        }
        return navigateToProjects;
    };

export default {
    navigationDispatcher,
};
