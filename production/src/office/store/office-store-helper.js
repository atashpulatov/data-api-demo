import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { RunOutsideOfficeError } from '../../error/run-outside-office-error';

/* global Office */

class OfficeStoreHelper {
  init = (errorService) => {
    this.errorService = errorService;
  };

  /**
  * Return reference to Office settings that is required in order to use Office Api
  *
  * @return {Office} reference to Office settings
  * @throws Error when cannot reach Office Api
  */
  getOfficeSettings = () => {
    if (Office === undefined || Office.context === undefined || Office.context.document === undefined) {
      throw new RunOutsideOfficeError();
    }

    return Office.context.document.settings;
  };

  /**
  * Set value of isFileSecured flag in Office settings
  *
  * @param {String} value Key used by Office Api to determine value from settings
  */
  setFileSecuredFlag = (value) => this.setPropertyValue(officeProperties.isSecured, value);

  /**
  * Set value of isClearDataFailed flag in Office settings
  *
  * @param {String} propertyName Key used by Office Api to determine value from settings
  */
  setIsClearDataFailed = (value) => this.setPropertyValue(officeProperties.isClearDataFailed, value);

  /**
  * Return value from Office settings specifying value of isFileSecured flag
  *
  * @return {Boolean} isFileSecured flag
  */
  isFileSecured = () => this.getPropertyValue(officeProperties.isSecured);

  /**
  * Return value from Office settings specifying value of isClearDataFailed flag
  *
  * @return {Boolean} isClearDataFailed flag
  */
  isClearDataFailed = () => this.getPropertyValue(officeProperties.isClearDataFailed);

  /**
  * Set value in Office settings corresponding to passed key
  *
  * @param {String} propertyName Key used by Office Api to determine value from settings
  * @param {*} value Value to be saved in Office settings
  */
  setPropertyValue = (propertyName, value) => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(propertyName, value);
      settings.saveAsync();
    } catch (error) {
      this.errorService.handleError(error);
    }
  };

  /**
  * Return value from Office settings corresponding to passed key
  *
  * @param {String} propertyName Key used by Office Api to determine value from settings
  * @return {*} value from Office
  */
  getPropertyValue = (propertyName) => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(propertyName);
    } catch (error) {
      this.errorService.handleError(error);
    }
  };
}

const officeStoreHelper = new OfficeStoreHelper();
export default officeStoreHelper;
