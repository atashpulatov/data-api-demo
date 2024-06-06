// @ts-expect-error
import throttle from 'lodash.throttle';

import { authenticationService } from '../authentication/auth-rest-service';
import { homeHelper } from '../home/home-helper';
import { userRestService } from '../home/user-rest-service';

import { reduxStore } from '../store';

import { ObjectData } from '../types/object-types';

import { errorService } from '../error/error-handler';
import { importRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import { httpStatusCodes, IncomingErrorStrings } from '../error/constants';

export const EXTEND_SESSION = 'EXTEND_SESSION';
const DEFAULT_SESSION_REFRESH_TIME = 60000;
class SessionHelper {
  /**
   * Handles terminating Rest session and logging out the user from plugin
   *
   */
  async logOutRest(): Promise<void> {
    const { authToken } = reduxStore.getState().sessionReducer;
    const { envUrl } = reduxStore.getState().sessionReducer;
    try {
      authenticationService.logout(envUrl, authToken);
    } catch (error) {
      errorService.handleError(error, { isLogout: true } as any);
    }
  }

  /**
   * Handles terminating Rest session and logging out the user from plugin
   * with redirect to login page from Privilege Error Screen
   */
  async handleLogoutForPrivilegeMissing(): Promise<void> {
    try {
      await this.logOutRest();
      sessionActions.logOut();
    } catch (error) {
      errorService.handleError(error);
    } finally {
      this.logOutRedirect(true);
    }
  }

  /**
   * Redirect to user to the login page. If it's development mode
   * we can optionally refresh to avoid stale cache issues when
   * changing users.
   *
   * @param shouldReload Reload on logout when in development
   */
  logOutRedirect(shouldReload = false): void {
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
   * @return Information about current session
   */
  getSession(): any {
    const currentStore = reduxStore.getState();
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
   * @param onSessionExpire is callback function e.g closePopup()
   */
  async keepSessionAlive(onSessionExpire: () => void = null): Promise<void> {
    const { envUrl, authToken } = reduxStore.getState().sessionReducer;
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
      const { CONNECTION_BROKEN } = IncomingErrorStrings;
      if (!castedError.includes(CONNECTION_BROKEN)) {
        errorService.handleError(error);
      }
    }
  }

  /**
   * Installs throttle on keepSessionAlive method.
   *
   * invokes keepSessionAlive method at most once per every DEFAULT_SESSION_REFRESH_TIME
   *
   * @param onSessionExpire is callback function e.g closePopup() default value is [null].
   */
  installSessionProlongingHandler(onSessionExpire: () => void = null): () => void {
    return throttle(
      () => {
        this.keepSessionAlive(onSessionExpire);
      },
      DEFAULT_SESSION_REFRESH_TIME,
      { trailing: false }
    );
  }

  /**
   * Get userData about currently logged user from Api and stores the information in redux store
   *
   */
  async getUserInfo(): Promise<void> {
    let userData: any = {};
    const isDevelopment = this.isDevelopment();
    const { getState } = reduxStore;
    const envUrl = isDevelopment ? getState().sessionReducer.envUrl : homeHelper.saveLoginValues();
    const authToken = isDevelopment
      ? getState().sessionReducer.authToken
      : homeHelper.getTokenFromStorage();
    try {
      userData = await userRestService.getUserInfo(authToken, envUrl);
      !userData.userInitials && sessionActions.saveUserInfo(userData);
    } catch (error) {
      errorService.handleError(error, { isLogout: !isDevelopment } as any);
    }
  }

  /**
   * Get information whether currently logged user can set attribute forms and store it in redux store
   *
   */
  async getUserAttributeFormPrivilege(): Promise<void> {
    let canChooseAttrForm = false;
    const isDevelopment = this.isDevelopment();
    const envUrl = isDevelopment
      ? reduxStore.getState().sessionReducer.envUrl
      : homeHelper.saveLoginValues();
    const authToken = isDevelopment
      ? reduxStore.getState().sessionReducer.authToken
      : homeHelper.getTokenFromStorage();
    try {
      canChooseAttrForm = await authenticationService.getAttributeFormPrivilege(envUrl, authToken);
      sessionActions.setAttrFormPrivilege(canChooseAttrForm);
    } catch (error) {
      console.error(error);
    }
  }

  async getCanUseOfficePrivilege(): Promise<boolean> {
    const isDevelopment = this.isDevelopment();
    const { envUrl } = reduxStore.getState().sessionReducer;

    const authToken = isDevelopment
      ? reduxStore.getState().sessionReducer.authToken
      : homeHelper.getTokenFromStorage();
    const canUseOffice = await authenticationService.getOfficePrivilege(envUrl, authToken);

    return canUseOffice;
  }

  /**
   * Return Url of the current page
   *
   * @return Page Url
   */
  getUrl(): string {
    return window.location.href;
  }

  /**
   * Checks what type of build is currently used
   *
   * @return Determines if used build is development or test build
   */
  isDevelopment(): boolean {
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
   * @param object ObjectData needed for import
   */
  async importObjectWithouPopup(object: ObjectData): Promise<void> {
    reduxStore.dispatch(importRequested(object));
  }
}

export const sessionHelper = new SessionHelper();
