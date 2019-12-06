import { authenticationService } from './auth-rest-service';
import { errorService } from '../error/error-handler';

export class AuthenticationHelper {

  init = (reduxStore, sessionHelper) => {
    this.reduxStore = reduxStore;
    this.sessionHelper = sessionHelper;
  }

  loginUser = async (err, values) => {
    if (err) {
      return;
    }
    try {
      this.sessionHelper.enableLoading();
      this.sessionHelper.saveLoginValues(values);
      const authToken = await authenticationService
        .authenticate(values.username, values.password, values.envUrl, values.loginMode || 1);
      this.sessionHelper.logIn(authToken);
    } catch (error) {
      errorService.handleError(error, { isLogout: true });
    } finally {
      this.sessionHelper.disableLoading();
    }
  }

  validateAuthToken = () => {
    const reduxStoreState = this.reduxStore.getState();
    const { authToken } = reduxStoreState.sessionReducer;
    const { envUrl } = reduxStoreState.sessionReducer;
    return authenticationService.putSessions(envUrl, authToken);
  }
}

export const authenticationHelper = new AuthenticationHelper();
