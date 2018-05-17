import di from './project-di';

async function getProjectList() {
    const envUrl = sessionStorage.getItem('envUrl');
    const token = sessionStorage.getItem('x-mstr-authtoken');
    return await di.request.get(envUrl + '/projects')
            .set('x-mstr-authtoken', token)
            .withCredentials()
            .then((res) => {
                console.log(res);
                let projects = res.body;
                return projects;
            })
        .catch((err) => {
        console.error(`Error: ${err.response.status}`
            + ` (${err.response.statusMessage})`);
        });
}

export let projectRestService = {
    'getProjectList': getProjectList,
};
