import { authenticationService } from '../authentication/auth-rest-service';
import { userRestService } from '../home/user-rest-service';
import { errorService } from '../error/error-handler';
import { HomeHelper } from '../home/home-helper';
import { createCache } from '../redux-reducer/cache-reducer/cache-actions';
import DB from '../cache/cache-db';
import { importRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';

class SessionHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  /**
   * Handles terminating Rest session and logging out the user from plugin
   *
   */
  logOutRest = async () => {
    const { authToken } = this.reduxStore.getState().sessionReducer;
    const { envUrl } = this.reduxStore.getState().sessionReducer;
    try {
      await authenticationService.logout(envUrl, authToken);
    } catch (error) {
      errorService.handleError(error, { isLogout: true });
    }
  }

  /**
   * Redirect to user to the login page. If it's development mode
   * we can optionally refresh to avoid stale cache issues when
   * changing users.
   *
   * @param {Boolean} shouldReload Reload on logout when in development
   */
  logOutRedirect = (shouldReload = false) => {
    const isDevelopment = this.isDevelopment();
    if (!isDevelopment) {
      const currentPath = window.location.pathname;
      const pathBeginning = currentPath.split('/apps/')[0];
      const loginParams = 'source=addin-mstr-office';
      this.replaceWindowLocation(pathBeginning, loginParams);
    } else {
      sessionActions.disableLoading();
      if (shouldReload) {
        window.location.reload();
      }
    }
  };

  replaceWindowLocation = (pathBeginning, loginParams) => {
    window.location.replace(`${pathBeginning}/static/loader-mstr-office/index.html?${loginParams}`);
  }


  getSession = () => {
    const currentStore = this.reduxStore.getState();
    const session = {
      USE_PROXY: false,
      envUrl: currentStore.sessionReducer.envUrl,
      authToken: currentStore.sessionReducer.authToken,
    };
    return session;
  }

  getUserInfo = async () => {
    let userData = {};
    const isDevelopment = this.isDevelopment();
    const { getState } = this.reduxStore;
    const envUrl = isDevelopment ? getState().sessionReducer.envUrl : HomeHelper.saveLoginValues();
    const authToken = isDevelopment ? getState().sessionReducer.authToken : HomeHelper.saveTokenFromCookies();
    try {
      userData = await userRestService.getUserInfo(authToken, envUrl);
      !userData.userInitials && sessionActions.saveUserInfo(userData);
      if (DB.getIndexedDBSupport()) { createCache(userData.id)(this.reduxStore.dispatch, this.reduxStore.getState); }
    } catch (error) {
      errorService.handleError(error, { isLogout: !isDevelopment });
    }
  }

  getUserAttributeFormPrivilege = async () => {
    let canChooseAttrForm = false;
    const isDevelopment = this.isDevelopment();
    const { reduxStore } = this;
    const envUrl = isDevelopment ? reduxStore.getState().sessionReducer.envUrl : HomeHelper.saveLoginValues();
    const authToken = isDevelopment
      ? reduxStore.getState().sessionReducer.authToken
      : HomeHelper.saveTokenFromCookies();
    try {
      canChooseAttrForm = await authenticationService.getAttributeFormPrivilege(envUrl, authToken);
      sessionActions.setAttrFormPrivilege(canChooseAttrForm);
    } catch (error) {
      console.error(error);
    }
  }

  /**
  * Return Url of the current page
  *
  * @param {String} propertyName Key used by Office Api to determine value from settings
  * @return {*} value from Office
  */
  getUrl = () => window.location.href

  /**
   * Checks what type of build is currently used
   *
   * @return {Boolean} Determines if used build is development or test build
   */
  isDevelopment = () => {
    try {
      const isDevelopment = ['development', 'test'].includes(process.env.NODE_ENV);
      return isDevelopment;
    } catch (error) {
      return false;
    }
  }

  /**
   * Allows to import objects from MSTR without the use of popup
   * DEVELOPMENT ONLY
   *
   * @param {Objects} object ObjectData needed for import
   */
  importObjectWithouPopup = async (object) => {
    this.reduxStore.dispatch(importRequested(object));
  };
}

export const sessionHelper = new SessionHelper();
