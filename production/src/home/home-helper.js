
import { officeApiHelper } from '../office/api/office-api-helper';
import { errorService } from '../error/error-handler';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { clearDataRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { toggleIsConfirmFlag } from '../redux-reducer/office-reducer/office-actions';

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

  saveTokenFromCookies = () => {
    const splittedCookiesJar = this.getParsedCookies();
    if (splittedCookiesJar.iSession) {
      this.sessionActions.logIn(splittedCookiesJar.iSession);
      return splittedCookiesJar.iSession;
    }
  };

  getWindowLocation = () => window.location

  getDocumentCookie = () => document.cookie

  secureData = async (objects) => {
    try {
      const { dispatch } = this.reduxStore;
      toggleIsConfirmFlag(false)(dispatch);

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
   */
  isMacAndSafariBased = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    const macintosh = userAgent.includes('macintosh');
    const webkit = userAgent.includes('applewebkit');
    const chrome = userAgent.includes('chrome');

    return macintosh && webkit && !chrome;
  }
}

export const homeHelper = new HomeHelper();
