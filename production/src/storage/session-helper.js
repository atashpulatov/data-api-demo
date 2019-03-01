import { reduxStore } from '../store';
import { sessionProperties } from './session-properties';
import { authenticationService } from '../authentication/auth-rest-service';
import { errorService } from '../error/error-handler';

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
  logOut = () => {
    reduxStore.dispatch({
      type: sessionProperties.actions.logOut,
    });
  }
  logOutRest = async () => {
    const authToken = reduxStore.getState().sessionReducer.authToken;
    const envUrl = reduxStore.getState().sessionReducer.envUrl;
    try {
      await authenticationService.logout(envUrl, authToken);
    } catch (error) {
      errorService.handleLogoutError(error);
    };
  }
  logOutRedirect = () => {
    window.location.replace('/mstr-office-loader/build/index.html');
  }
  saveLoginValues = (values) => {
    reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      envUrl: values.envUrl,
    });
  }
  logIn = (authToken) => {
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
