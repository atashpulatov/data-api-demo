import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { officeShapeApiHelper } from '../office/shapes/office-shape-api-helper';

import officeStoreRestoreObject from '../office/store/office-store-restore-object';

import { errorService } from '../error/error-handler';
import { officeContext } from '../office/office-context';
import { configActions } from '../redux-reducer/config-reducer/config-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { clearDataRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { ObjectImportType } from '../mstr-object/constants';

const SHOW_HIDDEN_KEY = 'showHidden';

export class HomeHelper {
  reduxStore: any;

  sessionActions: any;

  sessionHelper: any;

  init(reduxStore: any, sessionActions: any, sessionHelper: any): void {
    this.reduxStore = reduxStore;
    this.sessionActions = sessionActions;
    this.sessionHelper = sessionHelper;
  }

  saveLoginValues(): string {
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
      const values = { envUrl };
      this.sessionActions.saveLoginValues(values);
      return values.envUrl;
    }
  }

  getParsedCookies(): any {
    // F25871: Unused method since all cookies are set as HttpOnly so we cannot access them with JS
    const cookieJar = this.getDocumentCookie();
    return cookieJar.split(';').reduce((res, c) => {
      const [key, val] = c.trim().split('=').map(decodeURIComponent);
      const allNumbers = (string: string): boolean => /^\d+$/.test(string);
      try {
        return Object.assign(res, {
          [key]: allNumbers(val) ? val : JSON.parse(val),
        });
      } catch (e) {
        return Object.assign(res, { [key]: val });
      }
    }, {});
  }

  storeShowHidden(): void {
    try {
      const showHiddenOfficeSettings =
        officeStoreRestoreObject.getExcelSettingValue(SHOW_HIDDEN_KEY);
      const showHiddenLocalStorage = this.getStorageItem(SHOW_HIDDEN_KEY);
      const showHidden = showHiddenOfficeSettings || showHiddenLocalStorage !== 'false';
      const { dispatch } = this.reduxStore;
      dispatch(configActions.setShowHidden(showHidden));
    } catch (error) {
      console.error(error);
    }
  }

  getStorageItem(key = 'iSession'): string {
    return window.localStorage.getItem(key);
  }

  /**
   * With the introduction of http-only we cannot get the iSession token from the cookies
   * Retrieve the stored token from localstorage or Excel settings and save in redux store
   *
   * @returns iSession token
   */
  getTokenFromStorage(): string {
    const iSession =
      this.getStorageItem('iSession') || officeStoreRestoreObject.getExcelSettingValue('iSession');
    if (iSession) {
      this.sessionActions.logIn(iSession);
      return iSession;
    }
  }

  getWindowLocation(): Location {
    return window.location;
  }

  getDocumentCookie(): string {
    return document.cookie;
  }

  async secureData(objects: any[]): Promise<void> {
    try {
      const { dispatch } = this.reduxStore;
      officeActions.toggleIsConfirmFlag(false)(dispatch);

      setTimeout(async () => {
        const excelContext = await officeApiHelper.getExcelContext();
        await officeApiWorksheetHelper.checkIfAnySheetProtected(excelContext, objects);

        for (const object of objects) {
          // Bypass the image object if it was deleted from worksheet manually to not block
          // the queue of clear data operation.
          let triggerClearData = true;
          if (object?.importType === ObjectImportType.IMAGE) {
            const shapeInWorksheet =
              object?.bindId && (await officeShapeApiHelper.getShape(excelContext, object.bindId));
            if (!shapeInWorksheet) {
              triggerClearData = false;
            }
          }
          triggerClearData &&
            this.reduxStore.dispatch(clearDataRequested(object.objectWorkingId, object.importType));
        }
      }, 0);
    } catch (error) {
      errorService.handleError(error);
    }
  }

  /**
   * Checks if we are running on macOS Safari based client
   * Checking only for webkit or safari is not enought:
   * https://security.stackexchange.com/questions/126407/why-does-chrome-send-four-browsers-in-the-user-agent-header
   *
   * @returns true if user agent is instance of mac desktop or safari
   */
  isMacAndSafariBased(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();

    const isMacintosh = userAgent.includes('macintosh');
    const isWebkit = userAgent.includes('applewebkit');
    const isChrome = userAgent.includes('chrome');

    return isMacintosh && isWebkit && !isChrome;
  }

  /**
   * Checks whether the Excel API supports plugin features
   * and updates the redux store with the API support status
   */
  initSupportedFeaturesFlags(): void {
    const isShapeAPISupported = officeContext.isShapeAPISupported();
    const isPivotTableSupported = officeContext.isPivotTableSupported();
    const isInsertWorksheetAPISupported = officeContext.isInsertWorksheetAPISupported();
    const isAdvancedWorksheetTrackingSupported =
      officeContext.isAdvancedWorksheetTrackingSupported();

    this.reduxStore.dispatch(officeActions.setIsShapeAPISupported(isShapeAPISupported));
    this.reduxStore.dispatch(officeActions.setIsPivotTableSupported(isPivotTableSupported));
    this.reduxStore.dispatch(
      officeActions.setIsInsertWorksheetAPISupported(isInsertWorksheetAPISupported)
    );
    this.reduxStore.dispatch(
      officeActions.setIsAdvancedWorksheetTrackingSupported(isAdvancedWorksheetTrackingSupported)
    );
  }
}

export const homeHelper = new HomeHelper();
