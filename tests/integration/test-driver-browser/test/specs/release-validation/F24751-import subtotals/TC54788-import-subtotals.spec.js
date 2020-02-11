import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import settings from '../../../config';


describe('TC54788 - Import subtotals', () => {
  beforeEach(() => {
    browser.setWindowSize(1900, 900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });
  it('Enable and disable subtotals', () => {
    const objectName = 'Subtotals - display all types';
    PluginRightPanel.clickImportDataButton();
    PluginPopup.prepareData(objectName);
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Region', []]]);
    PluginPopup.selectAllFilters();
    PluginPopup.clickImport();
    waitForNotification();
    switchToExcelFrame();
    const B17 = '#gridRows > div:nth-child(17) > div:nth-child(2) > div > div';
    OfficeWorksheet.selectCell('B17')
    expect($(B17).getText()).toEqual('$3,945,456')
    browser.pause(1000);
    PluginRightPanel.edit();
    browser.pause(1000);
    switchToPluginFrame();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.clickSubtotalToggler();
    PluginPopup.clickImport();
    waitForNotification();
    browser.pause(3000);
    switchToExcelFrame();
    const B9 = '#gridRows > div:nth-child(9) > div:nth-child(2) > div > div'
    OfficeWorksheet.selectCell('B9')
    expect($(B9).getText()).toEqual('$3,902,762')
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(3000);
  });
});
