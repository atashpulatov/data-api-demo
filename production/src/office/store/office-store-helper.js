import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { RunOutsideOfficeError } from '../../error/run-outside-office-error';
import { errorService } from '../../error/error-handler';

/* global Office */

class OfficeStoreHelper {
  getOfficeSettings = () => {
    if (Office === undefined || Office.context === undefined || Office.context.document === undefined) {
      throw new RunOutsideOfficeError();
    }

    return Office.context.document.settings;
  };

  setFileSecuredFlag = (value) => this.setPropertyValue(officeProperties.isSecured, value);

  isFileSecured = () => this.getPropertyValue(officeProperties.isSecured);

  setIsClearDataFailed = (value) => this.setPropertyValue(officeProperties.isClearDataFailed, value);

  isClearDataFailed = () => this.getPropertyValue(officeProperties.isClearDataFailed);

  setPropertyValue = (propertyName, value) => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(propertyName, value);
      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  };

  getPropertyValue = (propertyName) => {
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
