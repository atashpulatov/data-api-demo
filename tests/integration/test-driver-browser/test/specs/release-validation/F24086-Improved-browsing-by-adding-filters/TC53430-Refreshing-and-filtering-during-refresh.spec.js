import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import settings from '../../../config';

describe('F24086 Improved browsing by adding filters', () => {
  beforeEach(() => {
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
    PluginPopup.selectFirstObject();
    PluginPopup.clickRefreshObjectTable();
    applyFilters();
    PluginPopup.selectFirstObject();
    browser.keys(['End']);
    browser.debug();
    // expect($('.all-panel__content .category-list-row.disabled input').isSelected()).toBe(false);
  });
});
function applyFilters() {
  PluginPopup.clickFilterButton();
  PluginPopup.clickAllButton('Owner');
  PluginPopup.clickSelectAll();
  PluginPopup.tickFilterCheckBox('Type', 'Report');
}
