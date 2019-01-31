import { projectRestService } from './project-rest-service';
import { reduxStore } from '../store';
import { historyProperties } from '../history/history-properties';
import { officeApiHelper } from '../office/office-api-helper';
import { errorService } from '../error/error-handler';

class ProjectListHelper {
    updateProjectList = async () => {
        const envUrl = reduxStore.getState().sessionReducer.envUrl;
        const authToken = reduxStore.getState().sessionReducer.authToken;
        return await projectRestService
            .getProjectList(envUrl, authToken);

    }

    projectChosen = async (projectId, projectName) => {
        try {
            this.saveProjectToStore(projectId, projectName);
            await officeApiHelper.loadExistingReportBindingsExcel();
        } catch (error) {
            errorService.handleOfficeError(error);
        }
    }

    saveProjectToStore = (projectId, projectName) => {
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: projectId,
            projectName: projectName,
        });
    }
}

export const projectListHelper = new ProjectListHelper();
