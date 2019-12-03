import { historyProperties } from '../history/history-properties';

export class BreadcrumbsService {
  constructor() {
    if (BreadcrumbsService.instance) {
      return BreadcrumbsService.instance;
    }
    BreadcrumbsService.instance = this;
    return this;
  }

  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  getHistoryObjects = () => {
    const historyObjects = [];
    const { project } = this.reduxStore.getState().historyReducer;
    if (!project || !Object.keys(project).length) {
      return historyObjects;
    }
    historyObjects.push(project);
    const directories = this.reduxStore.getState().historyReducer.directoryArray;
    if (!directories || !Object.keys(directories).length) {
      return historyObjects;
    }
    directories.forEach((dir) => {
      historyObjects.push(dir);
    });
    return historyObjects;
  }

  navigateToDir = (dirId) => {
    this.reduxStore.dispatch({
      type: historyProperties.actions.goUpTo,
      dirId,
    });
  };
}

export const breadcrumbsService = new BreadcrumbsService();
