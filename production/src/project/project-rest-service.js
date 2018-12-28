import { errorService } from '../error/error-handler';
import { moduleProxy } from '../module-proxy';

class ProjectRestService {
    async getProjectList(envUrl, authToken) {
        return await moduleProxy.request
            .get(envUrl + '/projects')
            .set('x-mstr-authtoken', authToken)
            .withCredentials()
            .then((res) => {
                const projects = res.body;
                return projects;
            })
            .catch((err) => {
                errorService.errorRestFactory(err);
            });
    }
}

export const projectRestService = new ProjectRestService();
