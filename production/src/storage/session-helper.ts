// @ts-expect-error
import throttle from 'lodash.throttle';

import { authenticationRestApi } from '../authentication/auth-rest-service';
import { authenticationHelper } from '../authentication/authentication-helper';
import { errorService } from '../error/error-service';
import { browserHelper } from '../helpers/browser-helper';
import { storageHelper } from '../helpers/storage-helper';
import { userRestService } from '../home/user-rest-service';
import officeStoreHelper from '../office/store/office-store-helper';

import { reduxStore } from '../store';

import { ObjectData } from '../types/object-types';

import { importRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import { httpStatusCodes, IncomingErrorStrings } from '../error/constants';

export const EXTEND_SESSION = 'EXTEND_SESSION';
const DEFAULT_SESSION_REFRESH_TIME = 60000;
class SessionHelper {
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
        await authenticationRestApi.putSessions(envUrl, authToken);
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
    const isDevelopment = browserHelper.isDevelopment();
    const { getState } = reduxStore;
    const envUrl = isDevelopment
      ? getState().sessionReducer.envUrl
      : authenticationHelper.saveLoginValues();
    const authToken = isDevelopment
      ? getState().sessionReducer.authToken
      : this.getTokenFromStorage();
    try {
      userData = await userRestService.getUserInfo(authToken, envUrl);
      !userData.userInitials && sessionActions.saveUserInfo(userData);
    } catch (error) {
      errorService.handleError(error, { isLogout: !isDevelopment });
    }
  }

  /**
   * Get information whether currently logged user can set attribute forms and store it in redux store
   *
   */
  async getUserAttributeFormPrivilege(): Promise<void> {
    let canChooseAttrForm = false;
    const isDevelopment = browserHelper.isDevelopment();
    const envUrl = isDevelopment
      ? reduxStore.getState().sessionReducer.envUrl
      : authenticationHelper.saveLoginValues();
    const authToken = isDevelopment
      ? reduxStore.getState().sessionReducer.authToken
      : this.getTokenFromStorage();
    try {
      canChooseAttrForm = await authenticationRestApi.getAttributeFormPrivilege(envUrl, authToken);
      sessionActions.setAttrFormPrivilege(canChooseAttrForm);
    } catch (error) {
      console.error(error);
    }
  }

  async getCanUseOfficePrivilege(): Promise<boolean> {
    const isDevelopment = browserHelper.isDevelopment();
    const { envUrl } = reduxStore.getState().sessionReducer;

    const authToken = isDevelopment
      ? reduxStore.getState().sessionReducer.authToken
      : this.getTokenFromStorage();
    const canUseOffice = await authenticationRestApi.getOfficePrivilege(envUrl, authToken);

    return canUseOffice;
  }

  /**
   * With the introduction of http-only we cannot get the iSession token from the cookies
   * Retrieve the stored token from localstorage or Excel settings and save in redux store
   *
   * @returns iSession token
   */
  getTokenFromStorage(): string {
    const iSession =
      storageHelper.getStorageItem('iSession') || officeStoreHelper.getPropertyValue('iSession');
    if (iSession) {
      sessionActions.logIn(iSession);
      return iSession;
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
