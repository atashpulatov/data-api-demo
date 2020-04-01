
import { officeApiHelper } from '../office/api/office-api-helper';
import { errorService } from '../error/error-handler';
import { notificationService } from '../notification/notification-service';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { clearDataRequested } from '../operation/operation-actions';
import { toggleIsConfirmFlag, toggleIsClearingFlag } from '../office/store/office-actions';

export class HomeHelper {
  init = (reduxStore, sessionHelper) => {
    this.reduxStore = reduxStore;
    this.sessionHelper = sessionHelper;
  }

  saveLoginValues = () => {
    const { authToken } = this.reduxStore.getState().sessionReducer;
    const location = this.getWindowLocation();
    if (this.sessionHelper.isDevelopment()) {
      if (!authToken) {
        this.sessionHelper.logOut();
      }
    } else {
      const currentPath = location.pathname;
      const pathBeginning = currentPath.split('/apps/')[0];
      const envUrl = `${location.origin}${pathBeginning}/api`;
      const values = { envUrl, };
      this.sessionHelper.saveLoginValues(values);
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
      this.sessionHelper.logIn(splittedCookiesJar.iSession);
      return splittedCookiesJar.iSession;
    }
  };

  getWindowLocation = () => window.location

  getDocumentCookie = () => document.cookie

  secureData = async (objects) => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      await officeApiWorksheetHelper.checkIfAnySheetProtected(excelContext, objects);

      const { dispatch } = this.reduxStore;
      toggleIsClearingFlag(true)(dispatch);
      toggleIsConfirmFlag(false)(dispatch);

      for (const object of objects) {
        this.reduxStore.dispatch(clearDataRequested(object.objectWorkingId));
      }
    } catch (error) {
      errorService.handleError(error);
    }
  };

   displayClearDataError = (clearErrors, t) => {
     // TODO check if needed
     const reportNames = clearErrors.map((report) => report.reportName).join(', ');
     const errorMessage = clearErrors.map((report) => report.errorMessage).join(', ');
     notificationService.displayTranslatedNotification('warning', t('{{reportNames}} could not be cleared.', { reportNames }), errorMessage);
   }
}

export const homeHelper = new HomeHelper();
