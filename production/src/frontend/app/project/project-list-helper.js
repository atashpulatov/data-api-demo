import { projectRestService } from './project-rest-service';
import { reduxStore } from '../store';
import { sessionProperties } from '../storage/session-properties';
import { UnauthorizedError } from '../error/unauthorized-error';
import { historyProperties } from '../history/history-properties';
import { officeApiHelper } from '../office/office-api-helper';
import { sessionHelper } from '../storage/session-helper';

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

    async projectChosen(projectId, projectName) {
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: projectId,
            projectName: projectName,
        });
        await officeApiHelper.loadExistingReportBindingsExcel();
    }
}

export const projectListHelper = new ProjectListHelper();
