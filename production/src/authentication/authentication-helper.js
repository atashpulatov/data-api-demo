import {sessionHelper} from '../storage/session-helper';
import {authenticationService} from './auth-rest-service';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';

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
      notificationService.displayMessage('success', 'Logged in');
      sessionHelper.logIn(authToken);
    } catch (error) {
      errorService.handlePreAuthError(error);
    } finally {
      sessionHelper.disableLoading();
    }
  }
}

export const authenticationHelper = new AuthenticationHelper();
