import { reduxStore } from '../store';
import { moduleProxy } from '../module-proxy';

class PromptsRestService {
  constructor(proxy) {
    this.moduleProxy = proxy;
  }

  getPrompts(fullPath, authToken, projectId) {
    return this.moduleProxy.request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  }

  getReportInstancePrompts(reportId, instanceId) {
    const storeState = reduxStore.getState();
    const { envUrl } = storeState.sessionReducer;
    const { authToken } = storeState.sessionReducer;
    const { projectId } = storeState.historyReducer.project;

    const fullPath = `${envUrl}/reports/${reportId}/instances/${instanceId}/prompts`;
    return this.getPrompts(fullPath, authToken, projectId);
  }

  getReportPrompts(reportId, projectId) {
    const storeState = reduxStore.getState();
    const { envUrl } = storeState.sessionReducer;
    const { authToken } = storeState.sessionReducer;
    // const projectId = storeState.historyReducer.project.projectId;

    const fullPath = `${envUrl}/reports/${reportId}/prompts`;
    return this.getPrompts(fullPath, authToken, projectId);
  }
}

export const promptsRestService = new PromptsRestService(moduleProxy);
