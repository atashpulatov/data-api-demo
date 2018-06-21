import di from './project-di';

async function getProjectList(envUrl, authToken) {
    return await di.request.get(envUrl + '/projects')
            .set('x-mstr-authtoken', authToken)
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

export default {
    getProjectList,
};
