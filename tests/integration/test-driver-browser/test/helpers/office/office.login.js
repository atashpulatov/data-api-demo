import { waitAndClick } from '../utils/click-helper';
import OfficeWorksheet from './office.worksheet';
import settings from '../../config';
import pluginRightPanel from '../plugin/plugin.right-panel';

const OfficeLogin = function () {
  const usernameInput = '#i0116';
  const nextBtn = '#idSIButton9';
  const passwordInput = '#i0118';

  this.login = (username, password) => {
    $(usernameInput).waitForDisplayed(3000);
    $(usernameInput).setValue(username);
    waitAndClick($(nextBtn));
    $(passwordInput).waitForDisplayed(3000);
    $(passwordInput).setValue(password);
    waitAndClick($(nextBtn));
    waitAndClick($(nextBtn));
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

    //Getting Language and Region for Excel logged in user
    browser.config.languageRegion = $('html').getAttribute('lang');

    OfficeWorksheet.openPlugin();
    pluginRightPanel.loginToPlugin(username, password, isValidCredentials);
  }
};


export default new OfficeLogin();
