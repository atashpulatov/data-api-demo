import { reduxStore } from '../store';

class BreadcrumbsService {
    getHistoryObjects() {
        const historyObjects = [];
        const project = reduxStore.getState().historyReducer.project;
        if (!project || !Object.keys(project).length) {
            return historyObjects;
        }
        historyObjects.push(project);
        const directories = reduxStore.getState().historyReducer.directoryArray;
        if (!directories || !Object.keys(directories).length) {
            return historyObjects;
        }
        directories.forEach((dir) => {
            historyObjects.push(dir);
        });
        return historyObjects;
    }
}

export const breadcrumbsService = new BreadcrumbsService();
