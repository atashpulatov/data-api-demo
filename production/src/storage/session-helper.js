import { reduxStore } from '../store';
import { sessionProperties } from './session-properties';

class SessionHelper {
    enableLoading() {
        reduxStore.dispatch({
            type: sessionProperties.actions.setLoading,
            loading: true,
        });
    }
    disableLoading() {
        reduxStore.dispatch({
            type: sessionProperties.actions.setLoading,
            loading: false,
        });
    }
    getSession() {
        const currentStore = reduxStore.getState();
        const projectId = currentStore.historyReducer.project
            ? currentStore.historyReducer.project.projectId
            : undefined;
        const session = {
            USE_PROXY: false,
            url: currentStore.sessionReducer.envUrl,
            authToken: currentStore.sessionReducer.authToken,
            projectId,
        };
        return session;
    }
}

export const sessionHelper = new SessionHelper();
