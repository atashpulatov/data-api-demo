import {reduxStore} from '../store';
import {sessionProperties} from './session-properties';
import {authenticationService} from '../authentication/auth-rest-service';
import {errorService} from '../error/error-handler';
import {homeHelper} from '../home/home-helper';

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
    const {origin} = homeHelper.getWindowLocation();
    if (!origin.includes('localhost')) {
      const currentPath = window.location.pathname;
      const pathBeginning = currentPath.split('/apps/')[0];
      const loginParams = 'source=addin-mstr-office';
      this.replaceWindowLocation(pathBeginning, loginParams);
    } else {
      sessionHelper.disableLoading();
    }
  };
  replaceWindowLocation = (pathBeginning, loginParams) => {
    window.location.replace(`${pathBeginning}/static/loader-mstr-office/index.html?${loginParams}`);
  }

  saveLoginValues = (values) => {
    reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values: values,
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
  saveUserInfo = (values) => {
    reduxStore.dispatch({
      type: sessionProperties.actions.getUserInfo,
      userFullName: values.fullName ? values.fullName : 'Microstrategy User',
      userInitials: values.initials ? values.initials : null,
      userLocale: values.locale || 'en-US',
    });
  }

  setDialog = (dialog) => {
    reduxStore.dispatch({
      type: sessionProperties.actions.setDialog,
      dialog,
    });
  }
}

export const sessionHelper = new SessionHelper();
