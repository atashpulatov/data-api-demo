import { browserHelper } from '../helpers/browser-helper';
import { authenticationRestApi } from './auth-rest-service';

import { reduxStore } from '../store';

import { sessionActions } from '../redux-reducer/session-reducer/session-actions';

export const EXTEND_SESSION = 'EXTEND_SESSION';

class AuthenticationService {
  /**
   * Handles terminating Rest session and logging out the user from plugin
   *
   */
  async logOutRest(errorService: any): Promise<void> {
    try {
      const { authToken, envUrl } = reduxStore.getState().sessionReducer;
      authenticationRestApi.logout(envUrl, authToken);
    } catch (error) {
      errorService.handleError(error, { isLogout: true } as any);
    }
  }

  /**
   * Handles terminating Rest session and logging out the user from plugin
   * with redirect to login page from Privilege Error Screen
   */
  async handleLogoutForPrivilegeMissing(errorService: any): Promise<void> {
    try {
      await this.logOutRest(errorService);
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
    const isDevelopment = browserHelper.isDevelopment();
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
}

export const authenticationService = new AuthenticationService();
