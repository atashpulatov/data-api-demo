import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import settings from '../../../config';

describe('F24086 Improved browsing by adding filters', () => {
  beforeEach(() => {
    browser.setWindowSize(1500, 1100);
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

  it('TC53430 Refreshing and filtering during refresh', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    // browser.debug();
    PluginPopup.selectFirstObject();
    PluginPopup.clickRefreshObjectTable();
    // apply filters
    browser.pause(9999);
    PluginPopup.clickFilterButton();
    // browser.debug();
    browser.pause(999);
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    PluginPopup.tickFilterCheckBox('Type', 'Report');
    // // scroll bottom
    browser.pause(999);
    PluginPopup.clickFilterButton();
    browser.pause(9999);

    PluginPopup.scrollTable(['End']);
    browser.pause(9999);
    // expect($('.all-panel__content .category-list-row.disabled input').isSelected()).toBe(false);
  });
});
