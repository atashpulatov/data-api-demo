import { projectRestService } from './project-rest-service';
import { reduxStore } from '../store';
import { sessionProperties } from '../storage/session-properties';
import { UnauthorizedError } from '../error/unauthorized-error';
import { historyProperties } from '../history/history-properties';
import { officeApiHelper } from '../office/office-api-helper';
import { EnvironmentNotFoundError } from '../error/environment-not-found-error';
import { errorService } from '../error/error-handler';

class ProjectListHelper {
    async updateProjectList() {
            const envUrl = reduxStore.getState().sessionReducer.envUrl;
            const authToken = reduxStore.getState().sessionReducer.authToken;
            return await projectRestService
                .getProjectList(envUrl, authToken);

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
