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

    saveSessionData(propertiesToSave) {
        if (propertiesToSave[sessionProperties.username]) {
            reduxStore.dispatch({
                type: sessionProperties.actions.logIn,
                username: propertiesToSave[sessionProperties.username],
                envUrl: propertiesToSave[sessionProperties.envUrl],
                isRememberMeOn: propertiesToSave[sessionProperties.isRememberMeOn],
            });
        }
        if (propertiesToSave[sessionProperties.authToken]) {
            reduxStore.dispatch({
                type: sessionProperties.actions.loggedIn,
                authToken: propertiesToSave[sessionProperties.authToken],
            });
        }
        if (propertiesToSave[historyProperties.projectId]) {
            reduxStore.dispatch({
                type: historyProperties.actions.goInsideProject,
                projectId: propertiesToSave[historyProperties.projectId],
                projectName: propertiesToSave[historyProperties.projectName],
            });
            return;
        }
        if (propertiesToSave[historyProperties.directoryId]) {
            reduxStore.dispatch({
                type: historyProperties.actions.goInside,
                dirId: propertiesToSave[historyProperties.directoryId],
            });
        }
    }
}

export const navigationService = new NavigationService();
