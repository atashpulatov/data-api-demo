import { errorHandler } from '../error/error-service';
import { moduleProxy } from '../module-proxy';

class ProjectRestService {
    async getProjectList(envUrl, authToken) {
        return await moduleProxy.request
            .get(envUrl + '/projects')
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
}

export const projectRestService = new ProjectRestService();
