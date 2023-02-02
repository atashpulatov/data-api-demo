import { officeApiHelper } from '../office/api/office-api-helper';
import { errorService } from '../error/error-handler';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { clearDataRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import officeStoreRestoreObject from '../office/store/office-store-restore-object';

const SHOW_HIDDEN_KEY = 'showHidden';

export class HomeHelper {
  init = (reduxStore, sessionActions, sessionHelper) => {
    this.reduxStore = reduxStore;
    this.sessionActions = sessionActions;
    this.sessionHelper = sessionHelper;
  }

  saveLoginValues = () => {
    const { authToken } = this.reduxStore.getState().sessionReducer;
    const location = this.getWindowLocation();
    if (this.sessionHelper.isDevelopment()) {
      if (!authToken) {
        this.sessionActions.logOut();
      }
    } else {
      const currentPath = location.pathname;
      const pathBeginning = currentPath.split('/apps/')[0];
      const envUrl = `${location.origin}${pathBeginning}/api`;
      const values = { envUrl, };
      this.sessionActions.saveLoginValues(values);
      return values.envUrl;
    }
  };

  getParsedCookies = () => {
    // F25871: Unused method since all cookies are set as HttpOnly so we cannot access them with JS
    const cookieJar = this.getDocumentCookie();
    return cookieJar.split(';')
      .reduce((res, c) => {
        const [key, val] = c.trim().split('=').map(decodeURIComponent);
        const allNumbers = (str) => /^\d+$/.test(str);
        try {
          return Object.assign(res, { [key]: allNumbers(val) ? val : JSON.parse(val) });
        } catch (e) {
          return Object.assign(res, { [key]: val });
        }
      }, {});
  };

  storeShowHidden = () => {
    try {
      const showHiddenOfficeSettings = officeStoreRestoreObject.getExcelSettingValue(SHOW_HIDDEN_KEY);
      const showHiddenLocalStorage = this.getStorageItem(SHOW_HIDDEN_KEY);
      const showHidden = showHiddenOfficeSettings || showHiddenLocalStorage !== 'false';
      const { dispatch } = this.reduxStore;
      dispatch(officeActions.setShowHidden(showHidden));
    } catch (error) {
      console.error(error);
    }
  }

  getStorageItem = (key = 'iSession') => window.localStorage.getItem(key);

/**
 * With the introduction of http-only we cannot get the iSession token from the cookies
 * Retrieve the stored token from localstorage or Excel settings and save in redux store
 *
 * @returns {String} iSession token
 */
getTokenFromStorage = () => {
  const iSession = this.getStorageItem('iSession') || officeStoreRestoreObject.getExcelSettingValue('iSession');
  if (iSession) {
    this.sessionActions.logIn(iSession);
    return iSession;
  }
};

  getWindowLocation = () => window.location

  getDocumentCookie = () => document.cookie

  secureData = async (objects) => {
    try {
      const { dispatch } = this.reduxStore;
      officeActions.toggleIsConfirmFlag(false)(dispatch);

      setTimeout(async () => {
        const excelContext = await officeApiHelper.getExcelContext();
        await officeApiWorksheetHelper.checkIfAnySheetProtected(excelContext, objects);

        for (const object of objects) {
          this.reduxStore.dispatch(clearDataRequested(object.objectWorkingId));
        }
      }, 0);
    } catch (error) {
      errorService.handleError(error);
    }
  };

  /**
   * Checks if we are running on macOS Safari based client
   * Checking only for webkit or safari is not enought:
   * https://security.stackexchange.com/questions/126407/why-does-chrome-send-four-browsers-in-the-user-agent-header
   *
   * @returns {boolean} true if user agent is instance of mac desktop or safari
   */
  isMacAndSafariBased = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    const isMacintosh = userAgent.includes('macintosh');
    const isWebkit = userAgent.includes('applewebkit');
    const isChrome = userAgent.includes('chrome');

    return isMacintosh && isWebkit && !isChrome;
  }
}

export const homeHelper = new HomeHelper();
