import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPluginFrame, switchToRightPanelFrame, switchToExcelFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';


describe('TS41441 - E2E Sanity checks', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC49134] Part III - Formatting | Secure Data - Additional Checks', () => {
    const user2 = { username: 'user2', password: 'user2' };

    // should open a new sheet & import a report with number formatting
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.numberFormating, false);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    /* TODO: For the already imported objects apply some additional Excel formatting, available options are:
    - applying table formatting
    - different number formats
    - conditional formatting
    - table styles (only for Excel Desktop version)
    - cell content alignment and fonts
    */

    // should clear data
    browser.pause(1000);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clearData();
    browser.pause(4000);

    // should assert data was cleared
    switchToExcelFrame();


    // should log out
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickLogout();

    // should log in with Tim user
    browser.pause(1000);
    switchToRightPanelFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    PluginRightPanel.clickLoginRightPanelBtn();
    changeBrowserTab(2);
    PluginRightPanel.enterCredentialsAndPressLoginBtn(user2.username, user2.password);
    changeBrowserTab(1);

    // should click "View Data" and close the "Refresh All Data" pop-up
    browser.pause(1000);
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    switchToExcelFrame();

    // waitForRefreshAllToFinish();
    browser.pause(10000); // TODO: wait for popup to show "Refreshing complete!" message, instead of waiting
    waitAndClick($(popupSelectors.closeRefreshAll));

    // should assert data was refreshed
    switchToExcelFrame();
  });
});
