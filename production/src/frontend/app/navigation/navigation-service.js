import { reduxStore } from '../store';
import { sessionProperties } from '../storage/session-properties';
import { historyProperties } from '../history/history-properties';

class NavigationService {
    getLoginRoute() {
        return {
            pathname: '/authenticate',
            state: {
            },
        };
    };

    getProjectsRoute() {
        return {
            pathname: '/',
        };
    };

    getObjectsRoute() {
        return {
            pathname: '/objects',
        };
    }

    getNavigationRoute() {
        const envUrl = reduxStore.getState()
            .sessionReducer.envUrl;
        const authToken = reduxStore.getState()
            .sessionReducer.authToken;
        if (!envUrl || !authToken) {
            return this.getLoginRoute();
        }
        const project = reduxStore.getState()
            .historyReducer.project;
        if (!project) {
            return this.getProjectsRoute(envUrl, authToken);
        }
        return this.getObjectsRoute();
    }
}

export const navigationService = new NavigationService();
