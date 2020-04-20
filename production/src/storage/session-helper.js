import throttle from 'lodash.throttle';
import { sessionProperties } from '../redux-reducer/session-reducer/session-properties';
import { authenticationService } from '../authentication/auth-rest-service';
import { userRestService } from '../home/user-rest-service';
import { errorService } from '../error/error-handler';
import { HomeHelper } from '../home/home-helper';
import { createCache } from '../redux-reducer/cache-reducer/cache-actions';
import DB from '../cache/cache-db';
import { importRequested } from '../redux-reducer/operation-reducer/operation-actions';

export const EXTEND_SESSION = 'EXTEND_SESSION';
const DEFAULT_SESSION_REFRESH_TIME = 1000;
class SessionHelper {
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

  /**
   * Redirect to user to the login page. If it's development mode
   * we can optionally refresh to avoid stale cache issues when
   * changing users.
   *
   * @param {Boolean} shouldReload Reload on logout when in development
   */
  logOutRedirect = (shouldReload = false) => {
    const isDevelopment = this.isDevelopment();
    if (!isDevelopment) {
      const currentPath = window.location.pathname;
      const pathBeginning = currentPath.split('/apps/')[0];
      const loginParams = 'source=addin-mstr-office';
      this.replaceWindowLocation(pathBeginning, loginParams);
    } else {
      this.disableLoading();
      if (shouldReload) {
        window.location.reload();
      }
    }
  }

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
    const session = {
      USE_PROXY: false,
      envUrl: currentStore.sessionReducer.envUrl,
      authToken: currentStore.sessionReducer.authToken,
    };
    return session;
  }

  /**
   * Sends lightweight request to prolong the session
   *
   * IMPORTANT: before calling keepSessionAlive, installSessionProlongingHandler
   * method shold be invoked
   *
   * in case of session is already expired, then user will be logged out
   * getting notification.
   * process will be terminated if parameter onSessionExpire is truthy.
   *
   * @param {func} onSessionExpire is callback function e.g closePopup()
   */
  keepSessionAlive = async (onSessionExpire = null) => {
    const { envUrl, authToken } = this.reduxStore.getState().sessionReducer;
    try {
      await authenticationService.putSessions(envUrl, authToken);
    } catch (error) {
      if (onSessionExpire && error.response && error.response.statusCode) {
        const { statusCode } = error.response;
        if (statusCode === 401 || statusCode === 403) {
          onSessionExpire();
        }
      }
      errorService.handleError(error);
    }
  };

 /**
  * Installs throttle on keepSessionAlive method
  *
  * invokes keepSessionAlive method at most once per every DEFAULT_SESSION_REFRESH_TIME
  *
  * @param {func} onSessionExpire is callback function e.g closePopup() default value is [null].
  */
 installSessionProlongingHandler = (onSessionExpire = null) => throttle(() => {
   this.keepSessionAlive(onSessionExpire);
 }, DEFAULT_SESSION_REFRESH_TIME, { trailing: false })

  getUserInfo = async () => {
    let userData = {};
    const isDevelopment = this.isDevelopment();
    const { getState } = this.reduxStore;
    const envUrl = isDevelopment ? getState().sessionReducer.envUrl : HomeHelper.saveLoginValues();
    const authToken = isDevelopment ? getState().sessionReducer.authToken : HomeHelper.saveTokenFromCookies();
    try {
      userData = await userRestService.getUserInfo(authToken, envUrl);
      !userData.userInitials && sessionHelper.saveUserInfo(userData);
      if (DB.getIndexedDBSupport()) { createCache(userData.id)(this.reduxStore.dispatch, this.reduxStore.getState); }
    } catch (error) {
      errorService.handleError(error, { isLogout: !isDevelopment });
    }
  }

  getUserAttributeFormPrivilege = async () => {
    let canChooseAttrForm = false;
    const IS_LOCALHOST = this.isLocalhost();
    const { reduxStore } = this;
    const envUrl = IS_LOCALHOST ? reduxStore.getState().sessionReducer.envUrl : HomeHelper.saveLoginValues();
    const authToken = IS_LOCALHOST ? reduxStore.getState().sessionReducer.authToken : HomeHelper.saveTokenFromCookies();
    try {
      canChooseAttrForm = await authenticationService.getAttributeFormPrivilege(envUrl, authToken);
      sessionHelper.setAttrFormPrivilege(canChooseAttrForm);
    } catch (error) {
      console.error(error);
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

  setAttrFormPrivilege = (value) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setAttrFormPrivilege,
      attrFormPrivilege: value,
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

  isDevelopment = () => {
    try {
      const isDevelopment = ['development', 'test'].includes(process.env.NODE_ENV);
      return isDevelopment;
    } catch (error) {
      return false;
    }
  }

  importObjectWithouPopup = async (object) => {
    this.reduxStore.dispatch(importRequested(object));
  };
}

export const sessionHelper = new SessionHelper();
