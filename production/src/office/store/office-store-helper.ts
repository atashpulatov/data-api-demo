import { errorService } from '../../error/error-service';

import { RunOutsideOfficeError } from '../../error/run-outside-office-error';

class OfficeStoreHelper {
  /**
   * Return reference to Office settings that is required in order to use Office Api
   *
   * @return reference to Office settings
   * @throws Error when cannot reach Office Api
   */
  getOfficeSettings(): Office.Settings {
    if (
      Office === undefined ||
      Office.context === undefined ||
      Office.context.document === undefined
    ) {
      throw new RunOutsideOfficeError();
    }

    return Office.context.document.settings;
  }

  /**
   * Set value in Office settings corresponding to passed key
   *
   * @param propertyName Key used by Office Api to determine value from settings
   * @param value Value to be saved in Office settings
   */
  setPropertyValue = (propertyName: string, value: any): void => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(propertyName, value);
      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  };

  /**
   * Return value from Office settings corresponding to passed key
   *
   * @param propertyName Key used by Office Api to determine value from settings
   * @return value from Office
   */
  getPropertyValue = (propertyName?: string): any => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(propertyName);
    } catch (error) {
      errorService.handleError(error);
    }
  };
}

const officeStoreHelper = new OfficeStoreHelper();
export default officeStoreHelper;
