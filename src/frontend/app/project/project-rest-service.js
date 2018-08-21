import di from './project-di';
import { errorHandler } from '../error/error-service';

async function getProjectList(envUrl, authToken) {
    return await di.request.get(envUrl + '/projects')
        .set('x-mstr-authtoken', authToken)
        .withCredentials()
        .then((res) => {
            let projects = res.body;
            return projects;
        })
        .catch((err) => {
            errorHandler(err);
        });
}

export default {
    getProjectList,
};
