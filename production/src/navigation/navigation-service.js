import { reduxStore } from '../store';

class NavigationService {
  getLoginRoute() {
    return {
      pathname: '/authenticate',
      state: {},
    };
  }

  getProjectsRoute() {
    return { pathname: '/', };
  }

  getObjectsRoute() {
    return { pathname: '/objects', };
  }

  getNavigationRoute() {
    const { envUrl } = reduxStore.getState()
      .sessionReducer;
    const { authToken } = reduxStore.getState()
      .sessionReducer;
    if (!envUrl || !authToken) {
      return this.getLoginRoute();
    }
    const { project } = reduxStore.getState()
      .historyReducer;
    if (!project) {
      return this.getProjectsRoute(envUrl, authToken);
    }
    return this.getObjectsRoute();
  }
}

export const navigationService = new NavigationService();
