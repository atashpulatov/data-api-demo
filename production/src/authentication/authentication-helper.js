import { notificationService } from '../notification-v2/notification-service';

class AuthenticationHelper {
  init = (reduxStore, sessionActions, authenticationService, errorService) => {
    this.reduxStore = reduxStore;
    this.sessionActions = sessionActions;
    this.authenticationService = authenticationService;
    this.errorService = errorService;
  }

  loginUser = async (err, values) => {
    if (err) {
      return;
    }
    try {
      this.sessionActions.enableLoading();
      this.sessionActions.saveLoginValues(values);
      const authToken = await this.authenticationService
        .authenticate(values.username, values.password, values.envUrl, values.loginMode || 1);
      this.sessionActions.logIn(authToken);
    } catch (error) {
      this.errorService.handleError(error, { isLogout: true });
    } finally {
      this.sessionActions.disableLoading();
    }
  }

  validateAuthToken = () => {
    const reduxStoreState = this.reduxStore.getState();
    const { authToken } = reduxStoreState.sessionReducer;
    const { envUrl } = reduxStoreState.sessionReducer;
    return this.authenticationService.putSessions(envUrl, authToken);
  }

  /**
   * Checks for internet connection by trying to get image resource
   *
   * @param {Object} checkInterval id of setInterval required to clear it on connection restored
   */
  doesConnectionExist = (checkInterval) => {
    const reduxStoreState = this.reduxStore.getState();
    const { envUrl } = reduxStoreState.sessionReducer;
    const changedUrl = envUrl.slice(0, -3);
    const xhr = new XMLHttpRequest();
    const file = `${changedUrl}static/loader-mstr-office/assets/mstr_logo_32.png`;
    const randomNum = Math.round(Math.random() * 10000);

    xhr.open('HEAD', `${file}?rand=${randomNum}`, true);
    xhr.send();

    const processRequest = (event) => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 304) {
          notificationService.connectionRestored();
          clearInterval(checkInterval);
        }
        return false;
      }
    };

    xhr.addEventListener('readystatechange', processRequest, false);
  }
}

export const authenticationHelper = new AuthenticationHelper();
