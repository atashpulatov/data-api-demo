import { RunOutsideOfficeError } from '../../error/run-outside-office-error';
import { OfficeSettingsEnum } from '../../constants/office-constants';

class OfficeStoreHelper {
  errorService: any;

  init(errorService: any): void {
    this.errorService = errorService;
  }

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
   * Set value of isFileSecured flag in Office settings
   *
   * @param  value Key used by Office Api to determine value from settings
   */
  setFileSecuredFlag = (value: boolean): void =>
    this.setPropertyValue(OfficeSettingsEnum.isSecured, value);

  /**
   * Set value of isClearDataFailed flag in Office settings
   *
   * @param propertyName Key used by Office Api to determine value from settings
   */
  setIsClearDataFailed = (value: boolean): void =>
    this.setPropertyValue(OfficeSettingsEnum.isClearDataFailed, value);

  /**
   * Return value from Office settings specifying value of isFileSecured flag
   *
   * @return isFileSecured flag
   */
  isFileSecured = (): boolean => this.getPropertyValue(OfficeSettingsEnum.isSecured);

  /**
   * Return value from Office settings specifying value of isClearDataFailed flag
   *
   * @return isClearDataFailed flag
   */
  isClearDataFailed = (): boolean => this.getPropertyValue(OfficeSettingsEnum.isClearDataFailed);

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
      this.errorService.handleError(error);
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
      this.errorService.handleError(error);
    }
  };
}

const officeStoreHelper = new OfficeStoreHelper();
export default officeStoreHelper;
