import { waitAndClick } from '../utils/click-helper';
import OfficeWorksheet from './office.worksheet';
import settings from '../../config';
import pluginRightPanel from '../plugin/plugin.right-panel';
import { logStep, logFirstStep } from '../utils/allure-helper';

const OfficeLogin = function () {
  const usernameInput = '#i0116';
  const nextBtn = '#idSIButton9';
  const passwordInput = '#i0118';
  const fileName = 'office.login.js';

  this.login = (username, password) => {
    logStep(`Introducing Username and Password in Excel...    [${fileName} - login()]`);
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
   */
  this.openExcelAndLoginToPlugin = (
    username = settings.env.username,
    password = settings.env.password,
    width = 1500,
    isValidCredentials = true
  ) => {
    logFirstStep(`+ Opening Excel and Login to Plugin...    [${fileName} - openExcelAndLoginToPlugin()]`);
    browser.setWindowSize(width, 1100);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      this.login(settings.officeOnline[settings.args.lang].username, settings.officeOnline[settings.args.lang].password);
    }
    OfficeWorksheet.createNewWorkbook();
    logStep(`Getting Language and Region for Excel logged in user...    [${fileName} - openExcelAndLoginToPlugin()]`);
    browser.config.languageRegion = $('html').getAttribute('lang');
    OfficeWorksheet.openPlugin();
    pluginRightPanel.loginToPlugin(username, password, isValidCredentials);
  };
};


export default new OfficeLogin();
