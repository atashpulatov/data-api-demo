import {sessionHelper} from '../storage/session-helper';
import {authenticationService} from './auth-rest-service';
import {errorService} from '../error/error-handler';
import {reduxStore} from '../store';

class AuthenticationHelper {
  loginUser = async (err, values) => {
    if (err) {
      return;
    }
    try {
      sessionHelper.enableLoading();
      sessionHelper.saveLoginValues(values);
      const authToken = await authenticationService
          .authenticate(
              values.username, values.password,
              values.envUrl, 1);
      sessionHelper.logIn(authToken);
    } catch (error) {
      errorService.handlePreAuthError(error, true);
    } finally {
      sessionHelper.disableLoading();
    }
  }

  validateAuthToken = () => {
    const reduxStoreState = reduxStore.getState();
    const authToken = reduxStoreState.sessionReducer.authToken;
    const envUrl = reduxStoreState.sessionReducer.envUrl;
    return authenticationService.getSessions(envUrl, authToken);
  }
}

export const authenticationHelper = new AuthenticationHelper();
