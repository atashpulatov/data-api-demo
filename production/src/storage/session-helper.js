import { sessionProperties } from './session-properties';
import { authenticationService } from '../authentication/auth-rest-service';
import { userRestService } from '../home/user-rest-service';
import { errorService } from '../error/error-handler';
import { homeHelper } from '../home/home-helper';
import { createCache } from '../cache/cache-actions';
import DB from '../cache/cache-db';

export class SessionHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  enableLoading = () => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setLoading,
      loading: true,
    });
  }

  disableLoading = () => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setLoading,
      loading: false,
    });
  }

  logOut = () => {
    this.reduxStore.dispatch({ type: sessionProperties.actions.logOut, });
  }

  logOutRest = async () => {
    const { authToken } = this.reduxStore.getState().sessionReducer;
    const { envUrl } = this.reduxStore.getState().sessionReducer;
    try {
      await authenticationService.logout(envUrl, authToken);
    } catch (error) {
      errorService.handleError(error, { isLogout: true });
    }
  }

  logOutRedirect = () => {
    const { origin } = homeHelper.getWindowLocation();
    if (!origin.includes('localhost')) {
      const currentPath = window.location.pathname;
      const pathBeginning = currentPath.split('/apps/')[0];
      const loginParams = 'source=addin-mstr-office';
      this.replaceWindowLocation(pathBeginning, loginParams);
    } else {
      this.disableLoading();
    }
  };

  replaceWindowLocation = (pathBeginning, loginParams) => {
    window.location.replace(`${pathBeginning}/static/loader-mstr-office/index.html?${loginParams}`);
  }

  saveLoginValues = (values) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values,
    });
  }

  logIn = (authToken) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.loggedIn,
      authToken,
    });
  }

  getSession = () => {
    const currentStore = this.reduxStore.getState();
    const projectId = currentStore.historyReducer.project
      ? currentStore.historyReducer.project.projectId
      : undefined;
    const session = {
      USE_PROXY: false,
      envUrl: currentStore.sessionReducer.envUrl,
      authToken: currentStore.sessionReducer.authToken,
      projectId,
    };
    return session;
  }

  getUserInfo = async () => {
    let userData = {};
    const IS_LOCALHOST = this.isLocalhost();
    const envUrl = IS_LOCALHOST ? this.reduxStore.getState().sessionReducer.envUrl : homeHelper.saveLoginValues();
    const authToken = IS_LOCALHOST ? this.reduxStore.getState().sessionReducer.authToken : homeHelper.saveTokenFromCookies();
    try {
      userData = await userRestService.getUserInfo(authToken, envUrl);
      !userData.userInitials && sessionHelper.saveUserInfo(userData);
      if (DB.getIndexedDBSupport()) createCache(userData.id)(this.reduxStore.dispatch, this.reduxStore.getState);
    } catch (error) {
      errorService.handleError(error, { isLogout: !IS_LOCALHOST });
    }
  }

  saveUserInfo = (values) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.getUserInfo,
      userFullName: values.fullName,
      userInitials: values.initials,
      userID: values.id,
    });
  }

  setDialog = (dialog) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setDialog,
      dialog,
    });
  }

  getUrl = () => window.location.href

  isLocalhost = () => this.getUrl().includes('localhost')
}

export const sessionHelper = new SessionHelper();
