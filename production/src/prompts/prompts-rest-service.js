import {reduxStore} from '../store';
import {moduleProxy} from '../module-proxy';

class PromptsRestService {
  async _getPrompts(fullPath, authToken, projectId) {
    return await moduleProxy.request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => {
        return res.body;
      });
  }

  async getReportInstancePrompts(reportId, instanceId) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const projectId = storeState.historyReducer.project.projectId;

    const fullPath = `${envUrl}/reports/${reportId}/instances/${instanceId}/prompts`;
    return this._getPrompts(fullPath, authToken, projectId);
  }

  async getReportPrompts(reportId, projectId) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    // const projectId = storeState.historyReducer.project.projectId;

    const fullPath = `${envUrl}/reports/${reportId}/prompts`;
    return this._getPrompts(fullPath, authToken, projectId);
  }
};

export const promptsRestService = new PromptsRestService();
