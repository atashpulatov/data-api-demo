import { reduxStore } from '../store';
import { sessionProperties } from './session-properties';

class SessionHelper {
    enableLoading = () => {
        reduxStore.dispatch({
            type: sessionProperties.actions.setLoading,
            loading: true,
        });
    }
    disableLoading = () => {
        reduxStore.dispatch({
            type: sessionProperties.actions.setLoading,
            loading: false,
        });
    }
    logout = () => {
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
        window.location.replace('/experimental/index.html');
    }
    saveLoginValues = (values) => {
        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: values.username,
            envUrl: values.envUrl,
            isRememberMeOn: values.isRememberMeOn,
        });
    }
    login = (authToken) => {
        reduxStore.dispatch({
            type: sessionProperties.actions.loggedIn,
            authToken: authToken,
        });
    }
    getSession = () => {
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
