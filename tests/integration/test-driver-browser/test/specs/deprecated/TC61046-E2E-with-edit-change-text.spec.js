import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { objectsList } from '../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../helpers/utils/wait-helper';
import { switchToPluginFrame, switchToExcelFrame, changeBrowserTab } from '../../helpers/utils/iframe-helper';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  // Create test for each visType defined in visualizations
  it(`[TC61046] E2E with Complex dossier (20 visualizations) `, () => {
    OfficeWorksheet.selectCell('A3');

    // Import first visualization
    PluginRightPanel.clickImportDataButton();
    const dossierObject = objectsList.dossiers.userActivityDossier;
    PluginPopup.openDossier(dossierObject.name, null, false);
    PluginPopup.selectAndImportVisualization(dossierObject.visualizations.accounts);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(3000);

    // Import second visualization
    OfficeWorksheet.selectCell('E3');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name, null, false);
    PluginPopup.selectAndImportVisualization(dossierObject.visualizations.dailyActiveAccounts);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(3000);

    // Change text in cell A4
    OfficeWorksheet.changeTextInCell('A4', 'Text');
    browser.pause(1000);

    // Refresh All
    PluginRightPanel.refreshAll();
    waitForNotification();
    PluginRightPanel.closeAllNotificationsOnHover();
    browser.pause(3000);

    // Edit last imported report
    PluginRightPanel.editObject(1);
    browser.pause(3000);

    PluginPopup.selectAndImportVisualization(dossierObject.visualizations.accounts);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(3000);


    OfficeWorksheet.selectCell('E4');
    browser.pause(2000);
    const cellE4 = '#gridRows > div:nth-child(4) > div:nth-child(1) > div';
    expect($(cellE4).getText()).toBeGreaterThan(0);

    // Log out
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(3000);
  });
});
