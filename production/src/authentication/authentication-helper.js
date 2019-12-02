import { sessionHelper } from '../storage/session-helper';
import { authenticationService } from './auth-rest-service';
import { errorService } from '../error/error-handler';
import { reduxStore } from '../store';

class AuthenticationHelper {
  loginUser = async (err, values) => {
    if (err) {
      return;
    }
    try {
      sessionHelper.enableLoading();
      sessionHelper.saveLoginValues(values);
      const authToken = await authenticationService
        .authenticate(values.username, values.password, values.envUrl, values.loginMode || 1);
      sessionHelper.logIn(authToken);
    } catch (error) {
      errorService.handleError(error, { isLogout: true });
    } finally {
      sessionHelper.disableLoading();
    }
  }

  validateAuthToken = () => {
    const reduxStoreState = reduxStore.getState();
    const { authToken } = reduxStoreState.sessionReducer;
    const { envUrl } = reduxStoreState.sessionReducer;
    return authenticationService.putSessions(envUrl, authToken);
  }
}

export const authenticationHelper = new AuthenticationHelper();
