import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import settings from '../../../config';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToRightPanelFrame, switchToPluginFrame } from '../../../helpers/utils/iframe-helper';

describe('F25968 - Dynamically update numbers of objects displayed next to categories in filter panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('TC54853 refresh button and filter panel', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Owner', 'a');
    PluginPopup.tickFilterCheckBox('Owner', 'Administrator');
    PluginPopup.clickHeader('Name');
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();
    PluginPopup.clickImport();
    PluginPopup.importVisualization();
    waitForNotification();
    OfficeWorksheet.clearExcelRange('A2:F15');
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    browser.pause(2222);
    OfficeWorksheet.selectCell('Z1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Modified');
    PluginPopup.checkAllPanelElement('Last Quarter.');
    PluginPopup.importObject('Demo Report');
    waitForNotification();
    PluginRightPanel.clickSettings();
    browser.pause(1555); // wait for success notification to disappear
    PluginRightPanel.clearData();
    PluginRightPanel.viewDataBtn();
    PluginPopup.closeRefreshAll();
    switchToRightPanelFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickLogout();
    browser.pause(1999); // wait for login view to be rendered
    expect($('#login-btn').isExisting()).toBe(true);
  });
});
