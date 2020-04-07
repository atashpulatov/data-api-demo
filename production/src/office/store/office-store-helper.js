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

  setFileSecuredFlag = (value) => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(officeProperties.isSecured, value);
      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  };

  isFileSecured = () => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(officeProperties.isSecured);
    } catch (error) {
      errorService.handleError(error);
    }
  };

  setIsClearDataFailed = (value) => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(officeProperties.isClearDataFailed, value);
      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  };

  isClearDataFailed = () => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(officeProperties.isClearDataFailed);
    } catch (error) {
      errorService.handleError(error);
    }
  };
}

const officeStoreHelper = new OfficeStoreHelper();
export default officeStoreHelper;
