import { reduxStore } from "../store";
import { moduleProxy } from "../module-proxy";
import { errorService } from "../error/error-handler";

class PromptsRestService {

    async _getPrompts (fullPath, authToken, projectId) {
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

    async getReportInstancePrompts(reportId, instanceId){
        const storeState = reduxStore.getState();
        const envUrl = storeState.sessionReducer.envUrl;
        const authToken = storeState.sessionReducer.authToken;
        const projectId = storeState.historyReducer.project.projectId;

        let fullPath = `${envUrl}/reports/${reportId}/instances/${instanceId}/prompts`;
        try{
            return this._getPrompts(fullPath, authToken, projectId);
        } catch(error){
            throw errorService.errorRestFactory(err);
        }        
    }

    async getReportPrompts(reportId){
        const storeState = reduxStore.getState();
        const envUrl = storeState.sessionReducer.envUrl;
        const authToken = storeState.sessionReducer.authToken;
        const projectId = storeState.historyReducer.project.projectId;

        let fullPath = `${envUrl}/reports/${reportId}/prompts`;
        try{
            return this._getPrompts(fullPath, authToken, projectId);
        } catch(error){
            throw errorService.errorRestFactory(err);
        }     
    }
};

export const promptsRestService = new PromptsRestService();