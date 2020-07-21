import throttle from 'lodash.throttle';
import { authenticationService } from '../authentication/auth-rest-service';
import { userRestService } from '../home/user-rest-service';
import { errorService } from '../error/error-handler';
import { homeHelper } from '../home/home-helper';
import { createCache } from '../redux-reducer/cache-reducer/cache-actions';
import DB from '../cache/cache-db';
import { importRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import { httpStatusCodes, incomingErrorStrings } from '../error/constants';

export const EXTEND_SESSION = 'EXTEND_SESSION';
const DEFAULT_SESSION_REFRESH_TIME = 60000;
class SessionHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  /**
   * Handles terminating Rest session and logging out the user from plugin
   *
   */
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
      const url = encodeURI(`${pathBeginning}/static/loader-mstr-office/index.html?${loginParams}`);
      window.location.replace(url);
    } else {
      sessionActions.disableLoading();
      if (shouldReload) {
        window.location.reload();
      }
    }
  }

  /**
   * Return Information about envUrl, authToken and USE_PROXY from redux store
   *
   * @return {Object} Information about current session
   */
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
   * Sends lightweight request to prolong the session.
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
    const { onLine } = window.navigator;
    try {
      if (authToken && onLine) {
        await authenticationService.putSessions(envUrl, authToken);
      }
    } catch (error) {
      if (onSessionExpire && error.response && error.response.statusCode) {
        const { UNAUTHORIZED_ERROR, FORBIDDEN_ERROR } = httpStatusCodes;
        const { statusCode } = error.response;
        if (statusCode === UNAUTHORIZED_ERROR || statusCode === FORBIDDEN_ERROR) {
          onSessionExpire();
        }
      }
      const castedError = String(error);
      const { CONNECTION_BROKEN } = incomingErrorStrings;
      if (!castedError.includes(CONNECTION_BROKEN)) {
        errorService.handleError(error);
      }
    }
  };

 /**
  * Installs throttle on keepSessionAlive method.
  *
  * invokes keepSessionAlive method at most once per every DEFAULT_SESSION_REFRESH_TIME
  *
  * @param {func} onSessionExpire is callback function e.g closePopup() default value is [null].
  */
 installSessionProlongingHandler = (onSessionExpire = null) => throttle(() => {
   this.keepSessionAlive(onSessionExpire);
 }, DEFAULT_SESSION_REFRESH_TIME, { trailing: false })

  /**
   * Get userData about currently logged user from Api and stores the information in redux store
   *
   */
  getUserInfo = async () => {
    let userData = {};
    const isDevelopment = this.isDevelopment();
    const { getState } = this.reduxStore;
    const envUrl = isDevelopment ? getState().sessionReducer.envUrl : homeHelper.saveLoginValues();
    const authToken = isDevelopment ? getState().sessionReducer.authToken : homeHelper.saveTokenFromCookies();
    try {
      userData = await userRestService.getUserInfo(authToken, envUrl);
      !userData.userInitials && sessionActions.saveUserInfo(userData);
      if (DB.getIndexedDBSupport()) { createCache(userData.id)(this.reduxStore.dispatch, this.reduxStore.getState); }
    } catch (error) {
      errorService.handleError(error, { isLogout: !isDevelopment });
    }
  }

  /**
   * Get information whether currently logged user can set attribute forms and store it in redux store
   *
   */
  getUserAttributeFormPrivilege = async () => {
    let canChooseAttrForm = false;
    const isDevelopment = this.isDevelopment();
    const { reduxStore } = this;
    const envUrl = isDevelopment ? reduxStore.getState().sessionReducer.envUrl : homeHelper.saveLoginValues();
    const authToken = isDevelopment
      ? reduxStore.getState().sessionReducer.authToken
      : homeHelper.saveTokenFromCookies();
    try {
      canChooseAttrForm = await authenticationService.getAttributeFormPrivilege(envUrl, authToken);
      sessionActions.setAttrFormPrivilege(canChooseAttrForm);
    } catch (error) {
      console.error(error);
    }
  }

  /**
  * Return Url of the current page
  *
  * @param {String} propertyName Key used by Office Api to determine value from settings
  * @return {String} Page Url
  */
  getUrl = () => window.location.href

  /**
   * Checks what type of build is currently used
   *
   * @return {Boolean} Determines if used build is development or test build
   */
  isDevelopment = () => {
    try {
      const isDevelopment = ['development', 'test'].includes(process.env.NODE_ENV);
      return isDevelopment;
    } catch (error) {
      return false;
    }
  }

  /**
   * Allows to import objects from MSTR without the use of popup
   * DEVELOPMENT ONLY
   *
   * @param {Objects} object ObjectData needed for import
   */
  importObjectWithouPopup = async (object) => {
    this.reduxStore.dispatch(importRequested(object));
  };
}

export const sessionHelper = new SessionHelper();
