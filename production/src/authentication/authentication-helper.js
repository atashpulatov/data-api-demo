import {sessionHelper} from '../storage/session-helper';
import {authenticationService} from './auth-rest-service';
import {errorService} from '../error/error-handler';
import {userRestService} from '../home/user-rest-service';

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
      const userData = await userRestService.getUserData(authToken, values.envUrl);
      sessionHelper.saveUserInfo(userData);
      sessionHelper.logIn(authToken);
    } catch (error) {
      errorService.handlePreAuthError(error);
    } finally {
      sessionHelper.disableLoading();
    }
  }
}

export const authenticationHelper = new AuthenticationHelper();
