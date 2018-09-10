import { projectRestService } from './project-rest-service';
import { reduxStore } from '../store';
import { sessionProperties } from '../storage/session-properties';
import { UnauthorizedError } from '../error/unauthorized-error';
import { historyProperties } from '../history/history-properties';

class ProjectListHelper {
    async updateProjectList() {
        try {
            const envUrl = reduxStore.getState().sessionReducer.envUrl;
            const authToken = reduxStore.getState().sessionReducer.authToken;
            return await projectRestService
                .getProjectList(envUrl, authToken);
        } catch (err) {
            if (err instanceof UnauthorizedError) {
                reduxStore.dispatch({
                    type: sessionProperties.actions.logOut,
                });
                return [];
            } else {
                throw err;
            }
        };
    }

    projectChosen(projectId, projectName) {
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: projectId,
            projectName: projectName,
        });
    }
}

export const projectListHelper = new ProjectListHelper();
