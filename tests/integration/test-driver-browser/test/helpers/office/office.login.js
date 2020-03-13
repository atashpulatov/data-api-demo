import { waitAndClick } from '../utils/click-helper';
import OfficeWorksheet from './office.worksheet';
import settings from '../../config';
import pluginRightPanel from '../plugin/plugin.right-panel';

const OfficeLogin = function () {
  const usernameInput = '#i0116';
  const nextBtn = '#idSIButton9';
  const passwordInput = '#i0118';

  this.login = function (username, password) {
    $(usernameInput).setValue(username);
    waitAndClick($(nextBtn));
    browser.pause(1666);
    $(passwordInput).setValue(password);
    $(nextBtn).click();
    $(nextBtn).click();
  };

  /**
   * Login to Office, open Excel workbook, starts plugin and log in to plugin based on the users data from config file
   *
   * @memberof OfficeLogin
   */
  this.openExcelAndLoginToPlugin = (
    username = settings.env.username,
    password = settings.env.password,
    width = 1500,
    isValidCredentials = true
  ) => {
    browser.setWindowSize(width, 1100);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      this.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    pluginRightPanel.loginToPlugin(username, password, isValidCredentials);
  }
};


export default new OfficeLogin();
