import { officeProperties } from '../office/office-properties';
import { RunOutsideOfficeError } from '../error/run-outside-office-error';

// const { Office } = window;

class BrowserStoreService {
    getOfficeSettings = () => {
      if (Office === undefined || Office.context === undefined || Office.context.document === undefined) {
        throw new RunOutsideOfficeError();
      }
      return Office.context.document.settings;
    }

    preserveBrowsingFilters = (browsingFiltersApplied) => {
      const settings = this.getOfficeSettings();
      settings.set(officeProperties.browsingFiltersApplied, browsingFiltersApplied);
      settings.saveAsync();
    }

    getBrowsingFilters = () => {
      const settings = this.getOfficeSettings();
      return settings.get(officeProperties.browsingFiltersApplied);
    }
}

export const browserStoreService = new BrowserStoreService();
