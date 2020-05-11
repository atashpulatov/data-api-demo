import request from 'superagent';
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
   * Checks for internet connection by trying to access image resource
   * Clears the connection notification even if we get error from the server
   *
   * @param {Object} checkInterval id of setInterval required to clear it on connection restored
   */
  doesConnectionExist = (checkInterval) => {
    const reduxStoreState = this.reduxStore.getState();
    const { envUrl } = reduxStoreState.sessionReducer;
    const changedUrl = envUrl.slice(0, -3);
    const file = `${changedUrl}static/loader-mstr-office/assets/mstr_logo_32.png`;
    const randomNum = Math.round(Math.random() * 10000);

    request
      .head(`${file}?rand=${randomNum}`)
      .then(() => {
        notificationService.connectionRestored();
        clearInterval(checkInterval);
      })
      .catch((error) => {
        // if we get any response status it means that we are connected
        if (error.status) {
          notificationService.connectionRestored();
          clearInterval(checkInterval);
        }
      });
  }
}

export const authenticationHelper = new AuthenticationHelper();
