import { reduxStore } from '../store';
import { sessionProperties } from './session-properties';
import { authenticationService } from '../authentication/auth-rest-service';
import { userRestService } from '../home/user-rest-service';
import { errorService } from '../error/error-handler';
import { homeHelper } from '../home/home-helper';
import getObjectList from '../mstr-object/mstr-list-rest-service';
import DB from './pouch-db';

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
    this.clearDB();
  }

  logOutRest = async () => {
    const { authToken } = reduxStore.getState().sessionReducer;
    const { envUrl } = reduxStore.getState().sessionReducer;
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
    reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values,
    });
  }

  logIn = (authToken) => {
    reduxStore.dispatch({
      type: sessionProperties.actions.loggedIn,
      authToken,
    });
    this.connectDB();
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

  getUserInfo = async () => {
    let userData = {};
    const IS_LOCALHOST = this.isLocalhost();
    const envUrl = IS_LOCALHOST ? reduxStore.getState().sessionReducer.envUrl : homeHelper.saveLoginValues();
    const authToken = IS_LOCALHOST ? reduxStore.getState().sessionReducer.authToken : homeHelper.saveTokenFromCookies();
    try {
      userData = await userRestService.getUserInfo(authToken, envUrl);
      !userData.userInitials && sessionHelper.saveUserInfo(userData);
    } catch (error) {
      errorService.handleError(error, { isLogout: !IS_LOCALHOST });
    }
  }

  saveUserInfo = (values) => {
    reduxStore.dispatch({
      type: sessionProperties.actions.getUserInfo,
      userFullName: values.fullName,
      userInitials: values.initials,
    });
  }

  setDialog = (dialog) => {
    reduxStore.dispatch({
      type: sessionProperties.actions.setDialog,
      dialog,
    });
  }

  getUrl = () => window.location.href

  isLocalhost = () => this.getUrl().includes('localhost')

  connectDB = () => {
    // Create or get DB for current user
    const { sessionReducer } = reduxStore.getState();
    const db = new DB(sessionReducer.username);

    // If DB info and if empty fetch objects from server
    db.info().then((info) => {
      if (!info.doc_count) {
        const callback = db.putObjects;
        getObjectList(callback).catch(console.error);
      }
    });
  }

  clearDB = () => {
    const { sessionReducer } = reduxStore.getState();
    const db = new DB(sessionReducer.username);
    db.clear().catch(console.error);
  }
}

export const sessionHelper = new SessionHelper();
