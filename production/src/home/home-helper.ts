import { browserHelper } from '../helpers/browser-helper';
import { storageHelper } from '../helpers/storage-helper';
import officeStoreHelper from '../office/store/office-store-helper';

import { reduxStore } from '../store';

import { officeContext } from '../office/office-context';
import { configActions } from '../redux-reducer/config-reducer/config-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';

const SHOW_HIDDEN_KEY = 'showHidden';

export class HomeHelper {
  getParsedCookies(): any {
    // F25871: Unused method since all cookies are set as HttpOnly so we cannot access them with JS
    const cookieJar = browserHelper.getDocumentCookie();
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
      const showHiddenOfficeSettings = officeStoreHelper.getPropertyValue(SHOW_HIDDEN_KEY);
      const showHiddenLocalStorage = storageHelper.getStorageItem(SHOW_HIDDEN_KEY);
      const showHidden = showHiddenOfficeSettings || showHiddenLocalStorage !== 'false';
      const { dispatch } = reduxStore;
      dispatch(configActions.setShowHidden(showHidden));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Checks whether the Excel API supports plugin features
   * and updates the redux store with the API support status
   */
  initSupportedFeaturesFlags(): void {
    const isShapeAPISupported = officeContext.isShapeAPISupported();
    const isOverviewWindowAPISupported = officeContext.isOverviewWindowAPISupported();
    const isPivotTableSupported = officeContext.isPivotTableSupported();
    const isInsertWorksheetAPISupported = officeContext.isInsertWorksheetAPISupported();
    const isAdvancedWorksheetTrackingSupported =
      officeContext.isAdvancedWorksheetTrackingSupported();

    reduxStore.dispatch(officeActions.setIsShapeAPISupported(isShapeAPISupported));
    reduxStore.dispatch(
      officeActions.setIsOverviewWindowAPISupported(isOverviewWindowAPISupported)
    );
    reduxStore.dispatch(officeActions.setIsPivotTableSupported(isPivotTableSupported));
    reduxStore.dispatch(
      officeActions.setIsInsertWorksheetAPISupported(isInsertWorksheetAPISupported)
    );
    reduxStore.dispatch(
      officeActions.setIsAdvancedWorksheetTrackingSupported(isAdvancedWorksheetTrackingSupported)
    );
  }
}

export const homeHelper = new HomeHelper();
