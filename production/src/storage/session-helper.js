import { sessionProperties } from './session-properties';
import { authenticationService } from '../authentication/auth-rest-service';
import { userRestService } from '../home/user-rest-service';
import { errorService } from '../error/error-handler';
import { HomeHelper } from '../home/home-helper';
import { createCache } from '../cache/cache-actions';
import DB from '../cache/cache-db';

class SessionHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  enableLoading = () => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setLoading,
      loading: true,
    });
  }

  disableLoading = () => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setLoading,
      loading: false,
    });
  }

  logOut = () => {
    this.reduxStore.dispatch({ type: sessionProperties.actions.logOut, });
  }

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
      this.disableLoading();
      if (shouldReload) {
        window.location.reload();
      }
    }
  };

  replaceWindowLocation = (pathBeginning, loginParams) => {
    window.location.replace(`${pathBeginning}/static/loader-mstr-office/index.html?${loginParams}`);
  }

  saveLoginValues = (values) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values,
    });
  }

  logIn = (authToken) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.loggedIn,
      authToken,
    });
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
      !userData.userInitials && sessionHelper.saveUserInfo(userData);
      if (DB.getIndexedDBSupport()) { createCache(userData.id)(this.reduxStore.dispatch, this.reduxStore.getState); }
    } catch (error) {
      errorService.handleError(error, { isLogout: !isDevelopment });
    }
  }

  getUserAttributeFormPrivilege = async () => {
    let canChooseAttrForm = false;
    const IS_LOCALHOST = this.isLocalhost();
    const { reduxStore } = this;
    const envUrl = IS_LOCALHOST ? reduxStore.getState().sessionReducer.envUrl : HomeHelper.saveLoginValues();
    const authToken = IS_LOCALHOST ? reduxStore.getState().sessionReducer.authToken : HomeHelper.saveTokenFromCookies();
    try {
      canChooseAttrForm = await authenticationService.getAttributeFormPrivilege(envUrl, authToken);
      sessionHelper.setAttrFormPrivilege(canChooseAttrForm);
    } catch (error) {
      console.error(error);
    }
  }

  saveUserInfo = (values) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.getUserInfo,
      userFullName: values.fullName,
      userInitials: values.initials,
      userID: values.id,
    });
  }

  setAttrFormPrivilege = (value) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setAttrFormPrivilege,
      attrFormPrivilege: value,
    });
  }

  setDialog = (dialog) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setDialog,
      dialog,
    });
  }

  getUrl = () => window.location.href

  isLocalhost = () => this.getUrl().includes('localhost')

  isDevelopment = () => {
    try {
      const isDevelopment = ['development', 'test'].includes(process.env.NODE_ENV);
      return isDevelopment;
    } catch (error) {
      return false;
    }
  }
}

export const sessionHelper = new SessionHelper();
