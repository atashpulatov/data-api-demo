import { officeProperties } from '../office/office-properties';
import { RunOutsideOfficeError } from '../error/run-outside-office-error';


class BrowserStoreService {
  getOfficeSettings = () => {
    const { Office } = window;
    if (Office === undefined || Office.context === undefined || Office.context.document === undefined) {
      throw new RunOutsideOfficeError();
    }
    return Office.context.document.settings;
  }

  preserveBrowsingFilters = (browsingFiltersApplied) => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(officeProperties.browsingFiltersApplied, browsingFiltersApplied);
      settings.saveAsync();
    } catch (ex) {
      console.warn('Filters are not stored to office settings');
    }
  }

  getBrowsingFilters = () => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(officeProperties.browsingFiltersApplied);
    } catch (ex) {
      console.warn('Filters couldn\'t be obtained from office settings');
      return {};
    }
  }
}

export const browserStoreService = new BrowserStoreService();
