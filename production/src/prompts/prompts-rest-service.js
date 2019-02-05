import { reduxStore } from "../store";
import { moduleProxy } from "../module-proxy";
import { errorService } from "../error/error-handler";
import { mstrObjectRestService } from "../mstr-object/mstr-object-rest-service";

class PromptsRestService {

    async _getInstancePrompts (fullPath, authToken, projectId) {
        return await moduleProxy.request
            .get(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                return res.body;
            })
            .catch((err) => {
                throw errorService.errorRestFactory(err);
            });
    }

    async getReportPrompts(reportId){
        const storeState = reduxStore.getState();
        const envUrl = storeState.sessionReducer.envUrl;
        const authToken = storeState.sessionReducer.authToken;
        const projectId = storeState.historyReducer.project.projectId;

        let fullInstancePath = `${envUrl}/reports/${reportId}/instances`;
        const instanceId = await mstrObjectRestService._getInstanceId(fullInstancePath, authToken, projectId);

        let fullPath = `${envUrl}/reports/${reportId}/instances/${instanceId}/prompts`;
        return this._getInstancePrompts(fullPath, authToken, projectId);
    }
};

export const promptsRestService = new PromptsRestService();