import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToRightPanelFrame, changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('F25968 - Dynamically update numbers of objects displayed next to categories in filter panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('TC54853 refresh button and filter panel', () => {
    // open import data popup
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();

    // apply filters and import the last visualization from the list
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Owner', 'a');
    PluginPopup.tickFilterCheckBox('Owner', 'Administrator');
    PluginPopup.clickHeader('Name');
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();
    PluginPopup.clickImport();
    PluginPopup.importVisualization();
    waitForNotification();

    // delete data from excel range and refresh
    OfficeWorksheet.clearExcelRange('A2:F15');
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    browser.pause(2222);

    // apply date filtering and import a basic report
    OfficeWorksheet.selectCell('Z1');
    PluginRightPanel.clickAddDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Modified');
    PluginPopup.clickAllPanelElement('Last Quarter.');
    PluginPopup.importObject(objectsList.reports.basicReport);
    waitForNotification();

    // clear data then view data
    PluginRightPanel.clickSettings();
    browser.pause(1555); // wait for success notification to disappear
    PluginRightPanel.clearData();
    PluginRightPanel.viewDataBtn();
    waitForNotification();
    PluginRightPanel.closeAllNotificationsOnHover();
    switchToRightPanelFrame();

    // logout
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickLogout();
    browser.pause(1999); // wait for login view to be rendered
    expect($(rightPanelSelectors.loginRightPanelBtn).isExisting()).toBe(true);
  });
});
