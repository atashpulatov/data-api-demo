import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, changeBrowserTab } from '../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../helpers/utils/wait-helper';

describe('F24751 - Import report with or without subtotals', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });
  it('[TC54788] -  Turning  OFF subtotals after importing report with subtotals.', () => {
    const objectName = 'Subtotals - display all types';
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.openPrepareData(objectName);
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Region', []]]);
    PluginPopup.selectAllFilters();
    PluginPopup.clickImport();
    waitForNotification();
    switchToExcelFrame();
    const B17 = '#gridRows > div:nth-child(17) > div:nth-child(2) > div > div';
    OfficeWorksheet.selectCell('B17');
    expect($(B17).getText()).toEqual('$3,945,456');
    browser.pause(1000);
    waitForNotification();
    PluginRightPanel.closeAllNotificationsOnHover();
    switchToPluginFrame();
    PluginRightPanel.editObject(1);
    browser.pause(1000);
    switchToPluginFrame();
    PluginPopup.clickSubtotalToggler();
    PluginPopup.clickImport();
    waitForNotification();
    browser.pause(3000);
    switchToExcelFrame();
    const B9 = '#gridRows > div:nth-child(9) > div:nth-child(2) > div > div';
    OfficeWorksheet.selectCell('B9');
    expect($(B9).getText()).toEqual('$3,902,762');
    browser.pause(1000);
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(3000);
  });
});
