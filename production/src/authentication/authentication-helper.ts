import request from 'superagent';

import { browserHelper } from '../helpers/browser-helper';
import { officeApiHelper } from '../office/api/office-api-helper';
import { authenticationRestApi } from './auth-rest-service';

import { reduxStore } from '../store';

import { clearGlobalNotification } from '../redux-reducer/notification-reducer/notification-action-creators';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';

class AuthenticationHelper {
  loginUser = async (values: any): Promise<void> => {
    sessionActions.enableLoading();
    sessionActions.saveLoginValues(values);
    const authToken = await authenticationRestApi.authenticate(
      values.username,
      values.password,
      values.envUrl,
      values.loginMode || 1
    );
    sessionActions.logIn(authToken);
  };

  saveLoginValues(): string {
    const { authToken } = reduxStore.getState().sessionReducer;
    const location = browserHelper.getWindowLocation();
    if (browserHelper.isDevelopment()) {
      if (!authToken) {
        sessionActions.logOut();
      }
    } else {
      const currentPath = location.pathname;
      const pathBeginning = currentPath.split('/apps/')[0];
      const envUrl = `${location.origin}${pathBeginning}/api`;
      const values = { envUrl };
      sessionActions.saveLoginValues(values);
      return values.envUrl;
    }
  }

  validateAuthToken = (): Promise<void> => {
    const { authToken, envUrl } = reduxStore.getState().sessionReducer;

    return authenticationRestApi.putSessions(envUrl, authToken);
  };

  /**
   * Checks for internet connection by trying to access image resource
   * Clears the connection notification even if we get error from the server
   *
   * @param checkInterval id of setInterval required to clear it on connection restored
   */
  doesConnectionExist = (checkInterval: any): void => {
    const reduxStoreState = reduxStore.getState();
    const { envUrl } = reduxStoreState.sessionReducer;
    const changedUrl = envUrl.slice(0, -3);
    const file = `${changedUrl}static/loader-mstr-office/assets/mstr_logo_32.png`;
    const randomNum = Math.round(Math.random() * 10000);

    request
      .head(`${file}?rand=${randomNum}`)
      .then(() => {
        reduxStore.dispatch(clearGlobalNotification());
        clearInterval(checkInterval);
      })
      .catch(error => {
        // if we get any response status it means that we are connected
        if (error.status) {
          reduxStore.dispatch(clearGlobalNotification());
          clearInterval(checkInterval);
        }
      });
  };

  /**
   * Gets username and environment URL from Redux store.
   *
   * @return {Object} Object containing username and envUrl (environment URL)
   */
  getCurrentMstrContext = (): { envUrl: string; username: string } => {
    const { envUrl, username } = reduxStore.getState().sessionReducer;
    return { envUrl, username };
  };

  /**
   * Gets full username from Redux store.
   *
   * @return {String} Text with mstr user fullname
   */
  getCurrentMstrUserFullName = (): string => {
    const { userFullName } = reduxStore.getState().sessionReducer;
    return userFullName;
  };

  /**
   * checks excel session and auth token
   *
   */
  async checkStatusOfSessions(): Promise<void> {
    await Promise.all([officeApiHelper.getExcelSessionStatus(), this.validateAuthToken()]);
  }
}

export const authenticationHelper = new AuthenticationHelper();
